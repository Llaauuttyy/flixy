from sqlmodel import Field, SQLModel, Relationship
from typing import Optional

class UserRelationship(SQLModel, table=True):
    __tablename__ = "user_relationships"

    id: int = Field(default=None, primary_key=True)
    follower_id: int = Field(foreign_key="users.id")
    followed_id: int = Field(foreign_key="users.id")

    follower: Optional["User"] = Relationship(
        back_populates="following",
        sa_relationship_kwargs={"foreign_keys": "[UserRelationship.follower_id]"},
    )
    followed: Optional["User"] = Relationship(
        back_populates="followers",
        sa_relationship_kwargs={"foreign_keys": "[UserRelationship.followed_id]"},
    )
