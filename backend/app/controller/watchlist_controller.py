from typing import Annotated, Optional
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.dto.watchlist import WatchListCreateResponse, WatchListCreationDTO, WatchListsGetResponse, WatchListGetResponse, WatchListEditResponse, WatchListEditionDTO
from app.dto.movie import MovieDTO
from app.service.watchlist_service import WatchListService
from fastapi import APIRouter, Depends, HTTPException, Request, Path
from fastapi_pagination import Params, paginate

watchlist_router = APIRouter()

WatchListServiceDep = Annotated[WatchListService, Depends(lambda: WatchListService())]

@watchlist_router.get("/watchlists")
def get_watchlists(session: SessionDep, request: Request, watchlist_service: WatchListServiceDep, search_query: str = None, params: Params = Depends()) -> WatchListsGetResponse:
    user_id = request.state.user_id
    try:
        if search_query is None or search_query == "":
            watchlists, items = watchlist_service.get_all_watchlists(Database(session), user_id, params)
            watchlists.items = paginate(items, params) if items else items
        else:
            watchlists, items = watchlist_service.search_watchlists(Database(session), search_query, user_id, params)
            watchlists.items = paginate(items, params) if items else items
        return watchlists
    except Exception as e:
        raise HTTPException(status_code=409, detail=str(e))

@watchlist_router.get("/watchlist/{watchlist_id}")
def get_watchlist(session: SessionDep, request: Request, watchlist_service: WatchListServiceDep, watchlist_id: int = Path(..., title="watchlist id", ge=1), params: Params = Depends()) -> WatchListGetResponse:
    user_id = request.state.user_id
    try:
        watchlist, movies = watchlist_service.get_watchlist(Database(session), user_id, watchlist_id)
        watchlist.movies = paginate(movies, params) if movies else movies
        return watchlist
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))

@watchlist_router.get("/watchlist/{watchlist_id}/movies/{movie_id}")
def get_movie_from_watchlist(session: SessionDep, request: Request, watchlist_service: WatchListServiceDep, watchlist_id: int = Path(..., title="watchlist id", ge=1), movie_id: int = Path(..., title="movie id", ge=1)) -> Optional[MovieDTO]:
    user_id = request.state.user_id
    try:
        movie = watchlist_service.get_movie_from_watchlist(Database(session), user_id, watchlist_id, movie_id)
        return movie
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))

@watchlist_router.post("/watchlist")
def create_watchlist(session: SessionDep, request: Request, watchlist_dto: WatchListCreationDTO, watchlist_service: WatchListServiceDep) -> WatchListCreateResponse:
    user_id = request.state.user_id
    try:
        watchlist = watchlist_service.create_watchlist(Database(session), watchlist_dto, user_id)
        return watchlist
    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))

@watchlist_router.patch("/watchlist/{watchlist_id}")
def edit_watchlist(session: SessionDep, request: Request, watchlist_service: WatchListServiceDep, watchlist_dto: WatchListEditionDTO, watchlist_id: int = Path(..., title="watchlist id", ge=1)) -> WatchListEditResponse:
    user_id = request.state.user_id
    try:
        watchlist_edited = watchlist_service.edit_watchlist(Database(session), user_id, watchlist_id, watchlist_dto)
        return watchlist_edited
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))

@watchlist_router.delete("/watchlist/{watchlist_id}")
def delete_watchlist(session: SessionDep, request: Request, watchlist_service: WatchListServiceDep, watchlist_id: int = Path(..., title="watchlist id", ge=1)) -> dict:
    user_id = request.state.user_id
    try:
        watchlist_service.delete_watchlist(Database(session), user_id, watchlist_id)
        return {"watchlist_id": watchlist_id}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))
    