from datetime import datetime
import pandas as pd
from app.dto.movie import MovieDTO
import tensorflow_decision_forests as tfdf
from sklearn.model_selection import train_test_split

RETRAIN_PORCENTAGE = 1.25
MAX_CACHED_MODELS = 5

class DecisionForest:
    def __init__(self):
        self.trained_models = {}

    def predict(self, user_id, unwatched_movies, rated_movies):
        if user_id not in self.trained_models or self.trained_models[user_id]['amount_rated'] * RETRAIN_PORCENTAGE < len(rated_movies):
            if len(self.trained_models) >= MAX_CACHED_MODELS:
                oldest_user = min(self.trained_models, key=lambda u: self.trained_models[u]['last_prediction'])
                del self.trained_models[oldest_user]
            self.train(user_id, rated_movies)

        self.trained_models[user_id]['last_prediction'] = datetime.now()
        return predict_ratings(self.trained_models[user_id]['model'], unwatched_movies)
    
    def train(self, user_id, rated_movies):
        df = prepare_data(rated_movies)
        df_train, df_valid = split_train_validate(df)
        model = train_model(df_train, df_valid)
        self.trained_models[user_id] = {'model': model, 'amount_rated': len(rated_movies)}

# ======================
# 1. Preparacion de datos
# ======================
def prepare_data(rated_movies):
    return pd.DataFrame([vars(m) for m in rated_movies])

# ==================================
# 2. Split entrenamiento y validacion
# ==================================
def split_train_validate(df):
    train_df, valid_df = train_test_split(df, test_size=0.2, random_state=42)
    ds_train = tfdf.keras.pd_dataframe_to_tf_dataset(train_df, label="rating", task=tfdf.keras.Task.REGRESSION)
    ds_valid = tfdf.keras.pd_dataframe_to_tf_dataset(valid_df, label="rating", task=tfdf.keras.Task.REGRESSION)
    return ds_train, ds_valid

# ======================
# 3. Entrenar modelo
# ======================
def train_model(df_train, df_valid):
    model = tfdf.keras.GradientBoostedTreesModel(task=tfdf.keras.Task.REGRESSION)
    model.fit(df_train, validation_data=df_valid)
    return model


# =================================
# 4. Preparacion de datos y predicción
# =================================
def predict_ratings(model, unwatched_movies):
    predict_df = pd.DataFrame([vars(
        MovieDTO(
            id=m.id,
            title=m.title,
            year=m.year,
            imdb_rating=m.imdb_rating,
            genres=m.genres,
            countries=m.countries,
            duration=m.duration,
            cast=m.cast,
            directors=m.directors,
            writers=m.writers,
            plot=m.plot,
            logo_url=m.logo_url)
        ) for m in unwatched_movies])
    df_unwatched = tfdf.keras.pd_dataframe_to_tf_dataset(predict_df.drop(columns=["id", "title", "plot", "logo_url"]))
    preds = model.predict(df_unwatched)
    predict_df["predicted_rating"] = preds
    return predict_df.sort_values("predicted_rating", ascending=False).to_dict(orient="records")

class DecisionForestTrainModel:
    def __init__(self, review):
        self.rating = review.rating
        self.year = review.movie.year
        self.imdb_rating = review.movie.imdb_rating
        self.genres = review.movie.genres
        self.countries = review.movie.countries
        self.duration = review.movie.duration
        self.cast = review.movie.cast
        self.directors = review.movie.directors
        self.writers = review.movie.writers

class DecisionForestPredictModel:
    def __init__(self, movie):
        self.id = movie.id
        self.title = movie.title
        self.year = movie.year
        self.imdb_rating = movie.imdb_rating
        self.genres = movie.genres
        self.countries = movie.countries
        self.duration = movie.duration
        self.cast = movie.cast
        self.directors = movie.directors
        self.writers = movie.writers


characteristic_model = DecisionForest()