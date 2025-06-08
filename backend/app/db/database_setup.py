from sqlmodel import create_engine
from os import getenv

USER = "root"
PASSWORD = getenv("MYSQL_ROOT_PASSWORD")
HOST = getenv("DB_HOST")
PORT = int(getenv("INT_DB_PORT", 0))
db_url = f"mysql+mysqlconnector://{USER}:{PASSWORD}@{HOST}:{PORT}/flixy"

engine = create_engine(db_url)