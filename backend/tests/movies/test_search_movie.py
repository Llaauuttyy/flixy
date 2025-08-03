from tests.setup import client

def test_search_movie_by_title_should_return_some_results():
    title_content = "heart"
    response = client.get("/movies?search_query=" + title_content)

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["total"] > 0
    assert title_content in response_json["items"][0]["title"].lower()

def test_search_movie_by_genre_should_return_some_results():
    genre_content = "romance"
    response = client.get("/movies?search_query=" + genre_content)

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["total"] > 0
    assert genre_content.lower() in response_json["items"][0]["genres"].lower()

def test_search_movie_by_directors_should_return_some_results():
    directors_content = "Denis Villeneuve"
    response = client.get("/movies?search_query=" + directors_content)

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["total"] > 0
    assert directors_content.lower() in response_json["items"][0]["directors"].lower()

def test_search_movie_by_cast_should_return_some_results():
    cast_content = "Tom Hiddleston"
    response = client.get("/movies?search_query=" + cast_content)

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["total"] > 0
    assert cast_content.lower() in response_json["items"][0]["cast"].lower()

def test_search_movie_with_unexistent_text_should_return_none_results():
    unexistent = "This text doesnt exist"
    response = client.get("/movies?search_query=" + unexistent)

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["total"] == 0