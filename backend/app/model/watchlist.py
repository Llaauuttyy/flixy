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
    private: bool = False
    saves: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    user: Optional[User] = Relationship(back_populates="watchlists")
    watchlist_movies: List[WatchListMovie] = Relationship(back_populates="watchlist")
    watchlist_saves: list["WatchListSave"] = Relationship(
        back_populates="watchlist",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


    # movies: Optional[WatchListMovie] = Relationship(back_populates="watchlists")
    