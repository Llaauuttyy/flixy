import secrets

from app.model.user import User
from app.db.database import Database
from app.dto.user import UserDTO
from app.dto.login import LoginResponse, RefreshTokenDTO
from app.dto.auth import ConfirmAccountDTO, PasswordUpdateDTO, ForgotPasswordDTO, ResetPasswordDTO
from app.constants.message import CONFIRMATION_REQUIRED_ERROR, EMAIL_NOT_SEND, LOGIN_CREDENTIALS_ERROR, NON_EXISTENT_TOKEN, OLD_AND_NEW_PASSWORDS_ARE_THE_SAME_ERROR, OLD_PASSWORD_DOESNT_MATCH_ERROR, PASSWORD_VALIDATION_ERROR, TAKEN_EMAIL, TAKEN_USERNAME, TOKEN_HAS_EXPIRED, USER_NOT_FOUND, USER_NOT_FOUND_BY_EMAIL
from fastapi import HTTPException

from app.security.security_service import SecurityService
from os import getenv
from ..dto.register import RegisterDTO, RegisterForm
from ..email_sender.sender import EmailSender
from datetime import datetime, timedelta, timezone
from sqlalchemy.exc import IntegrityError


class AuthService:
    def __init__(self):
        self.security_service = SecurityService()

    def register_user(self, register_form: RegisterForm, db: Database, is_local=False) -> RegisterDTO:
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

            if user is None:
                raise Exception(USER_NOT_FOUND_BY_EMAIL)
        
            if not is_local:
                print("Entra en NOT LOCAL: is_local =", is_local)
                token, _ = self.generate_urlsafe_token()

                confirm_link = f"{getenv('FRONT_URL_CLIENT')}/confirm-registration?token={token}"

                success = EmailSender().send_confirm_registration_email(user.email, confirm_link)

                if not success:
                    raise Exception(EMAIL_NOT_SEND)
                
                user.confirmation_token = token
                user.is_confirmed = 0
            else:
                print("Entra en LOCAL: is_local =", is_local)
                user.is_confirmed = 1
            
            db.save(user)
        except IntegrityError as e:
            db.rollback()
            error_message = str(e)

            if "for key 'users.username'" in error_message:
                raise HTTPException(status_code=400, detail=TAKEN_USERNAME)
            elif "for key 'users.email_UNIQUE'" in error_message:
                raise HTTPException(status_code=400, detail=TAKEN_EMAIL)
            
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            db.rollback()
            print(f"Error registering user: {e}")
            raise HTTPException(status_code=400, detail=str(e))
        
        return RegisterDTO(
            id=user.id,
            name=user.name,
            username=user.username,
            email=user.email
        )
    
    def confirm_registration(self, confirm_account_dto: ConfirmAccountDTO, db: Database):
        user = db.find_by(User, "confirmation_token", confirm_account_dto.token)

        if user is None:
            raise Exception(NON_EXISTENT_TOKEN)
        
        user.confirmation_token = None
        user.is_confirmed = 1

        db.save(user)
    
    def login(self, login_dto: UserDTO, db: Database) -> LoginResponse:
        user = db.find_by(User, 'username', login_dto.username)

        if not user or not self.security_service.verify_password(login_dto.password, user.password):
            raise HTTPException(status_code=400, detail=LOGIN_CREDENTIALS_ERROR)
        
        if not user or not user.is_confirmed:
            raise HTTPException(status_code=400, detail=CONFIRMATION_REQUIRED_ERROR)
        
        access_token, refresh_token = self.security_service.create_tokens(data={"username": user.username, "id": user.id})
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            access_token_expiration_time=self.security_service.access_token_expiration_seconds,
            refresh_token_expiration_time=self.security_service.refresh_token_expiration_seconds
        )
    
    def refresh_token(self, refresh_token_dto: RefreshTokenDTO, db: Database) -> LoginResponse:
        user_id = self.security_service.get_id_from_token(refresh_token_dto.refresh_token)
        user = db.find_by(User, 'id', user_id)
        if not user:
            raise HTTPException(status_code=400, detail=USER_NOT_FOUND)

        access_token, refresh_token = self.security_service.create_tokens(data={"username": user.username, "id": user.id})
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            access_token_expiration_time=self.security_service.access_token_expiration_seconds,
            refresh_token_expiration_time=self.security_service.refresh_token_expiration_seconds
        )
    
    def update_password(self, password_update_dto: PasswordUpdateDTO, user_id: int, db: Database):
        user = db.find_by(User, "id", user_id)

        if user is None:
            raise Exception(USER_NOT_FOUND)
        
        if not self.security_service.verify_password(password_update_dto.old_password, user.password):
            raise Exception(OLD_PASSWORD_DOESNT_MATCH_ERROR)
        
        if password_update_dto.old_password == password_update_dto.new_password:
            raise Exception(OLD_AND_NEW_PASSWORDS_ARE_THE_SAME_ERROR)
        
        if not self.security_service.is_password_valid(password_update_dto.new_password):
            raise Exception(PASSWORD_VALIDATION_ERROR)

        user.password = self.security_service.get_password_hash(password_update_dto.new_password)
        db.save(user)

    def generate_urlsafe_token(length=16):
        token = secrets.token_urlsafe(16)
        expires_at = datetime.now(timezone.utc) + timedelta(hours=1)

        return token, expires_at
    
    def forgot_password(self, forgot_password_dto: ForgotPasswordDTO, db: Database):
        user = db.find_by(User, "email", forgot_password_dto.email)

        if user is None:
            raise Exception(USER_NOT_FOUND_BY_EMAIL)
        
        token, expires_at = self.generate_urlsafe_token()

        reset_link = f"{getenv('FRONT_URL_CLIENT')}/reset-password?token={token}"

        success = EmailSender().send_forgot_password_email(user.email, reset_link)

        if not success:
            raise Exception(EMAIL_NOT_SEND)
        
        user.reset_token = token
        user.reset_token_expires_at = expires_at
        
        db.save(user)

    def is_token_valid(self, expires_at: datetime) -> bool:
        if datetime.now(timezone.utc) > expires_at.replace(tzinfo=timezone.utc):
            return False
        
        return True
    
    def reset_password(self, reset_password_dto: ResetPasswordDTO, db: Database):
        user = db.find_by(User, "reset_token", reset_password_dto.token)

        if user is None:
            raise Exception(NON_EXISTENT_TOKEN)
        
        if not self.is_token_valid(user.reset_token_expires_at):
            raise Exception(TOKEN_HAS_EXPIRED)
        
        if self.security_service.verify_password(reset_password_dto.new_password, user.password):
            raise Exception(OLD_AND_NEW_PASSWORDS_ARE_THE_SAME_ERROR)
        
        if not self.security_service.is_password_valid(reset_password_dto.new_password):
            raise Exception(PASSWORD_VALIDATION_ERROR)

        user.password = self.security_service.get_password_hash(reset_password_dto.new_password)
        user.reset_token = None
        user.reset_token_expires_at = None

        db.save(user)