import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
from sklearn.preprocessing import LabelEncoder


FEATURES = 3
RATING_MIN = 1
RATING_MAX = 5
MAX_EPOCS = 1500
MIN_RATING_PREDICTION = 4.5


class FactorizationMachine(nn.Module):
    def __init__(self, n_users, n_movies, n_genres, k):
        super().__init__()
        self.user_emb = nn.Embedding(n_users, k)
        self.movie_emb = nn.Embedding(n_movies, k)
        self.genre_emb = nn.Embedding(n_genres, k)
        self.user_bias = nn.Embedding(n_users, 1)
        self.movie_bias = nn.Embedding(n_movies, 1)
        self.linear = nn.Linear(FEATURES, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        user_v = self.user_emb(x[:, 0])
        movie_v = self.movie_emb(x[:, 1])
        genre_v = self.genre_emb(x[:, 2])
        inter = (user_v * movie_v + user_v * genre_v + movie_v * genre_v).sum(1, keepdim=True)
        bias = self.user_bias(x[:, 0]) + self.movie_bias(x[:, 1])
        out = self.linear(x.float()) + inter + bias
        out = self.sigmoid(out)  # salida en [0, 1]
        return out


class FMModelHandler():
    def __init__(self, movies_to_train):
        encoders, X, y, n_users, n_movies, n_genres, k = self.get_variables(movies_to_train)
        self.model = FactorizationMachine(n_users, n_movies, n_genres, k)
        self.encoders = encoders

        self.X = X
        self.y = y

        self.train()

    def build_data(reviews, for_prediction=False):
        data = pd.DataFrame(columns=["user_id", "movie_id", "genre", "rating"])
        
        for review in reviews:
            movie_data = review.movie

            user_id = review.user_id
            movie_id = int(movie_data.id)
            genre = movie_data.genres.split(",")[0].strip().lower()
            year = int(movie_data.year)
            duration = int(movie_data.duration)
            rating = int(review.rating)

            new_row = pd.DataFrame({
                "user_id": [user_id],
                "movie_id": [movie_id],
                "genre": [genre],
                "rating": [rating]
            })
            data = pd.concat([data, new_row], ignore_index=True)

        if for_prediction:
            # Dropeo columna rating.
            data = data.drop(columns=["rating"])

        return data

    def get_variables(self, data):
        features = data.columns.tolist()
        features.remove("rating")

        # Encodeo solo las categoricas
        encoders = {col: LabelEncoder().fit(data[col]) for col in features}
        for col in features:
            data[col] = encoders[col].transform(data[col])

        # Normalizar ratings [1,5] -> [0,1]
        data["rating_norm"] = (data["rating"] - RATING_MIN) / (RATING_MAX - RATING_MIN)
        data["rating_norm"] = pd.to_numeric(data["rating_norm"], errors="coerce")

        # Convierto en tensores
        X = torch.tensor(data[features].values, dtype=torch.long)

        y = torch.tensor(data["rating_norm"].values, dtype=torch.float32).view(-1, 1)

        # Cantidades unicas
        n_users = len(encoders["user_id"].classes_)
        n_movies = len(encoders["movie_id"].classes_)
        n_genres = len(encoders["genre"].classes_)
        k = 8

        return encoders, X, y, n_users, n_movies, n_genres, k

    def train(self):
        optimizer = optim.Adam(self.model.parameters(), lr=0.01, weight_decay=1e-4)
        criterion = nn.MSELoss()

        for epoch in range(MAX_EPOCS):
            optimizer.zero_grad()
            y_pred = self.model(self.X)
            loss = criterion(y_pred, self.y)
            loss.backward()
            optimizer.step()

        print("Loss final:", round(loss.item(), 4))

    def predict(self, movies_to_predict):
        sample = movies_to_predict

        movie_ids_to_predict = movies_to_predict["movie_id"].tolist()

        for col, enc in self.encoders.items():
            sample[col] = enc.transform(sample[col])

        new = torch.tensor(sample.values, dtype=torch.long)
        pred_norm = self.model(new)

        movies_to_recommend = []

        for i, pred in enumerate(pred_norm):
            pred_rating = pred.item() * (RATING_MAX - RATING_MIN) + RATING_MIN

            if pred_rating >= MIN_RATING_PREDICTION:
                movies_to_recommend.append(movie_ids_to_predict[i])

        return movies_to_recommend