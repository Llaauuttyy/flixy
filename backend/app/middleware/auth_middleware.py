from datetime import datetime, timezone
from app.security.token_data import TokenData
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import jwt
from app.security.security_service import ALGORITHM, SECRET_KEY

PUBLIC_ROUTES = ["/login", "/register", "/refresh_token", "/forgot-password", "/reset-password", "/confirm-registration", "/docs", "/openapi.json"]

def is_localhost(url: str) -> bool:
    return "localhost" in url or "127.0.0.1" in url

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Omitir rutas públicas
        if request and (request.url.path in PUBLIC_ROUTES or request.method == "OPTIONS"):
            return await call_next(request)
        
        if is_localhost(str(request.url)):
            # Si no tiene token, redirecciona la llamada
            if request.headers.get("Authorization") is None:
                return await call_next(request)
            
            # Si no, intenta obtener el token para asignar los datos del usuario
            try:
                tokenData = self.get_token_data(request.headers.get("Authorization").split(" ")[1])
                request.state.username = tokenData.username
                request.state.user_id = tokenData.id
                return await call_next(request)
            except (jwt.ExpiredSignatureError, ValueError):
                return Response("Token inválido o expirado", status_code=401)

        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return Response("Unauthorized", status_code=401)

        token = auth.split(" ")[1]

        try:
            tokenData = self.get_token_data(token)
        except (jwt.ExpiredSignatureError, ValueError):
            return Response("Token inválido o expirado", status_code=401)
        request.state.username = tokenData.username
        request.state.user_id = tokenData.id

        return await call_next(request)
    
    def get_token_data(self, token: str) -> TokenData:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        tokenData = TokenData(username=payload.get("username"), expiration=payload.get("expiration"), id=payload.get("id"))
        if tokenData.expiration is None or datetime.fromisoformat(tokenData.expiration) < datetime.now(timezone.utc):
            raise jwt.ExpiredSignatureError("Token expirado")
        return tokenData
