from passlib.context import CryptContext
from string import punctuation
from datetime import datetime, timedelta, timezone
import jwt

ALGORITHM = "HS256"
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

class SecurityService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.access_token_expiration_seconds = 3600
        self.refresh_token_expiration_seconds = 21600

    def is_password_valid(self, password: str) -> bool:
        """
        Verifica si la contraseña proporcionada es válida.
        """
        has_uppercase = any(c.isupper() for c in password)
        has_lowercase = any(c.islower() for c in password)
        has_number = any(c.isdigit() for c in password)
        has_special_char = any(c in punctuation for c in password)

        return all([has_uppercase, has_lowercase, has_number, has_special_char])

    def get_password_hash(self, password: str) -> str:
        """
        Genera un hash de la contraseña proporcionada.
        """
        return self.pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verifica si la contraseña proporcionada coincide con el hash almacenado.
        """
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def create_tokens(self, data: dict):
        access_token = encode_token(data, self.access_token_expiration_seconds)
        refresh_token = encode_token(data, self.refresh_token_expiration_seconds)
        return access_token, refresh_token
    
    def get_id_from_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload.get("id")
        except jwt.PyJWTError:
            return None

def encode_token(data: dict, expiration: int):
    to_encode = data.copy()
    datetime.now(timezone.utc)
    expiration = datetime.now(timezone.utc) + timedelta(seconds=expiration)
    to_encode.update({"expiration": expiration.isoformat()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)