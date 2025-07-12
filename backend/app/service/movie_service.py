from app.model.movie import Movie
from app.db.database import Database
from app.dto.movie import MovieDTO


class MovieService:
    def get_all_movies(self, db: Database) -> list[MovieDTO]:
        movies = db.find_all(Movie)
        return [
            MovieDTO(
                id=movie.id,
                title=movie.title,
                year=movie.year,
                duration=movie.duration,
                genre=movie.genre,
                certificate=movie.certificate,
                description=movie.description,
                actors=movie.actors,
                directors=movie.directors
            ) for movie in movies
        ]