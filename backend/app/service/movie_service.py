from app.model.movie import Movie
from app.db.database import Database
from app.dto.movie import MovieDTO
from app.constants.message import MOVIE_NOT_FOUND


class MovieService:
    def get_all_movies(self, db: Database) -> list[MovieDTO]:
        movies = db.find_all(Movie)
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
                logo_url=movie.logo_url,
            ) for movie in movies
        ]
    
    def get_movie_by_id(self, db: Database, movie_id: int) -> MovieDTO:
        movie = db.find_by(Movie, "id", movie_id)
        if not movie:
            raise Exception(MOVIE_NOT_FOUND)
        
        return MovieDTO(
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
        )