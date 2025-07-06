from .setup import client

def test_login_with_valid_user_should_return_access_token():
    login_form = {
        "username": "test_user_1",
        "password": "User.1234"
    }

    response = client.post("/login", json=login_form)
    assert response.status_code == 200
    assert "access_token" in response.json().keys() and isinstance(response.json()["access_token"], str)

def test_login_with_existent_username_but_wrong_password_should_fail():
    login_form = {
        "username": "test_user_1",
        "password": "user1234"
    }

    response = client.post("/login", json=login_form)
    assert response.status_code == 400

def test_login_with_unexistent_user_should_fail():
    login_form = {
        "username": "unknown_user",
        "password": "unknown123$"
    }

    response = client.post("/login", json=login_form)
    assert response.status_code == 400