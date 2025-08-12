from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.dto.watchlist import WatchListCreateResponse, WatchListCreationDTO, WatchListGetResponse, WatchListAddResponse, WatchListEditResponse, WatchListEditionDTO
from app.service.watchlist_service import WatchListService
from fastapi import APIRouter, Depends, HTTPException, Request, Path
from fastapi_pagination import Params, paginate

watchlist_router = APIRouter()

WatchListServiceDep = Annotated[WatchListService, Depends(lambda: WatchListService())]

@watchlist_router.get("/watchlists")
def get_watchlists(session: SessionDep, request: Request, watchlist_service: WatchListServiceDep, params: Params = Depends()) -> WatchListGetResponse:
    user_id = request.state.user_id
    try:
        watchlist = watchlist_service.get_all_watchlists(Database(session), user_id)
        return WatchListGetResponse(
            items=paginate(watchlist, params)
        )
    except Exception as e:
        raise HTTPException(status_code=409, detail=str(e))

@watchlist_router.post("/watchlist")
def create_watchlist(session: SessionDep, request: Request, watchlist_dto: WatchListCreationDTO, watchlist_service: WatchListServiceDep) -> WatchListCreateResponse:
    user_id = request.state.user_id
    try:
        watchlist = watchlist_service.create_watchlist(Database(session), watchlist_dto, user_id)
        return watchlist
    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))
    
@watchlist_router.post("/watchlist/{watchlist_id}/movie/{movie_id}")
def add_watchlist_movie(session: SessionDep, request: Request, watchlist_service: WatchListServiceDep, watchlist_id: int = Path(..., title="watchlist id", ge=1), movie_id: int = Path(..., title="movie id", ge=1)) -> WatchListAddResponse:
    user_id = request.state.user_id
    try:
        watchlist_movie = watchlist_service.add_movie_to_watchlist(Database(session), user_id, watchlist_id, movie_id)
        return watchlist_movie
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))

@watchlist_router.patch("/watchlist/{watchlist_id}")
def edit_watchlist(session: SessionDep, request: Request, watchlist_service: WatchListServiceDep, watchlist_dto: WatchListEditionDTO, watchlist_id: int = Path(..., title="watchlist id", ge=1)) -> WatchListEditResponse:
    user_id = request.state.user_id
    try:
        watchlist_edited = watchlist_service.edit_watchlist(Database(session), user_id, watchlist_id, watchlist_dto)
        return watchlist_edited
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))