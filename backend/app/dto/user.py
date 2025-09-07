from pydantic import BaseModel, EmailStr


class UserDTO(BaseModel):
    id: int
    name: str
    username: str
    email: EmailStr
    followed_by_user: bool = False

class UserUpdateDTO(BaseModel):
    name: str = None
    username: str = None
    email: EmailStr = None