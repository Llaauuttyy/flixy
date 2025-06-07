from pydantic import BaseModel, EmailStr


class UserDTO(BaseModel):
    id: int
    name: str
    username: str
    email: EmailStr