from fastapi import HTTPException
from app.model.movie import Movie
from app.model.rating import Rating
from app.db.database import Database
from app.dto.movie import MovieDTO, MovieRateDTO, MovieRatingDTO
from sqlalchemy.exc import IntegrityError
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
    
    def set_movie_rating(self, db: Database, movie_rate_dto: MovieRateDTO, user_id: int) -> MovieRatingDTO:
        try:
            existing_rating = db.find_by_multiple(Rating, user_id=user_id, movie_id=movie_rate_dto.id)
            if existing_rating:
                existing_rating.user_rating = movie_rate_dto.rating
                db.save(existing_rating)
                rating = existing_rating
            else:
                new_rating = Rating(
                    user_id=user_id,
                    movie_id=movie_rate_dto.id,
                    user_rating=movie_rate_dto.rating,
                )
                db.save(new_rating)
                rating = new_rating

            return MovieRatingDTO(
                id=rating.id,
                user_id=rating.user_id,
                movie_id=rating.movie_id,
                user_rating=rating.user_rating,
            )

        except IntegrityError as e:
            db.rollback()

            if "foreign key constraint" in str(e).lower():
                raise HTTPException(status_code=404, detail=MOVIE_NOT_FOUND)
            else:
                raise HTTPException(status_code=400, detail=str(e))

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))