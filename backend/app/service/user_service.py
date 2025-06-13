from app.model.user import User
from app.db.database import Database
from app.dto.user import UserDTO
from app.dto.login import LoginResponse
from fastapi import HTTPException
import jwt

from app.security.security_service import SecurityService

from ..dto.register import RegisterDTO, RegisterForm


class UserService:
    def __init__(self):
        self.security_service = SecurityService()

    def register_user(self, register_form: RegisterForm, db: Database) -> RegisterDTO:
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
    
    def get_all_users(self, db: Database) -> list[RegisterDTO]:
        users = db.find_all(User)
        return [UserDTO(id=user.id, name=user.name, username=user.username, email=user.email) for user in users]
    
    def login(self, login_dto: UserDTO, db: Database) -> LoginResponse:
        user = db.find_by(User, 'username', login_dto.username)
        if not user or not self.security_service.verify_password(login_dto.password, user.password):
            raise HTTPException(status_code=400, detail="Usuario o contraseña incorrectos.")
        
        return LoginResponse(
            access_token=self.security_service.create_access_token(data={"username": user.username, "id": user.id}),
        )
