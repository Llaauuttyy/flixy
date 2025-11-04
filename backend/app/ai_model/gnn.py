import pandas as pd
import torch
from torch import nn
from torch_geometric.data import HeteroData
from torch_geometric.nn import SAGEConv, Linear
from sklearn.preprocessing import MinMaxScaler, MultiLabelBinarizer
import numpy as np

class SimpleHeteroGNN(nn.Module):
    def __init__(self, user_in_dim, movie_in_dim, hidden_dim):
        super().__init__()
        self.user_lin = Linear(user_in_dim, hidden_dim)
        self.movie_lin = Linear(movie_in_dim, hidden_dim)

        self.user_to_movie1 = SAGEConv((-1, -1), hidden_dim)
        self.movie_to_user1 = SAGEConv((-1, -1), hidden_dim)
        self.user_to_movie2 = SAGEConv((-1, -1), hidden_dim)
        self.movie_to_user2 = SAGEConv((-1, -1), hidden_dim)
        self.user_to_user = SAGEConv((-1, -1), hidden_dim)

        self.predictor = nn.Sequential(
            nn.Linear(hidden_dim * 2, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, 1),
            nn.Sigmoid()
        )

    def forward(self, data):
        user_x = torch.relu(self.user_lin(data["user"].x))
        movie_x = torch.relu(self.movie_lin(data["movie"].x))

        edge_index_rated = data["user", "rated", "movie"].edge_index
        edge_index_rated_rev = torch.stack([edge_index_rated[1], edge_index_rated[0]])

        movie_x = torch.relu(self.user_to_movie1((user_x, movie_x), edge_index_rated))
        user_x = torch.relu(self.movie_to_user1((movie_x, user_x), edge_index_rated_rev))
        movie_x = torch.relu(self.user_to_movie2((user_x, movie_x), edge_index_rated))
        user_x = torch.relu(self.movie_to_user2((movie_x, user_x), edge_index_rated_rev))

        if ('user', 'follows', 'user') in data.edge_types:
            edge_index_uu = data['user', 'follows', 'user'].edge_index
            user_x = torch.relu(self.user_to_user((user_x, user_x), edge_index_uu))

        src, dst = edge_index_rated
        edge_emb = torch.cat([user_x[src], movie_x[dst]], dim=1)
        pred = self.predictor(edge_emb).squeeze()
        pred = pred * 4 + 1
        return pred


class GNNRecommender:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.df = None
        self.movie_features_tensor = None
        self.df_relations = None

    def load_data(self, movie_ratings, user_relations):
        df = pd.DataFrame([vars(m) for m in movie_ratings])
        df["genres"] = df["genres"].apply(lambda x: x.split(", ") if isinstance(x, str) else [])
        df["imdb_rating_scaled"] = MinMaxScaler().fit_transform(df[["imdb_rating"]])
        df["duration_scaled"] = MinMaxScaler().fit_transform(df[["duration"]])

        mlb = MultiLabelBinarizer()
        genre_features = pd.DataFrame(mlb.fit_transform(df["genres"]), columns=mlb.classes_)
        movie_features = pd.concat(
            [df[["imdb_rating_scaled", "duration_scaled"]].reset_index(drop=True), genre_features],
            axis=1
        )
        movie_features_tensor = torch.tensor(movie_features.values, dtype=torch.float)

        df["movie_idx"] = df["movie_id"].astype("category").cat.codes
        df["user_idx"] = df["user_id"].astype("category").cat.codes

        self.user_id_to_idx = dict(zip(
            df["user_id"].astype("category").cat.categories,
            df["user_id"].astype("category").cat.codes
        ))
        self.movie_id_to_idx = dict(zip(
            df["movie_id"].astype("category").cat.categories,
            df["movie_id"].astype("category").cat.codes
        ))

        df_relations = pd.DataFrame([vars(m) for m in user_relations])

        self.df = df
        self.movie_features_tensor = movie_features_tensor
        self.df_relations = df_relations

    def build_graph(self, df, movie_features_tensor, df_follows=None):
        data = HeteroData()
        user_features = df.groupby("user_idx").agg({
            "rating": ["mean", "count"]
        }).fillna(0)
        user_features.columns = ["avg_rating", "num_ratings"]
        user_features_scaled = MinMaxScaler().fit_transform(user_features)
        data["user"].x = torch.tensor(user_features_scaled, dtype=torch.float)
        data["movie"].x = movie_features_tensor
        edge_index_rated = torch.tensor([df["user_idx"].values, df["movie_idx"].values], dtype=torch.long)
        data["user", "rated", "movie"].edge_index = edge_index_rated
        data["user", "rated", "movie"].edge_attr = torch.tensor(df["rating"].values, dtype=torch.float).view(-1, 1)
        if df_follows is not None and not df_follows.empty:
            user_id_to_idx = dict(zip(
                df["user_id"].astype("category").cat.categories,
                df["user_idx"].astype("category").cat.codes
            ))
            src = df_follows["follower_id"].map(user_id_to_idx).dropna().astype(int)
            dst = df_follows["followed_id"].map(user_id_to_idx).dropna().astype(int)
            if len(src) > 0 and len(dst) > 0:
                data["user", "follows", "user"].edge_index = torch.tensor([src.values, dst.values], dtype=torch.long)
        return data

    def train(self, movie_ratings, user_relations):
        self.load_data(movie_ratings, user_relations)
        data = self.build_graph(self.df, self.movie_features_tensor, self.df_relations).to(self.device)
        self.model = SimpleHeteroGNN(
            user_in_dim=data["user"].x.size(1),
            movie_in_dim=data["movie"].x.size(1),
            hidden_dim=64
        ).to(self.device)

        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)
        criterion = nn.MSELoss()
        edge_attr = data["user", "rated", "movie"].edge_attr.squeeze()

        for epoch in range(50):
            self.model.train()
            optimizer.zero_grad()
            pred = self.model(data)
            mask = ~torch.isnan(edge_attr)
            loss = criterion(pred[mask], edge_attr[mask])
            loss.backward()
            optimizer.step()
            if epoch % 10 == 0:
                print(f"Epoch {epoch} - Loss: {loss:.4f}")

        print("✅ Entrenamiento finalizado.")

    def recommend(self, user_id: int, unwatched_movies):
        if self.model is None:
            raise RuntimeError("El modelo no está entrenado.")

        if user_id not in self.user_id_to_idx:
            raise ValueError(f"El usuario {user_id} no está en el modelo entrenado.")

        user_idx = self.user_id_to_idx[user_id]

        candidates = []
        for movie in unwatched_movies:
            if movie.id not in self.movie_id_to_idx:
                # ignorar películas nuevas
                continue
            m_idx = self.movie_id_to_idx[movie.id]
            candidates.append((user_idx, m_idx))

        if not candidates:
            raise ValueError("No hay películas válidas para recomendar.")

        temp_df = pd.DataFrame(candidates, columns=["user_idx", "movie_idx"])
        temp_df["user_id"] = user_id
        temp_df["movie_id"] = [m for (_, m) in candidates]
        temp_df["rating"] = np.nan

        data_pred = self.build_graph(
            pd.concat([self.df, temp_df], ignore_index=True),
            self.movie_features_tensor,
            self.df_relations
        ).to(self.device)

        self.model.eval()
        with torch.no_grad():
            preds = self.model(data_pred).cpu().numpy()

        temp_df["predicted_rating"] = preds[-len(temp_df):]
        return temp_df


class GNNRatingTrainModel:
    def __init__(self, movie_ratings):
        self.user_id = movie_ratings.user_id
        self.movie_id = movie_ratings.movie_id
        self.rating = movie_ratings.rating
        self.year = movie_ratings.movie.year
        self.imdb_rating = movie_ratings.movie.imdb_rating
        self.genres = movie_ratings.movie.genres
        self.countries = movie_ratings.movie.countries
        self.duration = movie_ratings.movie.duration
        self.cast = movie_ratings.movie.cast
        self.directors = movie_ratings.movie.directors
        self.writers = movie_ratings.movie.writers