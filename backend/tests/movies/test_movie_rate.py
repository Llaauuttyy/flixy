from tests.setup import client
from app.dto.movie import MovieRateDTO
from app.constants.message import MOVIE_NOT_FOUND
import pytest
from tests.utils import NOT_EXISTENT_MOVIE_ID


def test_movie_rate_with_valid_movie_should_return_rating():
    movie_rate_dto = dict(MovieRateDTO(id=1, rating=5))

    response = client.post("/movie/rate", json=movie_rate_dto)

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["movie_id"] == movie_rate_dto["id"]
    assert response_json["user_rating"] == movie_rate_dto["rating"]

def test_movie_rate_with_invalid_movie_should_return_not_found():
    movie_rate_dto = dict(MovieRateDTO(id=NOT_EXISTENT_MOVIE_ID, rating=5))

    response = client.post("/movie/rate", json=movie_rate_dto)

    assert response.status_code == 404

    response_json = response.json()
    assert response_json["detail"] == MOVIE_NOT_FOUND