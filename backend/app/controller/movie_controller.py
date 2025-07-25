from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.movie_service import MovieService
from app.dto.movie import MovieDTO, MovieRateDTO, MovieRatingDTO, MovieGetResponse
from fastapi import APIRouter, Depends, Path, HTTPException, Request
from fastapi_pagination import Page, paginate

movie_router = APIRouter()

MovieServiceDep = Annotated[MovieService, Depends(lambda: MovieService())]

@movie_router.get("/movies")
def get_movies(session: SessionDep, request: Request, movie_service: MovieServiceDep) -> Page[MovieGetResponse]:
    user_id = request.state.user_id
    movies = movie_service.get_all_movies(Database(session), user_id=user_id)
    return paginate(movies)

@movie_router.get("/movie/{id}")
def get_movie(session: SessionDep, request: Request, movie_service: MovieServiceDep, id: int = Path(..., title="movie id", ge=1)) -> MovieGetResponse:
    user_id = request.state.user_id
    try:
        movie = movie_service.get_movie_by_id(Database(session), user_id, id)
        return movie
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@movie_router.post("/movie/rate")
def rate_movie(session: SessionDep, request: Request, movie_rate_dto: MovieRateDTO, movie_service: MovieServiceDep) -> MovieRatingDTO:
    user_id = request.state.user_id
    try:
        rating = movie_service.set_movie_rating(Database(session), movie_rate_dto, user_id)
        return rating
    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))