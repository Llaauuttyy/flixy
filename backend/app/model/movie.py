from typing import List, Optional
from sqlmodel import Field, SQLModel, Relationship

class Movie(SQLModel, table=True):
    __tablename__ = "movies"

    id: int = Field(default=None, primary_key=True)
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

    reviews: List["Review"] = Relationship(back_populates="movie")
