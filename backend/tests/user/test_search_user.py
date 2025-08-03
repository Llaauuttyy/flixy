from tests.setup import client

def test_search_user_by_name_should_return_some_results():
    name_content = "Prueba"
    response = client.get("/users?search_query=" + name_content)

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["total"] > 0
    assert name_content.lower() in response_json["items"][0]["name"].lower()

def test_search_user_by_username_should_return_some_results():
    username_content = "test_user"
    response = client.get("/users?search_query=" + username_content)

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["total"] > 0
    assert username_content.lower() in response_json["items"][0]["username"].lower()

def test_search_user_should_not_include_user_searching():
    content = "test_user"
    response = client.get("/users?search_query=" + content)

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["total"] > 0

    includes_user_searching = False
    for user in response_json["items"]:
        if user["username"] == "test_user_1":
            includes_user_searching = True

    assert includes_user_searching == False