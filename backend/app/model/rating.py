from typing import Optional
from app.model.user import User
from app.model.movie import Movie
from sqlmodel import Field, SQLModel, Relationship

class Rating(SQLModel, table=True):
    __tablename__ = "ratings"

    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    movie_id: int = Field(foreign_key="movies.id")
    user_rating: int

    user: Optional[User] = Relationship(back_populates="ratings")
    movie: Optional[Movie] = Relationship(back_populates="ratings")
