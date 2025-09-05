from pydantic import BaseModel

class LoginDTO(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    access_token_expiration_time: int
    refresh_token_expiration_time: int

class RefreshTokenDTO(BaseModel):
    refresh_token: str