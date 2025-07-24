from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.review_service import ReviewService
from app.dto.review import ReviewDTO, ReviewCreationDTO, ReviewGetResponse, ReviewGetSingularDTO
from fastapi import APIRouter, Depends, Path, HTTPException, Request
from fastapi_pagination import Page, paginate
from app.constants.message import REVIEWS_NOT_FOUND

review_router = APIRouter()

ReviewServiceDep = Annotated[ReviewService, Depends(lambda: ReviewService())]

@review_router.get("/review/{movie_id}")
def get_reviews(session: SessionDep, request: Request, review_service: ReviewServiceDep, movie_id: int = Path(..., title="movie id", ge=1)) -> ReviewGetResponse:
    user_id = request.state.user_id

    try:
        current_user_review, reviews = review_service.get_all_reviews(Database(session), user_id, movie_id)

        return ReviewGetResponse(
            user_review=ReviewGetSingularDTO(
                id=current_user_review.id,
                user_id=current_user_review.user_id,
                movie_id=current_user_review.movie_id,
                text=current_user_review.text,
                watch_date=current_user_review.watch_date,
                user_name=current_user_review.user.name
            ) if current_user_review else None,
            reviews=paginate(reviews)
        )
    except HTTPException as http_exc:
        raise HTTPException(status_code=http_exc.status_code, detail=http_exc.detail)

