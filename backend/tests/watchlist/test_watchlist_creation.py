from app.constants.message import MOVIE_NOT_FOUND, WATCHLIST_ALREADY_EXISTS
from tests.setup import client
from tests.utils import NOT_EXISTENT_MOVIE_ID

def test_create_watchlist_with_no_description_should_return_watchlist():
    watchlist_dto = {
        "name": "My Watchlist No Description"
    }

    response = client.post("/watchlist", json=watchlist_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert watchlist_dto["name"] == response_json["name"]
    
def test_create_watchlist_with_no_movies_should_return_watchlist():
    watchlist_dto = {
        "name": "My Watchlist No Movies",
        "description": "A description for my watchlist",
    }

    response = client.post("/watchlist", json=watchlist_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert watchlist_dto["name"] == response_json["name"]
    assert watchlist_dto["description"] == response_json["description"]

def test_create_watchlist_with_movies_should_return_watchlist():
    watchlist_dto = {
        "name": "My Watchlist No Movies",
        "description": "A description for my watchlist",
        "movie_ids": [1, 2, 3]
    }

    response = client.post("/watchlist", json=watchlist_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert watchlist_dto["name"] == response_json["name"]
    assert watchlist_dto["description"] == response_json["description"]
    assert len(watchlist_dto["movie_ids"]) == len(response_json["movie_ids"])
    for movie in response_json["movie_ids"]:
        assert movie in watchlist_dto["movie_ids"]

def test_create_watchlist_with_not_found_movies_should_return_movie_not_found():
    watchlist_dto = {
        "name": "My Watchlist Non-Existent Movies",
        "description": "A description for my watchlist",
        "movie_ids": [1, NOT_EXISTENT_MOVIE_ID]
    }

    response = client.post("/watchlist", json=watchlist_dto)

    assert response.status_code == 404
    response_json = response.json()

    assert response_json["detail"] == MOVIE_NOT_FOUND

def test_create_watchlist_with_taken_name_should_return_watchlist_already_exists():
    watchlist_dto = {
        "name": "My Watchlist Taken Name",
        "description": "A description for my watchlist",
    }

    # Creates watchlist
    response = client.post("/watchlist", json=watchlist_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert watchlist_dto["name"] == response_json["name"]
    assert watchlist_dto["description"] == response_json["description"]

    # Tries to create it again with the same name
    response = client.post("/watchlist", json=watchlist_dto)

    assert response.status_code == 409
    response_json = response.json()

    assert response_json["detail"] == WATCHLIST_ALREADY_EXISTS