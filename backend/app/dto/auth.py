from pydantic import BaseModel

class PasswordUpdateDTO(BaseModel):
    old_password: str
    new_password: str