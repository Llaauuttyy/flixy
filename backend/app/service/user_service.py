from fastapi import HTTPException

from ..security.security_service import SecurityService

from ..dto.register import RegisterDTO, RegisterForm
from ..repository.user_repository import UserRepository
from ..model.user import User
from ..db.models import UserDB


class UserService:
    def __init__(
            self, user_repository: UserRepository,
            security_service: SecurityService):
        self.user_repository = user_repository
        self.security_service = security_service

    async def register_user(self, user_dto: RegisterForm, db) -> RegisterDTO:
        existing_user = await self.user_repository.get_by_email(user_dto.email)
        if existing_user:
            raise HTTPException(
                status_code=400, detail="Email already registered")

        hashed_password = self.security_service.get_password_hash(
            password=user_dto.password)

        user = UserDB(
            name=user_dto.name,
            username=user_dto.username,
            email=user_dto.email,
            hashed_password=hashed_password
        )
        db.add(user)
        db.commit()

        return RegisterDTO(
            id=int(user.id),
            name=user.name,
            username=user.username,
            email=user.email
        )
