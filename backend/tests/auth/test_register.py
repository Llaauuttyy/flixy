from tests.setup import client

def test_register_with_valid_user_should_success():
    register_form = {
        "name": "Other Prueba",
        "username": "test_user_unexistent",
        "email": "user@example.com",
        "password": "User.1234"
    }

    response = client.post("/register", json=register_form)
    assert response.status_code == 200
    assert "id" in response.json().keys() and isinstance(response.json()["id"], int)

def test_register_with_no_username_should_fail():
    register_form = {
        "name": "Other Prueba",
        "email": "user@example.com",
        "password": "User.1234"
    }

    response = client.post("/register", json=register_form)
    assert response.status_code == 422

def test_register_with_invalid_password_should_fail():
    register_form = {
        "name": "Other Prueba",
        "username": "test_user_unexistent",
        "email": "user@example.com",
        "password": "user"
    }

    response = client.post("/register", json=register_form)
    assert response.status_code == 400

def test_register_with_existent_user_should_fail():
    invalid_register_form = {
        "name": "Other User",
        "username": "test_user_1",
        "email": "other@example.com",
        "password": "Other.1234"
    }

    invalid_response = client.post("/register", json=invalid_register_form)
    assert invalid_response.status_code == 400