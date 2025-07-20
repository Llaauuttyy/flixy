from typing import Optional
from pydantic import BaseModel, Field


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

class MovieRateDTO(BaseModel):
    id: int
    rating: int = Field(..., ge=0, le=5)

class MovieRatingDTO(BaseModel):
    id: int
    user_id: int
    movie_id: int
    user_rating: int

class MovieGetResponse(BaseModel):
    movie: MovieDTO
    rating: Optional[MovieRatingDTO] = None