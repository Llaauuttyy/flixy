from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.user_service import UserService
from app.dto.user import UserDTO, UserUpdateDTO
from fastapi import APIRouter, Depends, Request, HTTPException

user_router = APIRouter()

UserServiceDep = Annotated[UserService, Depends(lambda: UserService())]

@user_router.get("")
def get_users(session: SessionDep, user_service: UserServiceDep) -> list[UserDTO]:
    return user_service.get_all_users(Database(session))

@user_router.patch("")
def update_user_data(user_dto: UserUpdateDTO, request: Request, session: SessionDep, user_service: UserServiceDep):
    user_id = request.state.user_id
    try:
        return user_service.update_user_data(user_dto, user_id, Database(session))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))