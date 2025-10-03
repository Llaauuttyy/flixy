from app.model.user import User
from app.dto.movie import MovieGetResponse
from app.model.review import Review
from app.dto.feed import HomeFeed
from app.model.movie import Movie
from app.dto.review import ReviewDTO, ReviewGetSingularDTO
from app.db.database import Database
from sqlalchemy.orm import selectinload
from typing import List, Optional, Tuple
from datetime import datetime as datetime, timedelta
import random


MAX_RESULTS = 10
MAX_RESULTS_BEST_RATED = 20

GENRES = ["Action", "Drama", "Comedy", "Sci-Fi", "Horror", "Romance"]


class FeedService:
    def _get_top_rated_movies(self, db: Database) -> Tuple[Optional[MovieGetResponse], List[MovieGetResponse]]:
        featured_movies = db.find_all_by_multiple(
            model=Movie,
            conditions=None,
            order_by={"way": "desc", "column": "imdb_rating"},
            limit=MAX_RESULTS_BEST_RATED
        )

        movies = []
        for movie in featured_movies:
            movies.append(movie)

        featured_movie = random.choice(movies) if movies else None

        movies = movies[:MAX_RESULTS]

        return MovieGetResponse(
            id=featured_movie.id,
            title=featured_movie.title,
            year=featured_movie.year,
            imdb_rating=featured_movie.imdb_rating,
            genres=featured_movie.genres,
            countries=featured_movie.countries,
            duration=featured_movie.duration,
            cast=featured_movie.cast,
            directors=featured_movie.directors,
            writers=featured_movie.writers,
            plot=featured_movie.plot,
            logo_url=featured_movie.logo_url,
            youtube_trailer_id=featured_movie.youtube_trailer_id,
            is_trailer_reliable=featured_movie.is_trailer_reliable
        ) if featured_movie else None, [
            MovieGetResponse(
                id=movie.id,
                title=movie.title,
                year=movie.year,
                imdb_rating=movie.imdb_rating,
                genres=movie.genres,
                countries=movie.countries,
                duration=movie.duration,
                cast=movie.cast,
                directors=movie.directors,
                writers=movie.writers,
                plot=movie.plot,
                logo_url=movie.logo_url,
                youtube_trailer_id=movie.youtube_trailer_id,
                is_trailer_reliable=movie.is_trailer_reliable
            ) for movie in movies if movie != featured_movie
        ]
    
    def _get_trending_now_movies(self, db: Database) -> List[MovieGetResponse]:
        one_month_ago = datetime.now() - timedelta(weeks=4)

        trending_movies = db.find_all_by_multiple(
            model=Review,
            conditions=db.build_condition([Review.watch_date >= one_month_ago]),
            order_by={"way": "desc", "column": "watch_date"},
            limit=MAX_RESULTS,
            options=[selectinload(Review.movie)]
        )

        movies = [review.movie for review in trending_movies if review.movie]
        movies = sorted(movies, key=lambda movie: sum(1 for r in trending_movies if r.movie_id == movie.id), reverse=True)[:MAX_RESULTS]

        return [
            MovieGetResponse(
                id=movie.id,
                title=movie.title,
                year=movie.year,
                imdb_rating=movie.imdb_rating,
                genres=movie.genres,
                countries=movie.countries,
                duration=movie.duration,
                cast=movie.cast,
                directors=movie.directors,
                writers=movie.writers,
                plot=movie.plot,
                logo_url=movie.logo_url,
                youtube_trailer_id=movie.youtube_trailer_id,
                is_trailer_reliable=movie.is_trailer_reliable
            ) for movie in movies
        ]
    
    def _get_last_watched_movies(self, db: Database, user_id: int) -> List[ReviewGetSingularDTO]:
        user = db.find_by(User, "id", user_id, options=[
            selectinload(User.reviews).selectinload(Review.movie)
        ])

        if not user.reviews:
            return []
        
        last_watched_reviews = sorted(user.reviews, key=lambda review: review.watch_date, reverse=True)[:MAX_RESULTS]

        return [
            ReviewGetSingularDTO(
                id=review.id,
                user_id=review.user_id,
                movie_id=review.movie_id,
                rating=review.rating,
                text=review.text,
                watch_date=review.watch_date,
                likes=review.likes,
                name=user.name,
                user_name=user.username,
                created_at=review.created_at,
                updated_at=review.updated_at,
                movie=MovieGetResponse(
                    id=review.movie.id,
                    title=review.movie.title,
                    year=review.movie.year,
                    imdb_rating=review.movie.imdb_rating,
                    genres=review.movie.genres,
                    countries=review.movie.countries,
                    duration=review.movie.duration,
                    cast=review.movie.cast,
                    directors=review.movie.directors,
                    writers=review.movie.writers,
                    plot=review.movie.plot,
                    logo_url=review.movie.logo_url,
                    youtube_trailer_id=review.movie.youtube_trailer_id,
                    is_trailer_reliable=review.movie.is_trailer_reliable
                ) if review.movie else None
            ) for review in last_watched_reviews
        ]
    
    def _get_recent_reviews(self, db: Database) -> List[ReviewGetSingularDTO]:
        recent_reviews = db.find_all_by_multiple(
            model=Review,
            conditions=db.build_condition([Review.text != None]),
            order_by={"way": "desc", "column": "created_at"},
            limit=MAX_RESULTS,
            options=[selectinload(Review.user), selectinload(Review.movie)]
        )

        return [
            ReviewGetSingularDTO(
                id=review.id,
                user_id=review.user_id,
                movie_id=review.movie_id,
                rating=review.rating,
                text=review.text,
                watch_date=review.watch_date,
                likes=review.likes,
                name=review.user.name,
                user_name=review.user.username,
                created_at=review.created_at,
                updated_at=review.updated_at,
                movie=MovieGetResponse(
                    id=review.movie.id,
                    title=review.movie.title,
                    year=review.movie.year,
                    imdb_rating=review.movie.imdb_rating,
                    genres=review.movie.genres,
                    countries=review.movie.countries,
                    duration=review.movie.duration,
                    cast=review.movie.cast,
                    directors=review.movie.directors,
                    writers=review.movie.writers,
                    plot=review.movie.plot,
                    logo_url=review.movie.logo_url,
                    youtube_trailer_id=review.movie.youtube_trailer_id,
                    is_trailer_reliable=review.movie.is_trailer_reliable
                ) if review.movie else None
            ) for review in recent_reviews
        ]
    
    def _get_movies_count_by_genre(self, db: Database) -> dict[str, int]:
        movies = db.find_all_by_multiple(
            model=Movie,
            conditions=None
        )

        genre_count = {}
        for movie in movies:
            genres = [genre.strip() for genre in movie.genres.split(",")] if movie.genres else []
            for genre in genres:
                if genre in GENRES:
                    if genre in genre_count:
                        genre_count[genre] += 1
                    else:
                        genre_count[genre] = 1
        
        return genre_count

    def get_home_feed(self, db: Database, user_id: int) -> HomeFeed:
        featured_movie, top_rated_movies = self._get_top_rated_movies(db)
        
        return HomeFeed(
            featured_movie=featured_movie,
            trending_now_movies=self._get_trending_now_movies(db),
            top_rated_movies=top_rated_movies,
            last_watched_movies=self._get_last_watched_movies(db, user_id),
            recent_reviews=self._get_recent_reviews(db),
            movies_count_by_genre=self._get_movies_count_by_genre(db)
        )
        