from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.dto.watchlist import WatchListCreateResponse, WatchListCreationDTO, WatchListGetResponse
from app.service.watchlist_service import WatchListService
from fastapi import APIRouter, Depends, HTTPException, Request
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
    