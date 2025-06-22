from pydantic import BaseModel

class TokenData(BaseModel):
    username: str = None
    expiration: str = None
    id: int = None