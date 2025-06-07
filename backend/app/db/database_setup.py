from sqlmodel import create_engine

USER = "root"
PASSWORD = "root"
HOST = "db"
PORT = 3306
db_url = f"mysql+mysqlconnector://{USER}:{PASSWORD}@{HOST}:{PORT}/flixy"

engine = create_engine(db_url)