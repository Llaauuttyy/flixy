from typing import Optional
from app.dto.movie import MovieGetResponse
from app.dto.review import ReviewGetSingularDTO
from app.dto.watchlist import WatchListsGetResponse
from pydantic import BaseModel
from datetime import datetime as datetime


class HomeFeed(BaseModel):
    featured_movie: Optional[MovieGetResponse] = None
    trending_now_movies: Optional[list[MovieGetResponse]] = []
    top_rated_movies: Optional[list[MovieGetResponse]] = []
    last_watched_movies: Optional[list[ReviewGetSingularDTO]] = []
    recent_reviews: Optional[list[ReviewGetSingularDTO]] = []
    movies_count_by_genre: Optional[dict[str, int]] = {}
    popular_watchlists: Optional[WatchListsGetResponse] = []
