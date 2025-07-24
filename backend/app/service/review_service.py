from fastapi import HTTPException
from app.model.review import Review
from app.db.database import Database
from app.dto.review import ReviewGetSingularDTO
from sqlalchemy.exc import IntegrityError
from app.constants.message import REVIEWS_NOT_FOUND
from sqlalchemy.orm import selectinload
from sqlalchemy import and_
from typing import Tuple, List, Optional

class ReviewService:
    def set_up_review_singular_dto(self, review: Review) -> ReviewGetSingularDTO:
        return ReviewGetSingularDTO(
            id=review.id,
            user_id=review.user_id,
            movie_id=review.movie_id,
            text=review.text,
            watch_date=review.watch_date,
            user_name=review.user.name
        )

    def get_all_reviews(self, db: Database, user_id: int, movie_id: int) -> Tuple[Optional[ReviewGetSingularDTO], List[ReviewGetSingularDTO]]:
        current_user_review = db.find_by_multiple(Review, movie_id=movie_id, user_id=user_id)
        
        reviews = db.find_all(Review, and_(Review.movie_id == movie_id, Review.user_id != user_id), [selectinload(Review.user)])

        if not current_user_review and not reviews:
            raise HTTPException(status_code=404, detail=REVIEWS_NOT_FOUND)

        if current_user_review:
            current_user_review = self.set_up_review_singular_dto(current_user_review)

        if reviews:
            reviews_singular = list()
            for review in reviews:
                reviews_singular.append(
                    self.set_up_review_singular_dto(review)
                )

            reviews = reviews_singular

        return (current_user_review, reviews)