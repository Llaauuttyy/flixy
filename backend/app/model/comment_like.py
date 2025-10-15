from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime


class CommentLike(SQLModel, table=True):
    __tablename__ = "comment_likes"

    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    comment_id: int = Field(foreign_key="comments.id")
    created_at: datetime = Field(default_factory=datetime.now)

    user: Optional["User"] = Relationship(back_populates="comment_likes")
    comment: Optional["Comment"] = Relationship(back_populates="comment_likes")