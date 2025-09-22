from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime


class Review(SQLModel, table=True):
    __tablename__ = "reviews"

    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    movie_id: int = Field(foreign_key="movies.id")
    rating: Optional[int]
    text: Optional[str]
    watch_date: datetime
    likes: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.now)
    visible_updated_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    user: Optional["User"] = Relationship(back_populates="reviews")
    movie: Optional["Movie"] = Relationship(back_populates="reviews")
    review_likes: list["ReviewLike"] = Relationship(back_populates="review")
