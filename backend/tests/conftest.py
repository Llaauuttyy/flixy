from app.model.user import User
import pytest
from sqlalchemy import event
from sqlmodel import SQLModel, Session, text
from .setup import test_engine
from app.db.database_setup import get_session
from app.main import app

@pytest.fixture(scope="session", autouse=True)
def clean_database():
    # Antes de todos los tests
    with Session(test_engine) as session:
        add_tests_data(session)

    yield
    
    # Despues de todos los tests
    # Borra toda la base
    with Session(test_engine) as session:
        session.execute(text("SET FOREIGN_KEY_CHECKS=0;"))
        for table in reversed(SQLModel.metadata.sorted_tables):
            session.execute(table.delete())
        session.execute(text("SET FOREIGN_KEY_CHECKS=1;"))
        session.commit()

@pytest.fixture(scope="function", autouse=True)
def override_get_session():
    connection = test_engine.connect()
    transaction = connection.begin()  # inicio de transacción externa
    session = Session(bind=connection)

    # Inicia un savepoint para permitir rollback seguro aunque se llame commit() dentro de la sesión
    nested = connection.begin_nested()

    def get_test_session():
        yield session

    app.dependency_overrides[get_session] = get_test_session

    @event.listens_for(session, "after_transaction_end")
    def restart_savepoint(session_, transaction_):
        # Si el savepoint termina (por commit/rollback), se reinicia automáticamente
        if nested.is_active:
            return
        session_.connection().begin_nested()

    yield

    transaction.rollback()

def add_tests_data(session):
    users = get_users_data()
    session.add_all(users)
    session.commit()

def get_users_data():
    users = []
    users.append(User(
        name="Usuario Prueba 1",
        username="test_user_1",
        email="user1@example.com",
        password="$2b$12$fzHB.Yl9Zwloqhnsx5dfZOS6HkPtth.NXgGQ3jbQa.yuIFtnHwO8e" # User.1234
    ))
    users.append(User(
        name="Usuario Prueba 2",
        username="test_user_2",
        email="user2@example.com",
        password="$2b$12$fzHB.Yl9Zwloqhnsx5dfZOS6HkPtth.NXgGQ3jbQa.yuIFtnHwO8e" # User.1234
    ))
    return users