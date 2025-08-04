from typing import List, Optional
from app.model.user import User
from app.model.watchlist_movie import WatchListMovie
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime


class WatchList(SQLModel, table=True):
    __tablename__ = "watchlists"

    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    name: str = Field(unique=True)
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    user: Optional[User] = Relationship(back_populates="watchlists")
    watchlist_movies: List[WatchListMovie] = Relationship(back_populates="watchlist")

    # movies: Optional[WatchListMovie] = Relationship(back_populates="watchlists")
