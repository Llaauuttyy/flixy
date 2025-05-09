from fastapi import Depends, FastAPI, HTTPException, Request
import logging
from typing import Annotated
from sqlalchemy.orm import Session

from .dto.register import RegisterDTO, RegisterForm
from .service.user_service import UserService
from .db import models
from .db.database import engine, SessionLocal

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def get_user_service(request: Request):
    return request.app.state.user_service


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


@app.get("/")
def read_root():
    return {"Health": "Ok!"}


@app.post("/register", response_model=RegisterDTO)
async def login(
        register_form: RegisterForm,
        db: db_dependency,
        user_service: UserService = Depends(get_user_service)):
    try:
        new_user = await user_service.register_user(register_form, db)
        logger.info(f"User registered successfully: {new_user.email}")
        return new_user
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(status_code=400, detail=str(e))
