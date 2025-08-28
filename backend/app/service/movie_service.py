from app.model.movie import Movie
from app.model.review import Review
from app.db.database import Database
from app.dto.movie import MovieGetResponse
from app.constants.message import MOVIE_NOT_FOUND

class MovieService:
    def get_all_movies(self, db: Database, user_id: int, order_column: str, order_way: str, genres: list[str] = None) -> list[MovieGetResponse]:
        condition = [Movie.genres.ilike(f"%{genre}%") for genre in genres] if genres else []

        movies_rating = db.left_join(
            left_model=Movie,
            right_model=Review,
            condition=db.build_condition(condition),
            join_condition=(db.build_condition([Movie.id == Review.movie_id, Review.user_id == user_id])),
            order_by={"way": order_way, "column": order_column}
        )

        return [
            MovieGetResponse(
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
                logo_url=movie.logo_url,
                user_rating=review.rating if review and review.rating else None
            ) for movie, review in movies_rating
        ]
    
    def get_movie_by_id(self, db: Database, user_id: int, movie_id: int) -> MovieGetResponse:
        movies_rating = db.left_join(
            left_model=Movie,
            right_model=Review,
            join_condition=(db.build_condition([Movie.id == Review.movie_id, Review.user_id == user_id])),
            condition=db.build_condition([Movie.id == movie_id])
        )

        if len(movies_rating) != 0:
            movie, review = movies_rating[0][0], movies_rating[0][1]
            return MovieGetResponse(
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
                logo_url=movie.logo_url,
                user_rating= review.rating if review and review.rating else None
            ) 
        
        raise Exception(MOVIE_NOT_FOUND)
            
    def search_movies(self, db: Database, search_query: str, user_id: int):
        movies_rating = db.left_join(
            left_model=Movie,
            right_model=Review,
            join_condition=(db.build_condition([Movie.id == Review.movie_id, Review.user_id == user_id])),
            condition=db.build_condition([
                Movie.title.ilike(f"%{search_query}%"),
                Movie.directors.ilike(f"%{search_query}%"),
                Movie.cast.ilike(f"%{search_query}%"),
                Movie.genres.ilike(f"%{search_query}%")
            ], "OR"),
        )

        return [
            MovieGetResponse(
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
                logo_url=movie.logo_url,
                user_rating= review.rating if review and review.rating else None
            ) for movie, review in movies_rating
        ]