from app.middleware.auth_middleware import AuthMiddleware
from fastapi import FastAPI
from app.controller.auth_controller import auth_router
from app.controller.user_controller import user_router
from app.controller.movie_controller import movie_router
from app.controller.review_controller import review_router
from fastapi_pagination import add_pagination
from fastapi.middleware.cors import CORSMiddleware

import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONT_URL_CLIENT")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(AuthMiddleware)

app.include_router(auth_router, tags=["Auth"])
app.include_router(user_router, tags=["User"])
app.include_router(movie_router, tags=["Movie"])
app.include_router(review_router, tags=["Review"])

add_pagination(app)