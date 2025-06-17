from typing import Annotated
from app.dto.register import RegisterDTO, RegisterForm
from app.dto.user import UserDTO
from app.service.user_service import UserService
from app.db.database import Database
from app.dto.login import LoginDTO, LoginResponse
from app.middleware.auth_middleware import AuthMiddleware
from fastapi import Depends, FastAPI
from sqlmodel import Session
from app.db.database_setup import engine

app = FastAPI()

app.add_middleware(AuthMiddleware)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
UserServiceDep = Annotated[UserService, Depends(lambda: UserService())]

@app.post("/register")
async def create_user(register_form: RegisterForm, session: SessionDep, user_service: UserServiceDep) -> RegisterDTO:
    return user_service.register_user(register_form, Database(session))

@app.get("/users")
def get_users(session: SessionDep, user_service: UserServiceDep) -> list[UserDTO]:
    return user_service.get_all_users(Database(session))

@app.post("/login")
async def login(login_dto: LoginDTO, session: SessionDep, user_service: UserServiceDep) -> LoginResponse:
    return user_service.login(login_dto, Database(session))