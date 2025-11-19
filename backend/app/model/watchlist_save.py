from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime


class WatchListSave(SQLModel, table=True):
    __tablename__ = "watchlist_saves"

    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    watchlist_id: int = Field(foreign_key="watchlists.id")
    created_at: datetime = Field(default_factory=datetime.now)

    user: Optional["User"] = Relationship(back_populates="watchlist_saves")
    watchlist: Optional["WatchList"] = Relationship(back_populates="watchlist_saves")