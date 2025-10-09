from typing import Annotated, Optional
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.review_service import ReviewService
from app.dto.review import ReviewCreationDTO, ReviewGetSingularAchievementsDTO, ReviewGetSingularDTO, ReviewGetResponse
from fastapi import APIRouter, Depends, Path, HTTPException, Request, Query
from fastapi_pagination import Params, paginate, Page

review_router = APIRouter()

ReviewServiceDep = Annotated[ReviewService, Depends(lambda: ReviewService())]

@review_router.get("/review")
def get_reviews(session: SessionDep, request: Request, review_service: ReviewServiceDep, movie_id: Optional[int] = Query(None, ge=1, title="movie id"), params: Params = Depends()) -> ReviewGetResponse:
    user_id = request.state.user_id

    try:
        current_user_review, r_reviews = review_service.get_all_reviews(Database(session), user_id, movie_id)

        return ReviewGetResponse(
            user_review=current_user_review,
            reviews=paginate(r_reviews, params)
        )
    except HTTPException as http_exc:
        raise HTTPException(status_code=http_exc.status_code, detail=http_exc.detail)

@review_router.post("/review")
def create_review(session: SessionDep, request: Request, review_dto: ReviewCreationDTO, review_service: ReviewServiceDep) -> ReviewGetSingularDTO:
    user_id = request.state.user_id
    try:
        review = review_service.create_review(Database(session), review_dto, user_id)
        return review
    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))
    
@review_router.delete("/review/{id}")
def delete_review(session: SessionDep, request: Request, review_service: ReviewServiceDep, id: int = Path(..., title="id", ge=1)):
    user_id = request.state.user_id
    try:
        review_service.delete_review(Database(session), user_id, id)
    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))
    
@review_router.delete("/review/{id}/text")
def delete_review(session: SessionDep, request: Request, review_service: ReviewServiceDep, id: int = Path(..., title="id", ge=1)):
    user_id = request.state.user_id
    try:
        review_service.delete_review_text(Database(session), user_id, id)
    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))
    
@review_router.post("/review/{id}/like")
def like_review(session: SessionDep, request: Request, review_service: ReviewServiceDep, id: int = Path(..., title="id", ge=1)) -> ReviewGetSingularAchievementsDTO:
    user_id = request.state.user_id
    try:
        return review_service.like_review(Database(session), user_id, id)
    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))

@review_router.get("/review/latest")
def latest_reviews(session: SessionDep, request: Request, review_service: ReviewServiceDep, following: Optional[bool] = Query(False), params: Params = Depends()) -> Page[ReviewGetSingularAchievementsDTO]:
    user_id = request.state.user_id
    try:
        reviews = review_service.latest_reviews(Database(session), user_id, following)
        return paginate(reviews, params)
    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))