from app.dto.comment import CommentCreationDTO, CommentGetDTO
from app.model.comment_like import CommentLike
from fastapi import HTTPException
from app.model.review import Review
from app.model.comment import Comment
from app.db.database import Database
from sqlalchemy.exc import IntegrityError
from app.constants.message import INSULTING_COMMENT, REVIEW_NOT_FOUND, COMMENT_NOT_FOUND
from datetime import datetime as datetime
from app.external.moderation_assistant import Moderator

class CommentService:
    def create_comment(self, db: Database, comment_dto: CommentCreationDTO, user_id: int) -> CommentGetDTO:
        try:
            if not db.exists_by(Review, "id", comment_dto.review_id):
                raise Exception(REVIEW_NOT_FOUND)

            if Moderator().is_text_insulting(comment_dto.text):
                raise Exception(INSULTING_COMMENT)
            
            new_comment = Comment(
                review_id=comment_dto.review_id,
                text=comment_dto.text,
                user_id=user_id,
                created_at=datetime.utcnow()
            )
            
            db.add(new_comment)
            db.commit()
            
            return CommentGetDTO(
                id=new_comment.id,
                review_id=new_comment.review_id,
                text=new_comment.text,
                likes=new_comment.likes,
                user_id=new_comment.user_id,
                is_deletable=(new_comment.user_id == user_id),
                user_name=new_comment.user.name,
                created_at=new_comment.created_at
            )

        except IntegrityError as e:
            db.rollback()

            if "foreign key constraint" in str(e).lower():
                raise HTTPException(status_code=404, detail=REVIEW_NOT_FOUND)
            else:
                raise HTTPException(status_code=400, detail=str(e))

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    def like_comment(self, db: Database, user_id: int, id: int) -> CommentGetDTO:
        try:
            comment_to_like = db.find_by(Comment, "id", id)
            user_like = db.find_by_multiple(CommentLike, comment_id=id, user_id=user_id)

            if not comment_to_like:
                raise HTTPException(status_code=404, detail=COMMENT_NOT_FOUND)
            
            liked_by_user = user_like is not None
            if liked_by_user:
                db.delete(user_like)
                comment_to_like.likes -= 1
            else:
                user_like = CommentLike(user_id=user_id, comment_id=id)
                db.save(user_like)
                comment_to_like.likes += 1

            db.save(comment_to_like)
            return CommentGetDTO(
                id=comment_to_like.id,
                review_id=comment_to_like.review_id,
                text=comment_to_like.text,
                likes=comment_to_like.likes,
                user_id=comment_to_like.user_id,
                is_deletable=(comment_to_like.user_id == user_id),
                user_name=getattr(comment_to_like.user, "name", None) if comment_to_like.user else None,
                created_at=comment_to_like.created_at,
                liked_by_user=liked_by_user == False
            )

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    def get_comment(self, db: Database, review_id: int, user_id: int) -> list[CommentGetDTO]:
        try:
            comments = db.find_all(Comment, db.build_condition([Comment.review_id == review_id]))

            return [CommentGetDTO(
                id=comment.id,
                review_id=comment.review_id,
                text=comment.text,
                likes=comment.likes,
                user_id=comment.user_id,
                is_deletable=(comment.user_id == user_id),
                user_name=getattr(comment.user, "name", None) if comment.user else None,
                liked_by_user=any(cl.user_id == user_id for cl in comment.comment_likes),
                created_at=comment.created_at
            ) for comment in comments]

        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    def delete_comment(self, db: Database, user_id: int, id: int):
        try:
            comment_to_delete = db.find_by_multiple(Comment, id=id, user_id=user_id)

            if not comment_to_delete:
                raise HTTPException(status_code=404, detail=COMMENT_NOT_FOUND)

            db.delete(comment_to_delete)

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))