from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.movie_service import MovieService
from app.dto.movie import MovieDTO
from fastapi import APIRouter, Depends

movie_router = APIRouter()

MovieServiceDep = Annotated[MovieService, Depends(lambda: MovieService())]

@movie_router.get("")
def get_users(session: SessionDep, movie_service: MovieServiceDep) -> list[MovieDTO]:
    return movie_service.get_all_movies(Database(session))