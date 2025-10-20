from datetime import datetime as datetime
from pydantic import BaseModel, EmailStr
from fastapi_pagination import Page


class UserDTO(BaseModel):
    id: int
    name: str
    username: str
    email: EmailStr
    about_me: str = ""
    created_at: datetime
    followers: int = 0
    following: int = 0
    followed_by_user: bool = False

class UserUpdateDTO(BaseModel):
    name: str = None
    username: str = None
    email: EmailStr = None
    about_me: str = None