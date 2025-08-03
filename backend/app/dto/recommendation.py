from typing import Optional
from app.dto.movie import MovieDTO
from pydantic import BaseModel

class Recommendations(BaseModel):
    movies: list[MovieDTO]
