from fastapi import HTTPException
from app.model.review import Review
from app.db.database import Database
from app.dto.review import ReviewGetSingularDTO, ReviewGetResponse
from sqlalchemy.exc import IntegrityError
from app.constants.message import MOVIE_NOT_FOUND
from sqlalchemy.orm import selectinload
from sqlalchemy import and_
from typing import Tuple, List, Optional

class ReviewService:
    def get_all_reviews(self, db: Database, user_id: int, movie_id: int) -> Tuple[Optional[ReviewGetSingularDTO], List[ReviewGetSingularDTO]]:
        current_user_review = db.find_by_multiple(Review, movie_id=movie_id, user_id=user_id)
        
        reviews = db.find_all(Review, and_(Review.movie_id == movie_id, Review.user_id != user_id), [selectinload(Review.user)])

        if not current_user_review and not reviews:
            raise HTTPException(status_code=404, detail=MOVIE_NOT_FOUND)

        return (current_user_review, reviews)