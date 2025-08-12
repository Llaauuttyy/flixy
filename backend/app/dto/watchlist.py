from typing import Optional
from pydantic import BaseModel, model_validator
from datetime import datetime as datetime
from fastapi_pagination import Page
from app.dto.movie import MovieGetResponse


class WatchListDTO(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    movies: Optional[list[MovieGetResponse]] = []
    created_at: datetime
    updated_at: datetime

class WatchListGetResponse(BaseModel):
    items: Page[WatchListDTO]

class WatchListCreationDTO(BaseModel):
    name: str
    description: Optional[str] = None
    movie_ids: Optional[list[int]] = []

class WatchListEditionDTO(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    movie_ids_to_add: Optional[list[int]] = []
    movie_ids_to_delete: Optional[list[int]] = []

    @model_validator(mode='before')
    def at_least_one_field(cls, values):
        name, description, movie_ids_to_add, movie_ids_to_delete = values.get("name"), values.get("description"), values.get("movie_ids_to_add"), values.get("movie_ids_to_delete")
        if name is None and description is None and not movie_ids_to_add and not movie_ids_to_delete:
            raise ValueError("You must provide at least one field to edit.")
        return values

class WatchListEditResponse(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    movie_ids_added: Optional[list[int]] = []
    movie_ids_deleted: Optional[list[int]] = []

class WatchListCreateResponse(WatchListCreationDTO):
    id: int
    
class WatchListMovieCreationDTO(BaseModel):
    watchlist_id: int
    movie_id: int