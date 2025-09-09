from typing import Optional
from app.dto.review import ReviewDTO
from pydantic import BaseModel

class Genre(BaseModel):
    name: str
    average_rating: float
    movies_watched: int

class InsightDTO(BaseModel):
    user_id: int
    genres: Optional[list[Genre]] = []
    total_reviews: Optional[int] = 0
    total_ratings: Optional[int] = 0
    total_movies_watched: Optional[int] = 0 # <= sum(Genre.movies_watched). Since a movie can have multiple genres
    total_time_watched: Optional[int] = 0 # minutes.
    total_likes: Optional[int] = 0
    most_liked_review: Optional[ReviewDTO] = None
    total_average_rating: Optional[float] = 0.0
    reviewed_movies_percentage: Optional[float] = 0.0 # Reviewed Movies (of Watched).