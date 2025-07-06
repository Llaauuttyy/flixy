from typing import Annotated
from app.dto.register import RegisterDTO, RegisterForm
from app.db.database import Database
from app.dto.login import LoginDTO, LoginResponse
from app.db.database_setup import SessionDep
from app.service.auth_service import AuthService
from app.dto.auth import PasswordUpdateDTO
from fastapi import APIRouter, Depends, Request, HTTPException

auth_router = APIRouter()

AuthServiceDep = Annotated[AuthService, Depends(lambda: AuthService())]

@auth_router.post("/register")
async def create_user(register_form: RegisterForm, session: SessionDep, auth_service: AuthServiceDep) -> RegisterDTO:
    return auth_service.register_user(register_form, Database(session))

@auth_router.post("/login")
async def login(login_dto: LoginDTO, session: SessionDep, auth_service: AuthServiceDep) -> LoginResponse:
    return auth_service.login(login_dto, Database(session))

@auth_router.patch("/password")
async def update_password(password_update_dto: PasswordUpdateDTO, request: Request, session: SessionDep, auth_service: AuthServiceDep):
    try:
        user_id = request.state.user_id
        return auth_service.update_password(password_update_dto, user_id, Database(session))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))