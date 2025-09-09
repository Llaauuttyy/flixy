from app.constants.message import MOVIE_ALREADY_IN_WATCHLIST, MOVIE_NOT_FOUND_IN_WATCHLIST
from tests.setup import client

def test_edit_watchlist_name_should_return_watchlist():
    watchlist_edit_dto = {
        "name": "My Watchlist No Description"
    }

    response = client.patch("/watchlist/1", json=watchlist_edit_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert watchlist_edit_dto["name"] == response_json["name"]

def test_edit_watchlist_description_should_return_watchlist():
    watchlist_edit_dto = {
        "description": "A description for my watchlist"
    }

    response = client.patch("/watchlist/1", json=watchlist_edit_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert watchlist_edit_dto["description"] == response_json["description"]

def test_edit_watchlist_add_movies_should_return_watchlist():
    watchlist_edit_dto = {
        "movie_ids_to_add": [4]
    }

    response = client.patch("/watchlist/1", json=watchlist_edit_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert len(watchlist_edit_dto["movie_ids_to_add"]) == len(response_json["movie_ids_added"])
    for movie in watchlist_edit_dto["movie_ids_to_add"]:
        assert movie in response_json["movie_ids_added"]

def test_edit_watchlist_delete_movies_should_return_watchlist():
    watchlist_edit_dto = {
        "movie_ids_to_delete": [1]
    }

    response = client.patch("/watchlist/1", json=watchlist_edit_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert len(response_json["movie_ids_deleted"]) == 1
    for movie in response_json["movie_ids_deleted"]:
        assert movie in watchlist_edit_dto["movie_ids_to_delete"]

def test_edit_watchlist_all_editable_should_return_watchlist():
    watchlist_edit_dto = {
        "name": "My Watchlist Edited",
        "description": "A description for my watchlist edited",
        "movie_ids_to_add": [5],
        "movie_ids_to_delete": [2]
    }

    response = client.patch("/watchlist/1", json=watchlist_edit_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert watchlist_edit_dto["name"] == response_json["name"]
    assert watchlist_edit_dto["description"] == response_json["description"]
    assert len(watchlist_edit_dto["movie_ids_to_add"]) == len(response_json["movie_ids_added"])
    
    for movie in watchlist_edit_dto["movie_ids_to_add"]:
        assert movie in response_json["movie_ids_added"]
    
    assert len(response_json["movie_ids_deleted"]) == len(watchlist_edit_dto["movie_ids_to_delete"])
    
    for movie in response_json["movie_ids_deleted"]:
        assert movie in watchlist_edit_dto["movie_ids_to_delete"]

def test_edit_watchlist_add_already_existing_movie_should_return_movie_already_in_watchlist():
    movie_already_existing = 3
    watchlist_edit_dto = {
        "movie_ids_to_add": [movie_already_existing]
    }

    response = client.patch("/watchlist/1", json=watchlist_edit_dto)

    assert response.status_code == 409
    response_json = response.json()

    assert response_json["detail"] == MOVIE_ALREADY_IN_WATCHLIST(movie_already_existing)

def test_edit_watchlist_with_delete_not_found_movie_should_return_movie_not_found_in_watchlist():
    movie_not_found_in_watchlist = 9999
    watchlist_edit_dto = {
        "movie_ids_to_delete": [movie_not_found_in_watchlist]
    }

    response = client.patch("/watchlist/1", json=watchlist_edit_dto)

    assert response.status_code == 404
    response_json = response.json()

    assert response_json["detail"] == MOVIE_NOT_FOUND_IN_WATCHLIST(movie_not_found_in_watchlist)
