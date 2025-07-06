from app.constants.message import OLD_PASSWORD_DOESNT_MATCH
from .setup import client
import pytest

@pytest.fixture(scope="module", autouse=True)
def register_and_login_test_user():
    register_form = {
        "name": "Usuario Prueba",
        "username": "test_user",
        "email": "user@example.com",
        "password": "User.1234"
    }
    client.post("/register", json=register_form)

    login_form = {
        "username": "test_user",
        "password": "User.1234"
    }
    login_response = client.post("/login", json=login_form)
    access_token = login_response.json()["access_token"]
    client.headers = {"Authorization": f"Bearer {access_token}"}

def test_update_password_with_valid_data_should_succeed():
    update_password_form = {
        "old_password": "User.1234",
        "new_password": "Prueba.1234"
    }

    response = client.patch("/password", json=update_password_form)
    assert response.status_code == 200

# Este test no funciona, hay que ver la configuracion para ejecutar codigo antes
# y despues de cada test porque borra los datos de la base siempre
""" def test_update_password_with_different_old_password_should_fail():
    update_password_form = {
        "old_password": "NotExist.1234",
        "new_password": "Prueba.1234"
    }

    response = client.patch("/password", json=update_password_form)
    assert response.status_code == 400
    assert response.json()["detail"] == OLD_PASSWORD_DOESNT_MATCH """