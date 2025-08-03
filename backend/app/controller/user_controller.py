from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.user_service import UserService
from app.dto.user import UserDTO, UserUpdateDTO
from app.dto.insight import InsightDTO
from fastapi import APIRouter, Depends, Request, HTTPException

user_router = APIRouter()

UserServiceDep = Annotated[UserService, Depends(lambda: UserService())]

@user_router.get("/users")
def get_users(session: SessionDep, user_service: UserServiceDep) -> list[UserDTO]:
    return user_service.get_all_users(Database(session))

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