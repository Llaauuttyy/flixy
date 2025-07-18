from sqlmodel import create_engine, Session
from os import getenv
from typing import Annotated
from fastapi import Depends

USER = getenv("DB_USER")
PASSWORD = getenv("DB_PWD")
HOST = getenv("DB_HOST")
PORT = int(getenv("DB_PORT", 0))
db_url = f"mysql+mysqlconnector://{USER}:{PASSWORD}@{HOST}:{PORT}/flixy"

engine = create_engine(db_url)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]