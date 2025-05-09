from typing import Optional

from pydantic import BaseModel, EmailStr


class User(BaseModel):
    id: Optional[str] = None
    name: str
    username: str
    email: EmailStr
    hashed_password: str
