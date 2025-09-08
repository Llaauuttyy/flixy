from app.model.user import User
from app.model.movie import Movie
from app.model.review import Review
from app.model.watchlist import WatchList
from app.model.watchlist_movie import WatchListMovie
import pytest
from sqlalchemy import event
from sqlmodel import SQLModel, Session, text
from .setup import test_engine
from app.db.database_setup import get_session
from app.main import app
from .setup import client
from .utils import register_and_login_test_user

def clean_all_tables(session):
    session.execute(text("SET FOREIGN_KEY_CHECKS=0;"))

    for table in reversed(SQLModel.metadata.sorted_tables):
        session.execute(text(f"TRUNCATE TABLE `{table.name}`;"))

    session.execute(text("SET FOREIGN_KEY_CHECKS=1;"))
    session.commit()

@pytest.fixture(scope="session", autouse=True)
def clean_database():
    # Antes de todos los tests
    with Session(test_engine) as session:
        clean_all_tables(session)
        add_tests_data(session)
        register_and_login_test_user(client)
        
    yield
    
    # Despues de todos los tests
    # Borra toda la base
    with Session(test_engine) as session:
        clean_all_tables(session)

@pytest.fixture(scope="function", autouse=True)
def override_get_session():
    connection = test_engine.connect()
    transaction = connection.begin()  # inicio de transacción externa
    session = Session(bind=connection)

    # Inicia un savepoint para permitir rollback seguro aunque se llame commit() dentro de la sesión
    nested = connection.begin_nested()

    def get_test_session():
        yield session

    app.dependency_overrides[get_session] = get_test_session

    @event.listens_for(session, "after_transaction_end")
    def restart_savepoint(session_, transaction_):
        # Si el savepoint termina (por commit/rollback), se reinicia automáticamente
        if nested.is_active:
            return
        session_.connection().begin_nested()

    yield

    transaction.rollback()

def add_tests_data(session):
    users = get_users_data()
    session.add_all(users)

    movies = get_movies_data()
    session.add_all(movies)

    reviews = get_reviews_data()
    session.add_all(reviews)

    watchlists, watchlists_movies = get_watchlists_data()
    session.add_all(watchlists)
    session.add_all(watchlists_movies)

    session.commit()

def get_users_data():
    users = []
    users.append(User(
        name="Usuario Prueba 1",
        username="test_user_1",
        email="user1@example.com",
        password="$2b$12$fzHB.Yl9Zwloqhnsx5dfZOS6HkPtth.NXgGQ3jbQa.yuIFtnHwO8e" # User.1234
    ))
    users.append(User(
        name="Usuario Prueba 2",
        username="test_user_2",
        email="user2@example.com",
        password="$2b$12$fzHB.Yl9Zwloqhnsx5dfZOS6HkPtth.NXgGQ3jbQa.yuIFtnHwO8e" # User.1234
    ))
    return users

def get_movies_data():
    movies = []

    movies.append(Movie(
        title='Eclipse Hearts',
        year='2021',
        imdb_rating='7.4',
        genres='Drama, Mystery',
        countries='France',
        duration='110',
        cast='Jean Reno, Léa Seydoux',
        directors='Luc Besson',
        writers='Claire Denis, David Foenkinos',
        plot='A quiet village is shaken when two strangers arrive claiming to be siblings. Their dark past slowly unfolds under the town’s watchful eye.',
        logo_url='https://example.com/e1.jpg',
        created_at='2025-07-19 23:30:43',
        updated_at='2025-07-19 23:30:43'
    ))
    movies.append(Movie(
        title='Parallel Skies',
        year='2019',
        imdb_rating='8.1',
        genres='Sci-Fi, Romance',
        countries='Canada',
        duration='124',
        cast='Ellen Page, Ryan Gosling',
        directors='Denis Villeneuve',
        writers='Jane Doe, Mark Lee',
        plot='Two people from different timelines fall in love through mysterious signals sent through the northern lights.',
        logo_url='https://example.com/e2.jpg',
        created_at='2025-07-19 23:30:43',
        updated_at='2025-07-19 23:30:43'
    ))
    movies.append(Movie(
        title='Forgotten River',
        year='2022',
        imdb_rating='6.9',
        genres='Thriller, Drama',
        countries='Brazil',
        duration='98',
        cast='Alice Braga, Wagner Moura',
        directors='Fernando Meirelles',
        writers='Bruna Lima, Tiago Costa',
        plot='A young detective is sent to a remote village to solve a disappearance, only to uncover a larger conspiracy.',
        logo_url='https://example.com/e3.jpg',
        created_at='2025-07-19 23:30:43',
        updated_at='2025-07-19 23:30:43'
    ))
    movies.append(Movie(
        title='Glass Echoes',
        year='2020',
        imdb_rating='7.7',
        genres='Fantasy, Adventure',
        countries='UK',
        duration='140',
        cast='Tom Hiddleston, Lily James',
        directors='Joe Wright',
        writers='Nina Parker, Sam Kent',
        plot='In a world where music holds power, two rebels must unite to restore harmony to their shattered realm.',
        logo_url='https://example.com/e4.jpg',
        created_at='2025-07-19 23:30:43',
        updated_at='2025-07-19 23:30:43'
    ))
    movies.append(Movie(
        title='Crimson Frame',
        year='2018',
        imdb_rating='7.2',
        genres='Horror, Mystery',
        countries='South Korea',
        duration='113',
        cast='Bae Doona, Lee Byung-hun',
        directors='Park Chan-wook',
        writers='Min Ji-eun, Kang Woo',
        plot='An artist begins painting scenes she hasn’t witnessed—until they start happening in real life.',
        logo_url='https://example.com/e5.jpg',
        created_at='2025-07-19 23:30:43',
        updated_at='2025-07-19 23:30:43'
    ))

    return movies

def get_reviews_data():
    reviews = []

    reviews.append(Review(
        user_id=1,
        movie_id=1,
        rating=2,
        text="Review of a test movie.",
        watch_date='2025-07-19 23:30:43',
    ))
    reviews.append(Review(
        user_id=1,
        movie_id=2,
        rating=None,
        text=None,
        watch_date='2025-07-19 23:30:43',
    ))

    return reviews

def get_watchlists_data():
    watchlists = []

    watchlists.append(WatchList(
        user_id=1,
        name="Watchlist Test 1",
        description="This is the first test watchlist."
    ))

    watchlists.append(WatchList(
        user_id=1,
        name="Watchlist Test 2",
        description="This is the second test watchlist."
    ))

    watchlists.append(WatchList(
        user_id=1,
        name="Watchlist Test 3",
        description="This is the third test watchlist."
    ))

    watchlists_movies = []

    watchlists_movies.append(WatchListMovie(
        watchlist_id=1,
        movie_id=1,
        user_id=1
    ))
    watchlists_movies.append(WatchListMovie(
        watchlist_id=1,
        movie_id=2,
        user_id=1
    ))
    watchlists_movies.append(WatchListMovie(
        watchlist_id=1,
        movie_id=3,
        user_id=1
    ))

    watchlists_movies.append(WatchListMovie(
        watchlist_id=3,
        movie_id=1,
        user_id=1
    ))

    return watchlists, watchlists_movies