from typing import Optional
from pydantic import BaseModel
from datetime import datetime as datetime
from fastapi_pagination import Page
from app.dto.movie import MovieDTO

class WatchListCreateResponse(BaseModel):
    name: str
    description: Optional[str] = None
    movie_id: Optional[int] = None

class WatchListDTO(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    movies: Optional[list[MovieDTO]] = None
    updated_at: datetime

class WatchListGetResponse(BaseModel):
    items: Page[WatchListDTO]

class WatchListCreationDTO(BaseModel):
    name: str
    description: Optional[str] = None
    movie_id: Optional[int] = None

class WatchListMovieCreationDTO(BaseModel):
    watchlist_id: int
    movie_id: int