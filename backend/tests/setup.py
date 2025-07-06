from app.main import app
from app.db.database_setup import get_session
from sqlmodel import SQLModel, Session, create_engine
from fastapi.testclient import TestClient

# Crear motor para test
test_engine = create_engine(
    "mysql+mysqlconnector://root:root@test-db:3306/flixy_test"
)

# Crear las tablas (una sola vez por test suite, o antes de cada test si quieres limpio)
SQLModel.metadata.create_all(test_engine)

# Sobrescribir la sesión de producción
def get_test_session():
    with Session(test_engine) as session:
        yield session

app.dependency_overrides[get_session] = get_test_session

client = TestClient(app)