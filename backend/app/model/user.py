from typing import List
from sqlmodel import Field, SQLModel, Relationship

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int = Field(default=None, primary_key=True)
    name: str
    username: str = Field(index=True, unique=True)
    email: str
    password: str

    reviews: List["Review"] = Relationship(back_populates="user")
    watchlists: List["WatchList"] = Relationship(back_populates="user")
    watchlist_movies: List["WatchListMovie"] = Relationship(back_populates="user")
