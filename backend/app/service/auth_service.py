from app.model.user import User
from app.db.database import Database
from app.dto.user import UserDTO
from app.dto.login import LoginResponse
from app.dto.auth import PasswordUpdateDTO
from app.constants.message import OLD_AND_NEW_PASSWORDS_ARE_DIFFERENT, OLD_PASSWORD_DOESNT_MATCH, PASSWORD_VALIDATION_ERROR, USER_NOT_FOUND
from fastapi import HTTPException

from app.security.security_service import SecurityService

from ..dto.register import RegisterDTO, RegisterForm


class AuthService:
    def __init__(self):
        self.security_service = SecurityService()

    def register_user(self, register_form: RegisterForm, db: Database) -> RegisterDTO:
        if not self.security_service.is_password_valid(register_form.password):
            raise HTTPException(
                status_code=400,
                detail=PASSWORD_VALIDATION_ERROR
            )
        
        hashed_password = self.security_service.get_password_hash(password=register_form.password)
        user = User(
            name=register_form.name,
            username=register_form.username,
            email=register_form.email,
            password=hashed_password
        )

        try:
            db.save(user)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
        return RegisterDTO(
            id=user.id,
            name=user.name,
            username=user.username,
            email=user.email
        )
    
    def login(self, login_dto: UserDTO, db: Database) -> LoginResponse:
        user = db.find_by(User, 'username', login_dto.username)
        if not user or not self.security_service.verify_password(login_dto.password, user.password):
            raise HTTPException(status_code=400, detail="Usuario o contraseña incorrectos.")
        
        return LoginResponse(
            access_token=self.security_service.create_access_token(data={"username": user.username, "id": user.id}),
            expiration_time=self.security_service.access_token_expiration_seconds
        )
    
    def update_password(self, password_update_dto: PasswordUpdateDTO, user_id: int, db: Database):
        user = db.find_by(User, "id", user_id)

        if user is None:
            raise Exception(USER_NOT_FOUND)
        
        if not self.security_service.verify_password(password_update_dto.old_password, user.password):
            raise Exception(OLD_PASSWORD_DOESNT_MATCH)
        
        if password_update_dto.old_password == password_update_dto.new_password:
            raise Exception(OLD_AND_NEW_PASSWORDS_ARE_DIFFERENT)
        
        if not self.security_service.is_password_valid(password_update_dto.new_password):
            raise Exception(PASSWORD_VALIDATION_ERROR)

        user.password = self.security_service.get_password_hash(password_update_dto.new_password)
        db.save(user)