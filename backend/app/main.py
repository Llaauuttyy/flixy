from app.middleware.auth_middleware import AuthMiddleware
from fastapi import FastAPI
from app.controller.auth_controller import auth_router
from app.controller.user_controller import user_router
from app.controller.movie_controller import movie_router
from fastapi_pagination import add_pagination

app = FastAPI()
add_pagination(app)

app.add_middleware(AuthMiddleware)

app.include_router(auth_router)
app.include_router(user_router, prefix="/user")
app.include_router(movie_router, prefix="/movie")