from sqlmodel import Field, SQLModel

class Movie(SQLModel, table=True):
    __tablename__ = "movies"

    id: int = Field(default=None, primary_key=True)
    title: str
    year: str
    duration: int
    genre: str
    certificate: str
    description: str
    actors: str
    directors: str