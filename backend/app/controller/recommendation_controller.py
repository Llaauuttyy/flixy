from app.dto.movie import MovieDTO
from fastapi import HTTPException
from app.service.recommendation_service import RecommendationService
from fastapi import APIRouter, Depends, Request
from typing import Annotated
from fastapi_pagination import paginate, Page

recommendation_router = APIRouter()
recommendation_service = RecommendationService()

RecommendationServiceDep = Annotated[RecommendationService, Depends(lambda: recommendation_service)]

@recommendation_router.get("/recommendations")
def get_recommendations(request: Request, recommendation_service: RecommendationServiceDep) -> Page[MovieDTO]:
    user_id = request.state.user_id
    
    try:
        movies = recommendation_service.get_recommendations(user_id)
        return paginate(movies)
    except Exception as e:
        raise HTTPException(status_code=409, detail=str(e))