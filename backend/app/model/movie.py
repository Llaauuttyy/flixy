from typing import List, Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime


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
    youtube_trailer_id: Optional[str] = None
    is_trailer_reliable: Optional[bool] = None
    flixy_ratings_sum: int = 0
    flixy_ratings_total: int = 0
    created_at: datetime
    updated_at: datetime

    reviews: List["Review"] = Relationship(back_populates="movie")
    watchlist_movie: List["WatchListMovie"] = Relationship(back_populates="movie")

