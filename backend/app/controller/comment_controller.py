from typing import Annotated
from app.db.database import Database
from app.db.database_setup import SessionDep
from app.service.comment_service import CommentService
from app.dto.comment import CommentCreationDTO, CommentGetDTO
from fastapi import APIRouter, Path, Depends, HTTPException, Request

comment_router = APIRouter()

CommentServiceDep = Annotated[CommentService, Depends(lambda: CommentService())]

@comment_router.post("/comment")
def create_comment(session: SessionDep, request: Request, comment_dto: CommentCreationDTO, comment_service: CommentServiceDep) -> CommentGetDTO:
    user_id = request.state.user_id
    try:
        return comment_service.create_comment(Database(session), comment_dto, user_id)
    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))
    
@comment_router.post("/comment/{id}/like")
def create_comment(session: SessionDep, request: Request, comment_service: CommentServiceDep, id: int = Path(..., title="id", ge=1)) -> CommentGetDTO:
    user_id = request.state.user_id
    try:
        return comment_service.like_comment(Database(session), user_id, id)
    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))