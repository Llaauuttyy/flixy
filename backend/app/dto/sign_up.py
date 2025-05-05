from pydantic import BaseModel, EmailStr


class SignUpForm(BaseModel):
    name: str
    surname: str
    email: EmailStr
    password: str
