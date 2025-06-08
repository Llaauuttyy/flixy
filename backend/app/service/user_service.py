from app.model.user import User
from app.db.database import Database
from fastapi import HTTPException

from app.security.security_service import SecurityService

from ..dto.register import RegisterDTO, RegisterForm


class UserService:
    def __init__(self):
        self.security_service = SecurityService()

    async def register_user(self, register_form: RegisterForm, db: Database) -> RegisterDTO:
        if not self.security_service.is_password_valid(register_form.password):
            raise HTTPException(
                status_code=400,
                detail="La contraseña debe contener: mayuscula, minuscula, numero y caracter especial."
            )
        
        hashed_password = self.security_service.get_password_hash(password=register_form.password)
        user = User(
            name=register_form.name,
            username=register_form.username,
            email=register_form.email,
            password=hashed_password
        )

        try:
            db.add(user)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
        return RegisterDTO(
            id=user.id,
            name=user.name,
            username=user.username,
            email=user.email
        )
