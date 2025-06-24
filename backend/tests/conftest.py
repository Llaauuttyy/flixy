import pytest
from sqlmodel import SQLModel, Session, text
from .setup import test_engine

@pytest.fixture(autouse=True)
def clean_database():
    yield
    with Session(test_engine) as session:
        session.execute(text("SET FOREIGN_KEY_CHECKS=0;"))
        for table in reversed(SQLModel.metadata.sorted_tables):
            session.execute(table.delete())
        session.execute(text("SET FOREIGN_KEY_CHECKS=1;"))
        session.commit()