from pydantic import BaseModel, EmailStr


class UserDTO(BaseModel):
    id: int
    name: str
    username: str
    email: EmailStr

class UserUpdateDTO(BaseModel):
    name: str = None
    username: str = None
    email: EmailStr = None