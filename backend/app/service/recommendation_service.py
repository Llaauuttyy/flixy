from app.db.database import Database
from app.dto.movie import MovieDTO
from app.model.review import Review
from app.model.movie import Movie
from app.model.user_relationship import UserRelationship
from app.ai_model.gnn import GNNRatingTrainModel, GNNRecommender
from sqlalchemy.orm import selectinload
from math import log10
from random import random
from app.ai_model.decision_forest import DecisionForestTrainModel, characteristic_model
from concurrent.futures import ThreadPoolExecutor, wait
from app.db.database_setup import session_factory
from threading import Thread
from time import sleep
from app.ai_model.factorization_machines import FMModelHandler
from datetime import datetime as datetime

MAX_RECOMMENDATION_RESULTS = 100
MAX_RESPONSE_TIME_SECONDS = 4
INTERVAL_TRAIN_GNN_SECONDS = 3600
executor = ThreadPoolExecutor(max_workers=4)

class RecommendationService:
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=3)
        self.gnn = prepare_gnn_model()
        thread = Thread(target=train_gnn_model, args=(self.gnn, INTERVAL_TRAIN_GNN_SECONDS))
        thread.daemon = True
        thread.start()

    def get_recommendations(self, user_id: int) -> list[MovieDTO]:
        """
        Crea un hilo por cada criterio de recomendación, espera hasta 4 segundos por ambos
        y devuelve los resultados que haya en el momento. En el caso de que uno de los hilos
        no haya terminado, se sigue ejecutando en background hasta su finalización.
        Devuelve una mezcla de 80% IA y 20% mejor género.
        """

        # Ejecutamos ambos criterios en paralelo
        future_genre = self.executor.submit(self.get_best_genre_recommendations, user_id)
        future_decision_forest = self.executor.submit(self.get_decision_forest_recommendations, user_id)
        future_gnn = self.executor.submit(self.get_gnn_recommendations, user_id)
        future_fm = self.executor.submit(self.get_factorization_machines_recommendations, user_id)

        best_genre_recommendations = []
        decision_forest_recommendations = []
        gnn_recommendations = []
        fm_recommendations = []

        # Esperamos hasta 4 segundos
        done, _ = wait([future_genre, future_decision_forest, future_gnn, future_fm], timeout=MAX_RESPONSE_TIME_SECONDS)

        # Cargamos los resultados disponibles
        if future_genre in done:
            try:
                best_genre_recommendations = future_genre.result()
            except Exception as e:
                print(f"Error in Best Genre recommendations: {e}")
                best_genre_recommendations = []
        if future_decision_forest in done:
            try:
                decision_forest_recommendations = future_decision_forest.result()
            except Exception as e:
                print(f"Error in Decision Forest recommendations: {e}")
                decision_forest_recommendations = []
        if future_gnn in done:
            try:
                gnn_recommendations = future_gnn.result()
            except Exception as e:
                print(f"Error in GNN recommendations: {e}")
                gnn_recommendations = []
        if future_fm in done:
            try:
                fm_recommendations = future_fm.result()
            except Exception as e:
                print(f"Error in Factorization Machines recommendations: {e}")
                fm_recommendations = []

        # Si la IA no está lista, generamos una lista vacía o parcial
        recommendations = []
        while len(recommendations) < MAX_RECOMMENDATION_RESULTS:
            rand = random()
            if rand <= 0.2 and best_genre_recommendations:
                recommendations.append(best_genre_recommendations.pop(0))
            elif rand <= 0.4 and decision_forest_recommendations:
                recommendations.append(best_genre_recommendations.pop(0))
            elif rand <= 0.6 and fm_recommendations: # Son pocos, por eso tiene mas peso.
                recommendations.append(fm_recommendations.pop(0))
            elif gnn_recommendations:
                recommendations.append(gnn_recommendations.pop(0)) 
            elif decision_forest_recommendations:
                recommendations.append(decision_forest_recommendations.pop(0))
            elif best_genre_recommendations:
                recommendations.append(best_genre_recommendations.pop(0))
            else:
                break  # no hay más datos disponibles

        return recommendations

    def get_best_genre_recommendations(self, user_id: int) -> list[MovieDTO]:
        with session_factory() as session:
            db = Database(session)
            user_reviews = db.find_all_by_multiple(
                Review,
                db.build_condition([Review.user_id == user_id]),
                options=[selectinload(Review.movie)])
            
            genres = dict()
            total_movies_watched = 0

            for review in user_reviews:
                for movie_genre in review.movie.genres.lower().split(","):
                    movie_genre = movie_genre.strip()
                    if movie_genre not in genres.keys():
                        genres[movie_genre] = {
                            "sum_rating": 0,
                            "movies_rated": 0,
                            "movies_watched": 0
                        }
                    
                    if review.rating is not None:
                        genres[movie_genre]["sum_rating"] += review.rating
                        genres[movie_genre]["movies_rated"] += 1

                    genres[movie_genre]["movies_watched"] += 1
                    
                total_movies_watched += 1
            

            if not genres:
                raise Exception("Empiece a ver y opinar sobre películas para ser recomendado")
            

            most_likable_genre = {
                "genre": "",
                "level_of_interest": -1
            }

            for genre_name, genre_data in genres.items():
                avg = round(genre_data["sum_rating"] / genre_data["movies_rated"], 1) if genre_data["movies_rated"] else 0
                level_of_interest = avg * log10(genre_data["movies_watched"] + 1)

                if level_of_interest > most_likable_genre["level_of_interest"]:
                    most_likable_genre = {
                        "genre": genre_name,
                        "level_of_interest": level_of_interest
                    }
            
            movies_recommended = db.find_all_by_multiple(
                Movie,
                db.build_condition([Movie.genres.ilike(f"%{most_likable_genre['genre']}%")]),
                order_by={"way": "desc", "column": "imdb_rating"}
            )

            return [
                MovieDTO(
                    id=movie.id,
                    title=movie.title,
                    year=movie.year,
                    imdb_rating=movie.imdb_rating,
                    genres=movie.genres,
                    countries=movie.countries,
                    duration=movie.duration,
                    cast=movie.cast,
                    directors=movie.directors,
                    writers=movie.writers,
                    plot=movie.plot,
                    logo_url=movie.logo_url
                ) for movie in movies_recommended
            ]

    def get_factorization_machines_recommendations(self, user_id: int):
        start = datetime.now()
        with session_factory() as session:
            db = Database(session)
            user_reviews = list(db.find_all_by_multiple(
                Review,
                db.build_condition([Review.user_id == user_id, Review.rating != None]),
                options=[selectinload(Review.movie)]
            ))

            all_movie_ratings = list(db.find_all_by_multiple(
                Review,
                db.build_condition([Review.rating != None]),
                options=[selectinload(Review.movie)]
            ))

            watched_movies = {review.movie.id for review in user_reviews}
            
            not_watched_movies_ids = []
            not_watched_movies = []
            for rating in all_movie_ratings:
                if (rating.movie.id not in watched_movies) and (rating.movie.id not in not_watched_movies_ids):
                    rating.user_id = user_id  # user_id para la predicción
                    not_watched_movies.append(rating)
                    not_watched_movies_ids.append(rating.movie.id)

            if not not_watched_movies or not user_reviews:
                # El usuario no vió ninguna pelicula o ya vió todas las que 
                # vieron todos los usuarios que dieron rating a películas.
                return []
            
            movies_to_train = FMModelHandler.build_data(all_movie_ratings)
            # Son las películas que tienen ratings de otros usuarios pero que el usuario no vio.
            movies_to_predict = FMModelHandler.build_data(not_watched_movies, for_prediction=True)

            handler = FMModelHandler(movies_to_train)

            recommendation_ids = handler.predict(movies_to_predict)

            # Devuelvo las películas recomendadas
            movies_to_recommend = []

            for review in not_watched_movies:
                if review.movie.id in recommendation_ids:
                    movies_to_recommend.append(review.movie)

            return [
                MovieDTO(
                    id=movie.id,
                    title=movie.title,
                    year=movie.year,
                    imdb_rating=movie.imdb_rating,
                    genres=movie.genres,
                    countries=movie.countries,
                    duration=movie.duration,
                    cast=movie.cast,
                    directors=movie.directors,
                    writers=movie.writers,
                    plot=movie.plot,
                    logo_url=movie.logo_url
                ) for movie in movies_to_recommend
            ]

    def get_decision_forest_recommendations(self, user_id: int):
        with session_factory() as session:
            db = Database(session)
            user_reviews = list(db.find_all_by_multiple(
                Review,
                db.build_condition([Review.user_id == user_id]),
                options=[selectinload(Review.movie)]
            ))

            unwatched_movies = db.find_all_by_multiple(
                Movie,
                db.build_condition([Movie.id.notin_([review.movie.id for review in user_reviews])])
            )

            rated_movies = [DecisionForestTrainModel(review) for review in user_reviews if review.rating is not None]

            return [
                MovieDTO(**pred)
                for pred in characteristic_model.predict(user_id, list(unwatched_movies), rated_movies)
            ]
        
    def get_gnn_recommendations(self, user_id: int):
        with session_factory() as session:
            try:
                db = Database(session)
                user_reviews = list(db.find_all_by_multiple(
                    Review,
                    db.build_condition([Review.user_id == user_id]),
                    options=[selectinload(Review.movie)]
                ))
                unwatched_movies = db.find_all_by_multiple(
                    Movie,
                    db.build_condition([Movie.id.notin_([review.movie.id for review in user_reviews])])
                )

                recommendations = self.gnn.recommend(user_id, unwatched_movies)
                recommended_movies = db.find_all(Movie, db.build_condition([Movie.id.in_(recommendations["movie_id"].tolist())]))
                return [MovieDTO(
                    id=movie.id,
                    title=movie.title,
                    year=movie.year,
                    imdb_rating=movie.imdb_rating,
                    genres=movie.genres,
                    countries=movie.countries,
                    duration=movie.duration,
                    cast=movie.cast,
                    directors=movie.directors,
                    writers=movie.writers,
                    plot=movie.plot,
                    logo_url=movie.logo_url
                ) for movie in recommended_movies]
            except Exception as e:
                print("ERROR GNN", e)
                return []
            

def prepare_gnn_model():
    model = GNNRecommender()
    train_gnn_model(model)
    return model

def train_gnn_model(model, interval = 0):
    while interval != 0:
        with session_factory() as session:
            db = Database(session)
            reviews = db.find_all(Review, db.build_condition([Review.rating != None]), options=[selectinload(Review.movie)])
            user_relations = db.find_all(UserRelationship)
            model.train([GNNRatingTrainModel(review) for review in reviews], user_relations)
        if interval != 0:
            sleep(interval)
