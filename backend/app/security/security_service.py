from passlib.context import CryptContext
from string import punctuation

class SecurityService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
