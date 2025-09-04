from typing import Optional
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
    updated_at: datetime

class ReviewCreationDTO(BaseModel):
    movie_id: int
    rating: Optional[int] = Field(None, ge=0, le=5)
    text: Optional[str] = None
    watch_date: Optional[datetime] = None

class ReviewGetSingularDTO(ReviewDTO):
    user_name: str

class ReviewGetResponse(BaseModel):
    user_review: Optional[ReviewGetSingularDTO] = None
    reviews: Page[ReviewGetSingularDTO]
