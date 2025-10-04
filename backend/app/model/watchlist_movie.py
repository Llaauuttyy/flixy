from typing import Optional
from app.model.user import User
from app.model.movie import Movie
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime

class WatchListMovie(SQLModel, table=True):
    __tablename__ = "watchlist_movies"

    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    watchlist_id: int = Field(foreign_key="watchlists.id")
    movie_id: int = Field(foreign_key="movies.id")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    user: Optional[User] = Relationship(back_populates="watchlist_movies")
    movie: Optional[Movie] = Relationship(back_populates="watchlist_movie")
    watchlist: Optional["WatchList"] = Relationship(back_populates="watchlist_movies")
