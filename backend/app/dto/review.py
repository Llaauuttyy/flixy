from typing import Optional
from app.dto.movie import MovieGetResponse
from app.dto.achievement import AchievementDTO
from pydantic import BaseModel, Field
from datetime import datetime as datetime
from fastapi_pagination import Page

class ReviewDTO(BaseModel):
    id: int
    user_id: int
    movie_id: int
    rating: Optional[int] = Field(None, ge=0, le=5)
    text: Optional[str] = None
    watch_date: datetime
    likes: int
    liked_by_user: bool = False
    created_at: datetime
    movie: Optional[MovieGetResponse] = None

class ReviewCreationDTO(BaseModel):
    movie_id: int
    rating: Optional[int] = Field(None, ge=0, le=5)
    text: Optional[str] = None
    watch_date: Optional[datetime] = None

class ReviewGetSingularDTO(ReviewDTO):
    user_name: str

class ReviewGetSingularAchievementsDTO(ReviewGetSingularDTO):
    achievements: list[AchievementDTO] = []

class ReviewGetResponse(BaseModel):
    user_review: Optional[ReviewGetSingularAchievementsDTO] = None
    reviews: Page[ReviewGetSingularAchievementsDTO]
