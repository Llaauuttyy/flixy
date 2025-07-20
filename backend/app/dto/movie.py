from typing import Optional
from pydantic import BaseModel


class MovieDTO(BaseModel):
    id: int
    title: str
    year: int
    imdb_rating: float
    genres: str
    countries: str
    duration: int
    cast: str
    directors: str
    writers: str
    plot: str
    logo_url: str