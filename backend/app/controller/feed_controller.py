from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.feed_service import FeedService
from app.dto.feed import HomeFeed
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi_pagination import paginate

feed_router = APIRouter()

FeedServiceDep = Annotated[FeedService, Depends(lambda: FeedService())]

@feed_router.get("/feed/home")
def get_feed(session: SessionDep, request: Request, feed_service: FeedServiceDep) -> HomeFeed:
    user_id = request.state.user_id
    try:
        home_feed = feed_service.get_home_feed(Database(session), user_id)
        return home_feed
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))