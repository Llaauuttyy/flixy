from pydantic import BaseModel, EmailStr


class RegisterForm(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str


class RegisterDTO(BaseModel):
    id: int
    name: str
    username: str
    email: EmailStr
