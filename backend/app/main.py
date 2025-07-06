from app.dto.user import UserDTO
from app.db.database import Database
from app.middleware.auth_middleware import AuthMiddleware
from fastapi import Depends, FastAPI
from app.controller.auth_controller import auth_router
from app.controller.user_controller import user_router

app = FastAPI()

app.add_middleware(AuthMiddleware)

app.include_router(auth_router)
app.include_router(user_router, prefix="/user")