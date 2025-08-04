from app.dto.watchlist import WatchListCreateResponse, WatchListCreationDTO, WatchListDTO
from app.model.watchlist import WatchList
from app.model.watchlist_movie import WatchListMovie
from app.constants.message import MOVIE_NOT_FOUND, WATCHLIST_ALREADY_EXISTS
from fastapi import HTTPException
from app.db.database import Database
from sqlalchemy.exc import IntegrityError
# from sqlalchemy.orm import selectinload
# from typing import Tuple, List, Optional
from datetime import datetime as datetime

class WatchListService:
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