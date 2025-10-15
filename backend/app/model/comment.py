from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime


class Comment(SQLModel, table=True):
    __tablename__ = "comments"

    id: int = Field(default=None, primary_key=True)
    review_id: int = Field(foreign_key="reviews.id")
    user_id: int = Field(foreign_key="users.id")
    text: Optional[str]
    likes: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.now)
    
    user: Optional["User"] = Relationship(back_populates="comments")
    review: Optional["Review"] = Relationship(back_populates="comments")
    comment_likes: list["CommentLike"] = Relationship(back_populates="comment")
