from typing import Union, Annotated
from app.model.user import User
from app.dto.register import RegisterDTO, RegisterForm
from app.dto.user import UserDTO
from app.service.user_service import UserService
from app.db.database import Database
from fastapi import Depends, FastAPI
from sqlmodel import Session
from app.db.database_setup import engine

app = FastAPI()

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
UserServiceDep = Annotated[UserService, Depends(lambda: UserService())]

@app.post("/register")
async def create_user(register_form: RegisterForm, session: SessionDep, user_service: UserServiceDep) -> RegisterDTO:
    return await user_service.register_user(register_form, Database(session))

@app.get("/users")
def get_users(session: SessionDep) -> list[UserDTO]:
    users = session.query(User).all()
    return [UserDTO(id=user.id, name=user.name, username=user.username, email=user.email) for user in users]