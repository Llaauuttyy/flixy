from app.constants.message import WATCHLIST_NOT_FOUND
from tests.setup import client


def test_delete_watchlist_with_no_movies_should_return_watchlist_id():
    watchlist_with_no_movies = 2
    response = client.delete(f"/watchlist/{watchlist_with_no_movies}")

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["watchlist_id"] == watchlist_with_no_movies

def test_delete_watchlist_with_movies_should_return_watchlist_id():
    watchlist_with_movies = 3
    response = client.delete(f"/watchlist/{watchlist_with_movies}")

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["watchlist_id"] == watchlist_with_movies

def test_delete_watchlist_not_existent_should_return_watchlist_not_found():
    not_existent_watchlist = 9999
    response = client.delete(f"/watchlist/{not_existent_watchlist}")

    assert response.status_code == 404
    response_json = response.json()

    assert response_json["detail"] == WATCHLIST_NOT_FOUND