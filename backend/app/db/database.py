from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# from os import getenv

# URL_DATABASE = f"jdbc:mysql://{getenv('DB_USER')}:{getenv('DB_PWD')}@{getenv('DB_URL')}/flixy"
# URL_DATABASE = "mysql+pymysql://root:root@localhost:6666/flixy"
URL_DATABASE = "mysql+mysqlconnector://root:root@localhost:6666/flixy"

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
