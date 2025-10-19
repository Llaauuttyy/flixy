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

class MovieGetResponse(MovieDTO):
    youtube_trailer_id: Optional[str] = None
    is_trailer_reliable: Optional[bool] = None
    user_rating: Optional[int] = None
    flixy_rating: float = None