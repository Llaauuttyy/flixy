from fastapi import HTTPException
from app.model.review import Review
from app.db.database import Database
from app.dto.review import ReviewCreationDTO, ReviewGetSingularDTO, ReviewDTO
from sqlalchemy.exc import IntegrityError
from app.constants.message import FUTURE_TRAVELER, MOVIE_NOT_FOUND, REVIEWS_NOT_FOUND, INSULTING_REVIEW
from sqlalchemy.orm import selectinload
from sqlalchemy import and_
from typing import Tuple, List, Optional
from datetime import datetime as datetime
from app.external.moderation_assistant import Moderator

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
    
    def create_review(self, db: Database, review_dto: ReviewCreationDTO, user_id: int) -> ReviewDTO:
        try:
            if Moderator().is_review_insulting(review_dto.text):
                raise HTTPException(status_code=422, detail=INSULTING_REVIEW)
            
            if review_dto.watch_date.replace(tzinfo=None) > datetime.now():
                raise HTTPException(status_code=422, detail=FUTURE_TRAVELER)
            
            existing_review = db.find_by_multiple(Review, user_id=user_id, movie_id=review_dto.movie_id)
            if existing_review:
                existing_review.text = review_dto.text
                existing_review.watch_date = review_dto.watch_date
                db.save(existing_review)
                review = existing_review
            else:
                new_review = Review(
                    user_id=user_id,
                    movie_id=review_dto.movie_id,
                    text=review_dto.text,
                    watch_date=review_dto.watch_date,
                )
                db.save(new_review)
                review = new_review

            return ReviewDTO(
                id=review.id,
                user_id=review.user_id,
                movie_id=review.movie_id,
                text=review.text,
                watch_date=review.watch_date
            )

        except IntegrityError as e:
            db.rollback()

            if "foreign key constraint" in str(e).lower():
                raise HTTPException(status_code=404, detail=MOVIE_NOT_FOUND)
            else:
                raise HTTPException(status_code=400, detail=str(e))

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))