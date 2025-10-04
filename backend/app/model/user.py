from typing import List
from sqlmodel import Field, SQLModel, Relationship

from app.model.user_achievement import UserAchievement

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int = Field(default=None, primary_key=True)
    name: str
    username: str = Field(index=True, unique=True)
    email: str
    password: str
    followers: int = Field(default=0)
    following: int = Field(default=0)
    about_me: str = Field(default="")

    reviews: List["Review"] = Relationship(back_populates="user")
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


