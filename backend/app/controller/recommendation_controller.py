from fastapi import HTTPException
from app.db.database_setup import SessionDep
from app.service.recommendation_service import RecommendationService
from app.db.database import Database
from backend.app.dto.recommendation import Recommendations
from fastapi import APIRouter, Depends, Request
from typing import Annotated

recommendation_router = APIRouter()

RecommendationServiceDep = Annotated[RecommendationService, Depends(lambda: RecommendationService())]

@recommendation_router.get("/recommendations")
def get_recommendations(session: SessionDep, request: Request, recommendation_service: RecommendationServiceDep) -> Recommendations:
    user_id = request.state.user_id
    
    try:
        movies = recommendation_service.get_recommendations(Database(session), user_id)
        return movies
    except Exception as e:
        raise HTTPException(status_code=409, detail=str(e))