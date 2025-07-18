from pydantic import BaseModel

class LoginDTO(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    expiration_time: int
