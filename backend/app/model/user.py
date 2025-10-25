from typing import List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime

from app.model.user_achievement import UserAchievement

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int = Field(default=None, primary_key=True)
    name: str
    username: str = Field(index=True, unique=True)
    email: str
    password: str
    reset_token: str = Field(default=None, nullable=True)
    reset_token_expires_at: str = Field(default=None, nullable=True)
    followers: int = Field(default=0)
    following: int = Field(default=0)
    about_me: str = Field(default="")

    created_at: datetime = Field(default_factory=datetime.now)

    reviews: List["Review"] = Relationship(back_populates="user")
    comments: List["Comment"] = Relationship(back_populates="user")
    comment_likes: List["CommentLike"] = Relationship(back_populates="user")
    watchlists: List["WatchList"] = Relationship(back_populates="user")
    watchlist_movies: List["WatchListMovie"] = Relationship(back_populates="user")
    review_likes: List["ReviewLike"] = Relationship(back_populates="user")
    followers_list: List["UserRelationship"] = Relationship(
        back_populates="followed",
        sa_relationship_kwargs={"foreign_keys": "[UserRelationship.followed_id]"},
    )
    following_list: List["UserRelationship"] = Relationship(
        back_populates="follower",
        sa_relationship_kwargs={"foreign_keys": "[UserRelationship.follower_id]"},
    )

    achievements: list[UserAchievement] = Relationship(back_populates="user")


