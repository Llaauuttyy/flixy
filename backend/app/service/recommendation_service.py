from app.db.database import Database
from app.dto.movie import MovieDTO
from app.model.review import Review
from app.model.movie import Movie
from sqlalchemy.orm import selectinload
from math import log10

class RecommendationService:
    def get_recommendations(self, db: Database, user_id: int) -> list[Movie]:
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