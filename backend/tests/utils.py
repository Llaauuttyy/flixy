NOT_EXISTENT_MOVIE_ID = 9999999

def register_and_login_test_user(client):
    login_form = {
        "username": "test_user_1",
        "password": "User.1234"
    }
    login_response = client.post("/login", json=login_form)
    access_token = login_response.json()["access_token"]
    client.headers = {"Authorization": f"Bearer {access_token}"}