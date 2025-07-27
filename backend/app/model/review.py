from typing import Optional
from app.model.user import User
from app.model.movie import Movie
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime


class Review(SQLModel, table=True):
    __tablename__ = "reviews"

    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    movie_id: int = Field(foreign_key="movies.id")
    text: str
    watch_date: datetime
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    user: Optional[User] = Relationship(back_populates="reviews")
    movie: Optional[Movie] = Relationship(back_populates="reviews")
