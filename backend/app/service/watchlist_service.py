from app.dto.watchlist import WatchListCreateResponse, WatchListsGetResponse, WatchListBase, WatchListCreationDTO, WatchListDTO, WatchListEditionDTO, WatchListEditResponse, WatchListGetResponse, WatchListActivity, WatchListInsights
from app.model.watchlist import WatchList
from app.model.watchlist_movie import WatchListMovie
from app.model.user import User
from app.constants.message import MOVIE_ALREADY_IN_WATCHLIST, MOVIE_NOT_FOUND, WATCHLIST_ALREADY_EXISTS, WATCHLIST_NOT_FOUND, MOVIE_NOT_FOUND_IN_WATCHLIST
from app.dto.movie import MovieGetResponse, MovieDTO
from app.model.review import Review
from app.model.watchlist_save import WatchListSave
from app.dto.user import UserDTOMinimal
from fastapi import HTTPException
from app.db.database import Database
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload, with_loader_criteria
from typing import List, Optional, Tuple
from datetime import datetime as datetime
from fastapi_pagination import Params, paginate
from app import utils


class WatchListService:
    def get_all_watchlists(self, db: Database, user_id: int, params: Params) -> Tuple[WatchListsGetResponse, List[WatchListDTO]]:
        user = db.find_by(User, "id", user_id, options=[
            selectinload(User.watchlists).selectinload(WatchList.watchlist_movies).selectinload(WatchListMovie.movie),
            selectinload(User.watchlist_saves).selectinload(WatchListSave.watchlist).selectinload(WatchList.watchlist_movies).selectinload(WatchListMovie.movie),
            with_loader_criteria(
                Review,
                lambda review: review.user_id == user_id
            )
        ])

        if not user.watchlists and not user.watchlist_saves:
            return WatchListsGetResponse(
                total_movies=0,
                total_watchlists=0
            ), []

        watchlists = []

        watchlists_found = [ws.watchlist for ws in user.watchlist_saves] + user.watchlists
        
        total_watchlists = 0
        total_movies = 0

        for w in watchlists_found:
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
                    user_rating=movie_user_rating,
                    flixy_rating = utils.get_movie_average_rating(movie_data)
                ))

                total_movies += 1

            movies_params = Params(
                page=1,
                size=params.size,
            )

            watchlists.append(WatchListBase(
                id=w.id,
                name=w.name,
                description=w.description,
                movies=paginate(watchlists_movies, movies_params),
                private=w.private,
                saves=w.saves,
                user=UserDTOMinimal(id=w.user.id, username=w.user.username, name=w.user.name),
                editable=w.user_id==user_id,
                saved_by_user=db.exists_by_multiple(WatchListSave, watchlist_id=w.id, user_id=user_id),
                created_at=w.created_at,
                updated_at=w.updated_at
            ))

            total_watchlists += 1
        
        watchlists.sort(key=lambda x: x.updated_at, reverse=True)
        return WatchListsGetResponse(
            total_movies=total_movies,
            total_watchlists=total_watchlists
        ), watchlists

    def get_watchlist(self, db: Database, user_id: int, watchlist_id: int) -> Tuple[WatchListGetResponse, List[MovieGetResponse]]:
        watchlist = db.find_by(WatchList, "id", watchlist_id, options=[
            selectinload(WatchList.watchlist_movies).selectinload(WatchListMovie.movie),
            with_loader_criteria(
                WatchList,
                lambda watchlist: watchlist.id == watchlist_id
            ),
            with_loader_criteria(
                Review,
                lambda review: review.user_id == user_id
            )])

        if not watchlist:
            raise HTTPException(status_code=404, detail=WATCHLIST_NOT_FOUND)

        watchlist_movie_objects = watchlist.watchlist_movies
        watchlist_movie_objects.sort(key=lambda x: x.updated_at, reverse=True)

        watchlists_movies = []

        total_movies = 0
        total_watched_movies = 0
        total_imdb_rating = 0.0
        total_user_rating = 0.0

        movies = []

        for wm in watchlist_movie_objects:
            movie_data = wm.movie

            print(movie_data)

            movies.append(movie_data)

            movie_user_rating = None
            if movie_data.reviews:
                movie_user_rating = movie_data.reviews[0].rating

                total_watched_movies += 1

                if movie_user_rating:
                    total_user_rating += movie_user_rating

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
                user_rating=movie_user_rating,
                flixy_rating = utils.get_movie_average_rating(movie_data)
            ))

            total_movies += 1
            total_imdb_rating += movie_data.imdb_rating

        watchlist_insights = WatchListInsights(
            total_movies=total_movies,
            total_watched_movies=total_watched_movies,
            average_rating_imdb=total_imdb_rating / total_movies if total_movies > 0 else 0.0,
            average_rating_user=total_user_rating / total_watched_movies if total_watched_movies > 0 else 0.0
        )

        watchlist_activities = []

        for activity_number in range(0, 6):
            if activity_number >= len(movies):
                break
            
            watchlist_movie_object = watchlist_movie_objects[activity_number]
            watchlist_activities.append(WatchListActivity(
                action="Add",
                target=watchlist_movie_object.movie,
                timestamp=watchlist_movie_object.created_at
            ))

        return WatchListGetResponse(
            id=watchlist.id,
            name=watchlist.name,
            description=watchlist.description,
            private=watchlist.private,
            saves=watchlist.saves,
            user=UserDTOMinimal(id=watchlist.user.id, username=watchlist.user.username, name=watchlist.user.name),
            activity=watchlist_activities,
            insights=watchlist_insights,
            editable=user_id==watchlist.user_id,
            saved_by_user=db.exists_by_multiple(WatchListSave, watchlist_id=watchlist_id, user_id=user_id),
            created_at=watchlist.created_at,
            updated_at=watchlist.updated_at
        ), watchlists_movies
        

    def create_watchlist(self, db: Database, watchlist_dto: WatchListCreationDTO, user_id: int) -> WatchListCreateResponse:
        try:
            watchlist = WatchList(
                user_id=user_id,
                name=watchlist_dto.name,
                description=watchlist_dto.description,
                private=watchlist_dto.private,
                saves=watchlist_dto.saves
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
                user=UserDTOMinimal(id=watchlist.user.id, username=watchlist.user.username, name=watchlist.user.name),
                private=watchlist.private,
                saves=watchlist.saves,
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
                for cm in current_movies:
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
            
            if watchlist_dto.private is not None:
                watchlist.private = watchlist_dto.private

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
                private=watchlist.private,
                saved_by_user=db.exists_by_multiple(WatchListSave, watchlist_id=watchlist.id, user_id=user_id),
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
        
    def get_movie_from_watchlist(self, db: Database, user_id: int, watchlist_id: int, movie_id: int) -> Optional[MovieDTO]:
        try:
            user = db.find_by(User, "id", user_id, options=[
                selectinload(User.watchlists).selectinload(WatchList.watchlist_movies).selectinload(WatchListMovie.movie),
                with_loader_criteria(
                    WatchList,
                    lambda watchlist: watchlist.id == watchlist_id
                ),
            ])

            if not user.watchlists:
                raise HTTPException(status_code=404, detail=WATCHLIST_NOT_FOUND)

            current_movies = user.watchlists[0].watchlist_movies

            for cm in current_movies:
                if cm.movie_id == movie_id:
                    return MovieDTO(
                        id=cm.movie.id,
                        title=cm.movie.title,
                        year=cm.movie.year,
                        imdb_rating=cm.movie.imdb_rating,
                        genres=cm.movie.genres,
                        countries=cm.movie.countries,
                        duration=cm.movie.duration,
                        cast=cm.movie.cast,
                        directors=cm.movie.directors,
                        writers=cm.movie.writers,
                        plot=cm.movie.plot,
                        logo_url=cm.movie.logo_url
                    )
                
            return None
                    
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=str(e.detail))
        
    def search_watchlists(self, db: Database, search_query: str, user_id: int, params: Params) -> Tuple[WatchListsGetResponse, List[WatchListDTO]]:
        private_list_condition = db.build_condition([WatchList.private == False, WatchList.user_id == user_id], "OR")
        search_conditions = db.build_condition([WatchList.name.ilike(f"%{search_query}%"), private_list_condition])
        watchlists_found = db.find_all(WatchList, search_conditions)

        watchlists = []

        total_watchlists = 0
        total_movies = 0

        for w in watchlists_found:
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
                    user_rating=movie_user_rating,
                    flixy_rating = utils.get_movie_average_rating(movie_data)
                ))

                total_movies += 1

            movies_params = Params(
                page=params.page,
                size=params.size,
            )

            watchlists.append(WatchListBase(
                id=w.id,
                name=w.name,
                description=w.description,
                movies=paginate(watchlists_movies, movies_params),
                private=w.private,
                user=UserDTOMinimal(id=w.user.id, username=w.user.username, name=w.user.name),
                saves=w.saves,
                editable=w.user_id==user_id,
                saved_by_user=db.exists_by_multiple(WatchListSave, watchlist_id=w.id, user_id=user_id),
                created_at=w.created_at,
                updated_at=w.updated_at
            ))

            total_watchlists += 1
        
        watchlists.sort(key=lambda x: x.updated_at, reverse=True)
        return WatchListsGetResponse(
            total_movies=total_movies,
            total_watchlists=total_watchlists
        ), watchlists
    
    def save_watchlist(self, db: Database, user_id: int, watchlist_id: int) -> bool:
        try:
            user_save = db.find_by_multiple(WatchListSave, watchlist_id=watchlist_id, user_id=user_id)
            watchlist = db.find_by(WatchList, "id", watchlist_id)

            if not watchlist:
                raise HTTPException(status_code=404, detail=WATCHLIST_NOT_FOUND)
            
            saved_by_user = user_save is not None
            if saved_by_user:
                watchlist.saves -= 1
                db.delete(user_save)
            else:
                user_save = WatchListSave(user_id=user_id, watchlist_id=watchlist_id)
                watchlist.saves += 1
                db.save(user_save)

            return not saved_by_user

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
