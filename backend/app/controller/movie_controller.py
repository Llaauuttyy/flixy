from typing import Annotated, List, Optional
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.movie_service import MovieService
from app.dto.movie import MovieGetResponse
from fastapi import APIRouter, Depends, Path, HTTPException, Request, Query
from fastapi_pagination import Page, paginate

movie_router = APIRouter()

MovieServiceDep = Annotated[MovieService, Depends(lambda: MovieService())]

@movie_router.get("/movies")
def get_movies(session: SessionDep, request: Request, movie_service: MovieServiceDep, search_query: str = None, order_column = "title", order_way = "asc", genres: list[str] = Query(None)) -> Page[MovieGetResponse]:
    user_id = request.state.user_id
    try:
        if search_query is None or search_query == "":
            movies = movie_service.get_all_movies(
                Database(session),
                user_id=user_id,
                order_column=order_column,
                order_way=order_way,
                genres=genres
            )
        else:
            movies = movie_service.search_movies(Database(session), search_query, user_id)
        return paginate(movies)
    except Exception as e:
        raise HTTPException(status_code=409, detail=str(e))

@movie_router.get("/movie/{id}")
def get_movie(session: SessionDep, request: Request, movie_service: MovieServiceDep, id: int = Path(..., title="movie id", ge=1)) -> MovieGetResponse:
    user_id = request.state.user_id
    try:
        movie = movie_service.get_movie_by_id(Database(session), user_id, id)
        return movie
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))