from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.movie_service import MovieService
from app.dto.movie import MovieDTO
from fastapi import APIRouter, Depends
from fastapi_pagination import Page, paginate

movie_router = APIRouter(tags=["Movie"])

MovieServiceDep = Annotated[MovieService, Depends(lambda: MovieService())]

@movie_router.get("")
def get_movies(session: SessionDep, movie_service: MovieServiceDep) -> Page[MovieDTO]:
    movies = movie_service.get_all_movies(Database(session))
    return paginate(movies)