from app.dto.movie import MovieDTO
from fastapi import HTTPException
from app.db.database_setup import SessionDep
from app.service.recommendation_service import RecommendationService
from app.db.database import Database
from fastapi import APIRouter, Depends, Request
from typing import Annotated
from fastapi_pagination import paginate, Page

recommendation_router = APIRouter()

RecommendationServiceDep = Annotated[RecommendationService, Depends(lambda: RecommendationService())]

@recommendation_router.get("/recommendations")
def get_recommendations(session: SessionDep, request: Request, recommendation_service: RecommendationServiceDep) -> Page[MovieDTO]:
    user_id = request.state.user_id
    
    try:
        movies = recommendation_service.get_recommendations(Database(session), user_id)
        return paginate(movies)
    except Exception as e:
        raise HTTPException(status_code=409, detail=str(e))
    
# README: Solo una prueba para ver como responde el modelo 
@recommendation_router.get("/recommendations/ai")
def get_recommendations(session: SessionDep, request: Request, recommendation_service: RecommendationServiceDep) -> Page[MovieDTO]:
    user_id = request.state.user_id
    
    try:
        movies = recommendation_service.get_ai_recommendations(Database(session), user_id)
        return paginate(movies)
    except Exception as e:
        raise HTTPException(status_code=409, detail=str(e))