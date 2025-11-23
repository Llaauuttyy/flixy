from pydantic import BaseModel
from datetime import datetime as datetime

class CommentCreationDTO(BaseModel):
    review_id: int
    text: str

class CommentGetDTO(BaseModel):
    id: int
    review_id: int
    text: str
    likes: int
    liked_by_user: bool = False
    created_at: datetime
    user_id: int
    is_deletable: bool
    user_name: str