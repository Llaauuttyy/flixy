import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
from sklearn.preprocessing import LabelEncoder

RATING_MIN = 1
RATING_MAX = 5

# Dataset
# data = pd.DataFrame({
#     "user_id": [1, 2, 1, 3, 2, 3, 1, 1, 2],
#     "movie_id": [10, 10, 20, 30, 20, 10, 30, 40, 40],
#     "genre": ["action", "action", "drama", "comedy", "drama", "action", "comedy", "comedy", "comedy"],
#     "rating": [5, 5, 4, 2, 4, 5, 1, 2, 2],
# })

# 1 y 2 se parecen en un 100%
data1 = pd.DataFrame({
    "user_id": [
        # 1, 
        2, 1, 2, 1, 2, 1, 2, 1, 2,
        1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
        1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
        1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
        3, 4, 5, 3, 4, 5, 3, 4, 5, 3
    ],
    "movie_id": [
        # 10, 
        10, 11, 11, 12, 12, 13, 13, 14, 14,
        15, 15, 16, 16, 17, 17, 18, 18, 19, 19,
        20, 20, 21, 21, 22, 22, 23, 23, 24, 24,
        25, 25, 26, 26, 27, 27, 28, 28, 29, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ],
    "genre": [
        # "action", 
        "action", "drama", "drama", "comedy", "comedy", "thriller", "thriller", "romance", "romance",
        "sci-fi", "sci-fi", "drama", "drama", "action", "action", "comedy", "comedy", "thriller", "thriller",
        "romance", "romance", "sci-fi", "sci-fi", "drama", "drama", "action", "action", "comedy", "comedy",
        "thriller", "thriller", "romance", "romance", "sci-fi", "sci-fi", "drama", "drama", "action", "action",
        "comedy", "thriller", "romance", "sci-fi", "drama", "action", "thriller", "romance", "comedy", "sci-fi"
    ],
    "rating": [
        # 5, 
        1, 4, 4, 3, 3, 5, 5, 2, 2,
        4, 4, 3, 3, 5, 5, 4, 4, 2, 2,
        5, 5, 4, 4, 3, 3, 5, 5, 2, 2,
        4, 4, 3, 3, 5, 5, 4, 4, 2, 2,
        3, 4, 2, 5, 3, 4, 5, 2, 4, 3
    ]
})

# 1 y 2 se parecen un 90%
data2 = pd.DataFrame({
    "user_id": [
        # 1, 
        2, 1, 2, 1, 2, 3, 4, 5, 1,
        2, 1, 2, 3, 4, 5, 1, 2, 3, 4,
        5, 1, 2, 1, 2, 3, 4, 5, 1, 2,
        1, 2, 3, 4, 5, 1, 2, 1, 2, 3,
        4, 5, 1, 2, 3, 4, 5, 1, 2, 1
    ],
    "movie_id": [
        # 10, 
        10, 11, 11, 12, 12, 13, 14, 15, 16,
        16, 17, 17, 18, 19, 20, 21, 21, 22, 23,
        24, 25, 25, 26, 26, 27, 28, 29, 30, 30,
        31, 31, 32, 33, 34, 35, 35, 36, 36, 37,
        38, 39, 40, 40, 41, 42, 43, 44, 44, 45
    ],
    "genre": [
        # "action", 
        "action", "drama", "drama", "comedy", "comedy", "thriller", "action", "sci-fi", "drama",
        "drama", "action", "action", "comedy", "thriller", "sci-fi", "drama", "drama", "comedy", "action",
        "sci-fi", "thriller", "thriller", "action", "action", "comedy", "drama", "thriller", "comedy", "comedy",
        "drama", "drama", "action", "sci-fi", "thriller", "comedy", "comedy", "action", "action", "drama",
        "sci-fi", "thriller", "comedy", "comedy", "drama", "sci-fi", "action", "drama", "drama", "thriller"
    ],
    "rating": [
        # 5, 
        1, 4, 4, 3, 3, 2, 4, 5, 4,
        4, 5, 5, 2, 3, 4, 5, 5, 2, 4,
        3, 4, 4, 5, 4, 2, 3, 4, 5, 5,
        3, 3, 4, 5, 2, 4, 4, 5, 4, 3,
        5, 4, 3, 3, 4, 5, 4, 5, 5, 2
    ]
})

# 1 y 2 se parecen un 50%
data = pd.DataFrame({
    "user_id": [
        # 1, 
        2, 1, 2, 1, 2, 3, 4, 5, 1,
        2, 1, 2, 3, 4, 5, 1, 2, 3, 4,
        5, 1, 2, 1, 2, 3, 4, 5, 1, 2,
        1, 2, 3, 4, 5, 1, 2, 1, 2, 3,
        4, 5, 1, 2, 3, 4, 5, 1, 2, 1
    ],
    "movie_id": [
        # 10, 
        10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
        29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
        49, 50, 51, 52, 53, 54, 55, 56, 57, 58
    ],
    "genre": [
        # "action", 
        "action", "drama", "sci-fi", "comedy", "romance", "thriller", "drama", "sci-fi", "action",
        "thriller", "comedy", "romance", "drama", "action", "thriller", "drama", "comedy", "romance", "action",
        "sci-fi", "thriller", "comedy", "romance", "action", "drama", "thriller", "sci-fi", "comedy", "romance",
        "drama", "action", "thriller", "romance", "comedy", "sci-fi", "action", "thriller", "drama", "comedy",
        "romance", "sci-fi", "action", "drama", "thriller", "comedy", "romance", "sci-fi", "action", "thriller"
    ],
    "rating": [
        # 5, 
        1, 4, 2, 5, 2, 5, 4, 3, 5,
        3, 4, 2, 5, 3, 4, 5, 4, 2, 3,
        5, 2, 3, 4, 5, 2, 4, 3, 5, 4,
        3, 2, 4, 5, 3, 4, 2, 5, 4, 3,
        2, 5, 4, 3, 5, 2, 4, 3, 5, 4
    ]
})

# Codificar categorías
encoders = {col: LabelEncoder().fit(data[col]) for col in ["user_id", "movie_id", "genre"]}
for col, enc in encoders.items():
    data[col] = enc.transform(data[col])

print("Data")
print(data.head(20))

# Pasar ratings al intervalo [0, 1] 
# serían los valores [0, 0.25, 0.5, 0.75, 1] para ratings [1, 2, 3, 4, 5]
y_mean, y_min, y_max = data["rating"].mean(), data["rating"].min(), data["rating"].max()
data["rating_norm"] = (data["rating"] - RATING_MIN) / (RATING_MAX - RATING_MIN)

print(data["rating_norm"])

X = torch.tensor(data[["user_id", "movie_id", "genre"]].values, dtype=torch.long)
y = torch.tensor(data["rating_norm"].values, dtype=torch.float32).view(-1, 1)

# Parámetros
n_users = len(encoders["user_id"].classes_)
n_movies = len(encoders["movie_id"].classes_)
n_genres = len(encoders["genre"].classes_)
k = 8  # dimensión latente para los vectores de la entidades

# Modelo FM con biases
class FactorizationMachine(nn.Module):
    def __init__(self, n_users, n_movies, n_genres, k):
        super().__init__()
        self.user_emb = nn.Embedding(n_users, k)
        self.movie_emb = nn.Embedding(n_movies, k)
        self.genre_emb = nn.Embedding(n_genres, k)
        self.user_bias = nn.Embedding(n_users, 1)
        self.movie_bias = nn.Embedding(n_movies, 1)
        self.linear = nn.Linear(3, 1)
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

# Entrenamiento
model = FactorizationMachine(n_users, n_movies, n_genres, k)
optimizer = optim.Adam(model.parameters(), lr=0.01, weight_decay=1e-4)
criterion = nn.MSELoss()

for epoch in range(1500):
    optimizer.zero_grad()
    y_pred = model(X)
    loss = criterion(y_pred, y)
    loss.backward()
    optimizer.step()

print("Loss final:", round(loss.item(), 4))

# Predicción
sample = pd.DataFrame({"user_id": [1], "movie_id": [10], "genre": ["action"]})
for col, enc in encoders.items():
    sample[col] = enc.transform(sample[col])

new = torch.tensor(sample.values, dtype=torch.long)
pred_norm = model(new).item()

# Reescalar a RATING
pred_rating = pred_norm * (RATING_MAX - RATING_MIN) + RATING_MIN
print(f"Predicción esperada del rating: {pred_rating:.2f} (rango 1-5)")
