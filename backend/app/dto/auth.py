from pydantic import BaseModel, EmailStr

class PasswordUpdateDTO(BaseModel):
    old_password: str
    new_password: str

class ForgotPasswordDTO(BaseModel):
    email: EmailStr

class ResetPasswordDTO(BaseModel):
    token: str
    new_password: str