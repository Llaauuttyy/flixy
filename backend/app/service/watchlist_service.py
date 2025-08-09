from app.dto.watchlist import WatchListCreateResponse, WatchListCreationDTO, WatchListDTO
from app.model.watchlist import WatchList
from app.model.watchlist_movie import WatchListMovie
from app.model.user import User
from app.constants.message import MOVIE_NOT_FOUND, WATCHLIST_ALREADY_EXISTS
from app.dto.movie import MovieGetResponse
from app.model.review import Review
from fastapi import HTTPException
from app.db.database import Database
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload, with_loader_criteria
from typing import List
from datetime import datetime as datetime

class WatchListService:
    def get_all_watchlists(self, db: Database, user_id: int) -> List[WatchListDTO]:
        user = db.find_by(User, "id", user_id, options=[
            selectinload(User.watchlists).selectinload(WatchList.watchlist_movies).selectinload(WatchListMovie.movie),
            with_loader_criteria(
                Review,
                lambda review: review.user_id == user_id
            )
        ])

        if not user.watchlists:
            return []

        watchlists = []
        for w in user.watchlists:
            watchlists_movies = []

            for wm in w.watchlist_movies:
                movie_data = wm.movie

                movie_user_rating = None
                if movie_data.reviews:
                    movie_user_rating = movie_data.reviews[0].rating

                watchlists_movies.append(MovieGetResponse(
                    id=movie_data.id,
                    title=movie_data.title,
                    year=movie_data.year,
                    imdb_rating=movie_data.imdb_rating,
                    genres=movie_data.genres,
                    countries=movie_data.countries,
                    duration=movie_data.duration,
                    cast=movie_data.cast,
                    directors=movie_data.directors,
                    writers=movie_data.writers,
                    plot=movie_data.plot,
                    logo_url=movie_data.logo_url,
                    user_rating=movie_user_rating
                ))

            watchlists.append(WatchListDTO(
                id=w.id,
                name=w.name,
                description=w.description,
                movies=watchlists_movies,
                created_at=w.created_at,
                updated_at=w.updated_at
            ))
        
        return watchlists

    def create_watchlist(self, db: Database, watchlist_dto: WatchListCreationDTO, user_id: int) -> WatchListCreateResponse:
        try:
            watchlist = WatchList(
                user_id=user_id,
                name=watchlist_dto.name,
                description=watchlist_dto.description
            )

            db.add(watchlist)

            movie_data = None
            if watchlist_dto.movie_id is not None:
                watchlist_movie = WatchListMovie(
                    user_id=user_id,
                    watchlist_id=watchlist.id,
                    movie_id=watchlist_dto.movie_id
                )

                movie_data = watchlist_dto.movie_id

                db.save(watchlist_movie)
            
            return WatchListCreateResponse(
                name=watchlist.name,
                description=watchlist.description,
                movie_id=movie_data,
            )

        except IntegrityError as e:
            db.rollback()
            msg = str(e.orig).lower()

            if "foreign key constraint" in msg:
                raise HTTPException(status_code=404, detail=MOVIE_NOT_FOUND)
            elif "duplicate entry" in msg and "for key 'watchlists.name'" in msg:
                raise HTTPException(status_code=409, detail=WATCHLIST_ALREADY_EXISTS)
            else:
                raise HTTPException(status_code=400, detail="Integrity error: " + str(e.orig))

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))