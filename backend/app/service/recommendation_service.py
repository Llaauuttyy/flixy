from app.db.database import Database
from app.dto.movie import MovieDTO
from app.model.review import Review
from app.model.movie import Movie
from sqlalchemy.orm import selectinload
from math import log10
from app.ai_model.decision_forest import DecisionForestTrainModel, characteristic_model

MAX_RECOMMENDATION_RESULTS = 100

class RecommendationService:
    """
    Toma el 80% de películas recomendadas por la IA y el 20% de películas recomendadas por el mejor género.
    Por el momento, quedan primero las películas de IA y después las de mejor género.
    """
    def get_recommendations(self, db: Database, user_id: int) -> list[MovieDTO]:
        best_genre_recommendations = self.get_best_genre_recommendations(db, user_id)
        ai_recommendations = self.get_ai_recommendations(db, user_id)
    
        recommendations = ai_recommendations[:int(MAX_RECOMMENDATION_RESULTS * 0.8)]
        while len(recommendations) < MAX_RECOMMENDATION_RESULTS:
            for movie in best_genre_recommendations:
                if movie not in recommendations and len(recommendations) < MAX_RECOMMENDATION_RESULTS:
                    recommendations.append(movie)
            recommendations.extend(ai_recommendations[len(recommendations):MAX_RECOMMENDATION_RESULTS])

        return recommendations

    def get_best_genre_recommendations(self, db: Database, user_id: int) -> list[MovieDTO]:
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
    
    def get_ai_recommendations(self, db: Database, user_id: int):
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