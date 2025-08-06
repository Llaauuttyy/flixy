from typing import Optional
from pydantic import BaseModel, model_validator, Field
from datetime import datetime as datetime
from fastapi_pagination import Page

class ReviewDTO(BaseModel):
    id: int
    user_id: int
    movie_id: int
    rating: Optional[int] = Field(None, ge=0, le=5)
    text: Optional[str] = None
    watch_date: datetime
    updated_at: datetime

class ReviewCreationDTO(BaseModel):
    movie_id: int
    rating: Optional[int] = Field(None, ge=0, le=5)
    text: Optional[str] = None
    watch_date: Optional[datetime] = None

    @model_validator(mode='before')
    def at_least_score_or_text(cls, values):
        rating, text = values.get("rating"), values.get("text")
        if rating is None and (text is None or text.strip() == ""):
            raise ValueError("You must provide at least a rating or a text.")
        return values

class ReviewGetSingularDTO(ReviewDTO):
    user_name: str

class ReviewGetResponse(BaseModel):
    user_review: Optional[ReviewGetSingularDTO] = None
    reviews: Page[ReviewGetSingularDTO]
