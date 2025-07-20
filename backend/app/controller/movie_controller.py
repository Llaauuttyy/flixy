from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.movie_service import MovieService
from app.dto.movie import MovieDTO
from fastapi import APIRouter, Depends, Path, HTTPException
from fastapi_pagination import Page, paginate

movie_router = APIRouter()

MovieServiceDep = Annotated[MovieService, Depends(lambda: MovieService())]

@movie_router.get("/movies")
def get_movies(session: SessionDep, movie_service: MovieServiceDep) -> Page[MovieDTO]:
    movies = movie_service.get_all_movies(Database(session))
    return paginate(movies)

@movie_router.get("/movie/{id}")
def get_movie(session: SessionDep, movie_service: MovieServiceDep, id: int = Path(..., title="movie id", ge=1)) -> MovieDTO:
    try:
        movie = movie_service.get_movie_by_id(Database(session), id)
        return movie
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))