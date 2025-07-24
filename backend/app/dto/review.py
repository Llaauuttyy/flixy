from typing import Optional
from pydantic import BaseModel
from datetime import datetime as datetime
from fastapi_pagination import Page, paginate

class ReviewDTO(BaseModel):
    id: int
    user_id: int
    movie_id: int
    text: str
    watch_date: datetime

class ReviewCreationDTO(BaseModel):
    id: int
    text: str
    watch_date: datetime

class ReviewGetSingularDTO(ReviewDTO):
    user_name: str

class ReviewGetResponse(BaseModel):
    user_review: Optional[ReviewGetSingularDTO] = None
    reviews: Page[ReviewGetSingularDTO]
