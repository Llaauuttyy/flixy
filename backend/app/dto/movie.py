from typing import Optional
from pydantic import BaseModel


class MovieDTO(BaseModel):
    id: int
    title: str
    year: Optional[str]
    duration: Optional[int]
    genre: Optional[str]
    certificate: Optional[str]
    description: Optional[str]
    actors: Optional[str]
    directors: Optional[str]