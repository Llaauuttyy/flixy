from app.model.user import User
from app.db.database import Database
from app.dto.user import UserDTO, UserUpdateDTO
from app.constants.message import USER_NOT_FOUND


class UserService:
    def get_all_users(self, db: Database) -> list[UserDTO]:
        users = db.find_all(User)
        return [UserDTO(id=user.id, name=user.name, username=user.username, email=user.email) for user in users]
    
    def update_user_data(self, user_dto: UserUpdateDTO, user_id: int, db: Database) -> UserDTO:
        user_to_update = db.find_by(User, "id", user_id)

        if user_to_update is None:
            raise Exception(USER_NOT_FOUND)
        
        for attr, value in user_dto.model_dump(exclude_unset=True).items():
            if attr == "username" and db.exists_by(User, attr, value):
                raise Exception("Ya existe otro usuario con ese nombre de usuario.")
            setattr(user_to_update, attr, value)

        db.save(user_to_update)
        
        return UserDTO(
            id=user_to_update.id,
            name=user_to_update.name,
            username=user_to_update.username,
            email=user_to_update.email
        )
