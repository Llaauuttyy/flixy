from tests.setup import client
from app.dto.movie import MovieRateDTO
from app.constants.message import MOVIE_NOT_FOUND, FUTURE_TRAVELER, INSULTING_REVIEW
import pytest
from tests.utils import NOT_EXISTENT_MOVIE_ID
from datetime import datetime, timedelta

def test_review_with_valid_review_should_return_review():
    time = (datetime.now()).strftime("%Y-%m-%dT%H:%M:%S")
    review_dto = {
        "movie_id": 1,
        "text": "Not really my type. I did not like it!",
        "watch_date": time
    }

    response = client.post("/review", json=review_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["movie_id"] == review_dto["movie_id"]
    assert response_json["text"] == review_dto["text"]
    assert response_json["watch_date"] == review_dto["watch_date"]

def test_review_with_invalid_movie_should_return_not_found():
    time = (datetime.now()).strftime("%Y-%m-%dT%H:%M:%S")
    review_dto = {
        "movie_id": NOT_EXISTENT_MOVIE_ID,
        "text": "Great movie!",
        "watch_date": time
    }

    response = client.post("/review", json=review_dto)

    assert response.status_code == 404
    response_json = response.json()

    assert response_json["detail"] == MOVIE_NOT_FOUND

def test_review_with_invalid_date_should_return_future_traveler_error():
    time = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%S")
    review_dto = {
        "movie_id": 1,
        "text": "Great movie!",
        "watch_date": time
    }

    response = client.post("/review", json=review_dto)

    assert response.status_code == 400
    response_json = response.json()

    assert response_json["detail"] == FUTURE_TRAVELER

def test_review_with_insulting_content_should_return_insulting_review_error():
    time = (datetime.now()).strftime("%Y-%m-%dT%H:%M:%S")
    review_dto = {
        "movie_id": 1,
        "text": "What a shitty movie!",
        "watch_date": time
    }

    response = client.post("/review", json=review_dto)

    assert response.status_code == 400
    response_json = response.json()

    assert response_json["detail"] == INSULTING_REVIEW