from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.user_service import UserService
from app.dto.user import UserDTO, UserUpdateDTO
from app.dto.insight import InsightDTO
from app.dto.achievement import AchievementsDTO
from fastapi import APIRouter, Depends, Path, Request, HTTPException
from fastapi_pagination import Page, paginate

user_router = APIRouter()

UserServiceDep = Annotated[UserService, Depends(lambda: UserService())]

@user_router.get("/users")
def get_users(session: SessionDep, request: Request, user_service: UserServiceDep, search_query: str = None) -> Page[UserDTO]:
    user_id = request.state.user_id
    try:
        if search_query is None or search_query == "":
            users = user_service.get_all_users(Database(session))
        else:
            users = user_service.search_users(Database(session), search_query, user_id)
        return paginate(users)
    except Exception as e:
        return HTTPException(status_code=409, detail=str(e))

@user_router.get("/user")
async def get_user(session: SessionDep, request: Request, user_service: UserServiceDep) -> UserDTO:
    user_id = request.state.user_id
    return user_service.get_user_by_id(Database(session), user_id)

@user_router.patch("/user")
def update_user_data(user_dto: UserUpdateDTO, request: Request, session: SessionDep, user_service: UserServiceDep):
    user_id = request.state.user_id
    try:
        return user_service.update_user_data(user_dto, user_id, Database(session))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@user_router.get("/user/insights")
def get_insights(session: SessionDep, request: Request, user_service: UserServiceDep) -> InsightDTO:
    user_id = request.state.user_id

    try:
        insights = user_service.get_user_insights(Database(session), user_id)
        return insights
    except HTTPException as http_exc:
        raise HTTPException(status_code=http_exc.status_code, detail=http_exc.detail)
    
@user_router.post("/user/{id}/follow")
def follow_user(request: Request, session: SessionDep, user_service: UserServiceDep, id: int = Path(..., title="id", ge=1)):
    follower_id = request.state.user_id
    try:
        user_service.follow_user(follower_id, id, Database(session))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@user_router.get("/user/achievements")
def get_achievements(session: SessionDep, request: Request, user_service: UserServiceDep) -> AchievementsDTO:
    user_id = request.state.user_id
    try:
        return user_service.get_user_achievements(Database(session), user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))