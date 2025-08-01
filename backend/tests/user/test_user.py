from app.constants.message import EXISTENT_USERNAME_ERROR
from tests.setup import client

def test_update_user_data_changing_all_data_should_succeed():
    user_update_dto = {
        "name": "Test Name Changed",
        "username": "new_username",
        "email": "newuseremail@example.com"
    }

    response = client.patch("/user", json=user_update_dto)
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["name"] == user_update_dto["name"]
    assert response_json["username"] == user_update_dto["username"]
    assert response_json["email"] == user_update_dto["email"]

def test_update_user_data_using_an_existent_username_should_fail():
    user_update_dto = {
        "name": "Test Name Changed",
        "username": "test_user_2",
    }

    response = client.patch("/user", json=user_update_dto)
    assert response.status_code == 400
    assert response.json()["detail"] == EXISTENT_USERNAME_ERROR