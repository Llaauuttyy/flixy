from passlib.context import CryptContext


class SecurityService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def get_password_hash(self, password: str) -> str:
        """
        Genera un hash de la contraseña proporcionada.
        """
        return self.pwd_context.hash(password)
