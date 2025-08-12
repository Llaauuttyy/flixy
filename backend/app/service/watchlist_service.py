from app.dto.watchlist import WatchListCreateResponse, WatchListCreationDTO, WatchListDTO, WatchListEditionDTO, WatchListEditResponse
from app.model.watchlist import WatchList
from app.model.watchlist_movie import WatchListMovie
from app.model.user import User
from app.constants.message import MOVIE_ALREADY_IN_WATCHLIST, MOVIE_NOT_FOUND, WATCHLIST_ALREADY_EXISTS, WATCHLIST_NOT_FOUND, MOVIE_NOT_FOUND_IN_WATCHLIST
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
        
        watchlists.sort(key=lambda x: x.updated_at, reverse=True)
        return watchlists

    def create_watchlist(self, db: Database, watchlist_dto: WatchListCreationDTO, user_id: int) -> WatchListCreateResponse:
        try:
            watchlist = WatchList(
                user_id=user_id,
                name=watchlist_dto.name,
                description=watchlist_dto.description
            )

            db.add(watchlist)

            for movie_id in watchlist_dto.movie_ids:
                watchlist_movie = WatchListMovie(
                    user_id=user_id,
                    watchlist_id=watchlist.id,
                    movie_id=movie_id
                )

                db.add(watchlist_movie)

            db.commit()

            return WatchListCreateResponse(
                id=watchlist.id,
                name=watchlist.name,
                description=watchlist.description,
                movie_ids=watchlist_dto.movie_ids,
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
        
    def edit_watchlist(self, db: Database, user_id: int, watchlist_id: int, watchlist_dto: WatchListEditionDTO) -> WatchListEditResponse:
        try:
            user = db.find_by(User, "id", user_id, options=[
                selectinload(User.watchlists).selectinload(WatchList.watchlist_movies).selectinload(WatchListMovie.movie),
                with_loader_criteria(
                    WatchList,
                    lambda watchlist: watchlist.id == watchlist_id
                ),
            ])

            movies_to_add = watchlist_dto.movie_ids_to_add if watchlist_dto.movie_ids_to_add else []
            movies_to_delete = watchlist_dto.movie_ids_to_delete if watchlist_dto.movie_ids_to_delete else []

            if not user.watchlists:
                raise HTTPException(status_code=404, detail=WATCHLIST_NOT_FOUND)

            current_movies = user.watchlists[0].watchlist_movies

            for m in movies_to_add:
                for cm in current_movies:
                    if cm.movie_id == m:
                        raise HTTPException(status_code=409, detail=MOVIE_ALREADY_IN_WATCHLIST(m))

            for m in movies_to_delete:
                movie_found = False
                for cm in ccurrent_movies:
                    if cm.movie_id == m:
                        movie_found = True
                        break
                if not movie_found:
                    raise HTTPException(status_code=404, detail=MOVIE_NOT_FOUND_IN_WATCHLIST(m))

            watchlist = user.watchlists[0]
            watchlist.updated_at = datetime.now()

            if watchlist_dto.name:
                watchlist.name = watchlist_dto.name
            
            if watchlist_dto.description:
                watchlist.description = watchlist_dto.description

            db.add(watchlist)

            for movie_id in movies_to_add:
                watchlist_movie = WatchListMovie(
                    user_id=user_id,
                    watchlist_id=watchlist.id,
                    movie_id=movie_id
                )
                db.add(watchlist_movie)

            for movie_id in movies_to_delete:
                watchlist_movie_to_delete = db.find_by_multiple(WatchListMovie, user_id=user_id, watchlist_id=watchlist.id, movie_id=movie_id)
                db.delete(watchlist_movie_to_delete)
            
            db.commit()

            return WatchListEditResponse(
                name=watchlist.name,
                description=watchlist.description,
                movie_ids_added=movies_to_add,
                movie_ids_deleted=movies_to_delete
            )

        except HTTPException as e:
            db.rollback()
            raise HTTPException(status_code=e.status_code, detail=str(e.detail))

    def delete_watchlist(self, db: Database, user_id: int, watchlist_id: int):
        try:
            user = db.find_by(User, "id", user_id, options=[
                selectinload(User.watchlists).selectinload(WatchList.watchlist_movies),
                with_loader_criteria(
                    WatchList,
                    lambda watchlist: watchlist.id == watchlist_id
                ),
            ])

            if not user.watchlists:
                raise HTTPException(status_code=404, detail=WATCHLIST_NOT_FOUND)

            watchlist = user.watchlists[0]
            for movie in watchlist.watchlist_movies:
                db.remove(movie)

            db.delete(watchlist)

        except HTTPException as e:
            db.rollback()
            raise HTTPException(status_code=e.status_code, detail=str(e.detail))
        
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))