from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime


class ReviewLike(SQLModel, table=True):
    __tablename__ = "review_likes"

    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    review_id: int = Field(foreign_key="reviews.id")
    created_at: datetime = Field(default_factory=datetime.now)

    user: Optional["User"] = Relationship(back_populates="review_likes")
    review: Optional["Review"] = Relationship(back_populates="review_likes")