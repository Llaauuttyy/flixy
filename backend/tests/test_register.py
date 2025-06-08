from .setup import client, test_engine
from sqlmodel import SQLModel, Session, text

# Configuración de pytest para limpiar la base de datos antes de cada prueba
def setup_function():
    with Session(test_engine) as session:
        session.execute(text("SET FOREIGN_KEY_CHECKS=0;"))
        for table in reversed(SQLModel.metadata.sorted_tables):
            session.execute(table.delete())
        session.execute(text("SET FOREIGN_KEY_CHECKS=1;"))
        session.commit()

def test_register_with_valid_user_should_success():
    register_form = {
        "name": "Usuario Prueba",
        "username": "test_user",
        "email": "user@example.com",
        "password": "User.1234"
    }

    response = client.post("/register", json=register_form)
    assert response.status_code == 200
    assert "id" in response.json().keys() and isinstance(response.json()["id"], int)

def test_register_with_no_username_should_fail():
    register_form = {
        "name": "Usuario Prueba",
        "email": "user@example.com",
        "password": "User.1234"
    }

    response = client.post("/register", json=register_form)
    assert response.status_code == 422

def test_register_with_invalid_password_should_fail():
    register_form = {
        "name": "Usuario Prueba",
        "username": "test_user",
        "email": "user@example.com",
        "password": "user"
    }

    response = client.post("/register", json=register_form)
    assert response.status_code == 400

def test_register_with_existent_user_should_fail():
    valid_register_form = {
        "name": "Usuario Prueba",
        "username": "test_user",
        "email": "user@example.com",
        "password": "User.1234"
    }

    invalid_register_form = {
        "name": "Other User",
        "username": "test_user",
        "email": "other@example.com",
        "password": "Other.1234"
    }

    valid_response = client.post("/register", json=valid_register_form)
    assert valid_response.status_code == 200
    invalid_response = client.post("/register", json=invalid_register_form)
    assert invalid_response.status_code == 400