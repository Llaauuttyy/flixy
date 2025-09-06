from app.model.user import User
from app.model.review_like import ReviewLike
from fastapi import HTTPException
from app.model.review import Review
from app.db.database import Database
from app.dto.review import ReviewCreationDTO, ReviewGetSingularDTO
from sqlalchemy.exc import IntegrityError
from app.constants.message import FUTURE_TRAVELER, MOVIE_NOT_FOUND, REVIEW_NOT_FOUND, INSULTING_REVIEW, UNDELETABLE_REVIEW_ERROR
from sqlalchemy.orm import selectinload
from typing import Tuple, List, Optional
from datetime import datetime as datetime
from app.external.moderation_assistant import Moderator

class ReviewService:
    def set_up_review_singular_dto(self, review: Review, user_id: int, db: Database) -> ReviewGetSingularDTO:
        liked_by_user = db.exists_by_multiple(ReviewLike, review_id=review.id, user_id=user_id)
        return ReviewGetSingularDTO(
            id=review.id,
            user_id=review.user_id,
            movie_id=review.movie_id,
            rating=review.rating,
            text=review.text,
            watch_date=review.watch_date,
            likes=review.likes,
            created_at=review.created_at,
            liked_by_user=liked_by_user,
            user_name=review.user.name
        )

    def get_all_reviews(self, db: Database, user_id: int, movie_id: int) -> Tuple[Optional[ReviewGetSingularDTO], List[ReviewGetSingularDTO]]:
        current_user_review = db.find_by_multiple(Review, movie_id=movie_id, user_id=user_id)
        
        reviews = db.find_all(
            Review,
            db.build_condition([Review.movie_id == movie_id, Review.user_id != user_id]),
            [selectinload(Review.user)]
        )

        if not current_user_review and not reviews:
            return (None, [])

        if current_user_review:
            current_user_review = self.set_up_review_singular_dto(current_user_review, user_id, db)

        if reviews:
            reviews_singular = list()
            for review in reviews:
                reviews_singular.append(
                    self.set_up_review_singular_dto(review, user_id, db)
                )

            reviews = reviews_singular

        return (current_user_review, reviews)
    
    def create_review(self, db: Database, review_dto: ReviewCreationDTO, user_id: int) -> ReviewGetSingularDTO:
        try:
            if review_dto.watch_date and review_dto.watch_date.replace(tzinfo=None) > datetime.now():
                raise Exception(FUTURE_TRAVELER)
            
            if review_dto.text and Moderator().is_review_insulting(review_dto.text):
                raise Exception(INSULTING_REVIEW)
            
            existing_review = db.find_by_multiple(Review, user_id=user_id, movie_id=review_dto.movie_id)
            if existing_review:
                if review_dto.text:
                    existing_review.text = review_dto.text
                if review_dto.rating:
                    existing_review.rating = review_dto.rating
                if review_dto.watch_date:
                    existing_review.watch_date = review_dto.watch_date

                db.save(existing_review)
                review = existing_review
            else:
                curent_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                new_review = Review(
                    user_id=user_id,
                    movie_id=review_dto.movie_id,
                    rating=review_dto.rating if review_dto.rating else None,
                    text=review_dto.text,
                    watch_date=review_dto.watch_date if review_dto.watch_date else curent_date,
                )
                db.save(new_review)
                review = new_review

            user = db.find_by(User, "id", review.user_id)

            return ReviewGetSingularDTO(
                id=review.id,
                user_id=review.user_id,
                movie_id=review.movie_id,
                rating=review.rating,
                text=review.text,
                watch_date=review.watch_date,
                likes=review.likes,
                created_at=review.created_at,
                user_name = user.name
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

    def delete_review_text(self, db: Database, user_id: int, id: int):
        try:
            review_to_delete = db.find_by_multiple(Review, id=id, user_id=user_id)

            if not review_to_delete:
                raise HTTPException(status_code=404, detail=REVIEW_NOT_FOUND)

            review_to_delete.text = None
            db.save(review_to_delete)
        except IntegrityError as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    def delete_review(self, db: Database, user_id: int, id: int):
        try:
            review_to_delete = db.find_by_multiple(Review, id=id, user_id=user_id)

            if not review_to_delete:
                raise HTTPException(status_code=404, detail=REVIEW_NOT_FOUND)
            
            if review_to_delete.text or review_to_delete.rating:
                raise HTTPException(status_code=409, detail=UNDELETABLE_REVIEW_ERROR)

            db.delete(review_to_delete)
        except IntegrityError as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    def like_review(self, db: Database, user_id: int, id: int) -> ReviewGetSingularDTO:
        try:
            review_to_like = db.find_by(Review, "id", id)
            user_like = db.find_by_multiple(ReviewLike, review_id=id, user_id=user_id)

            if not review_to_like:
                raise HTTPException(status_code=404, detail=REVIEW_NOT_FOUND)
            
            if not user_like:
                user_like = ReviewLike(user_id=user_id, review_id=id)
                db.save(user_like)
                review_to_like.likes += 1
            else:
                db.delete(user_like)
                review_to_like.likes -= 1

            db.save(review_to_like)
            return self.set_up_review_singular_dto(review_to_like, user_id, db)
        except IntegrityError as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))