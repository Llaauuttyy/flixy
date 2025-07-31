from app.constants.message import OLD_AND_NEW_PASSWORDS_ARE_THE_SAME_ERROR, OLD_PASSWORD_DOESNT_MATCH_ERROR, PASSWORD_VALIDATION_ERROR
from .setup import client

def test_update_password_with_valid_data_should_succeed():
    update_password_form = {
        "old_password": "User.1234",
        "new_password": "Prueba.1234"
    }

    response = client.patch("/password", json=update_password_form)
    assert response.status_code == 200

def test_update_password_with_different_old_password_should_fail():
    update_password_form = {
        "old_password": "NotExist.1234",
        "new_password": "Prueba.1234"
    }

    response = client.patch("/password", json=update_password_form)
    assert response.status_code == 400
    assert response.json()["detail"] == OLD_PASSWORD_DOESNT_MATCH_ERROR

def test_update_password_with_same_old_and_new_password_should_fail():
    update_password_form = {
        "old_password": "User.1234",
        "new_password": "User.1234"
    }

    response = client.patch("/password", json=update_password_form)
    assert response.status_code == 400
    assert response.json()["detail"] == OLD_AND_NEW_PASSWORDS_ARE_THE_SAME_ERROR

def test_update_password_with_invalid_new_password_should_fail():
    update_password_form = {
        "old_password": "User.1234",
        "new_password": "newpassword"
    }

    response = client.patch("/password", json=update_password_form)
    assert response.status_code == 400
    assert response.json()["detail"] == PASSWORD_VALIDATION_ERROR