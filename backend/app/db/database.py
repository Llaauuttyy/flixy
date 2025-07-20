from sqlmodel import select
from sqlalchemy import and_

class Database:
    def __init__(self, db_session):
        self.db_session = db_session

    def save(self, register):
        self.db_session.add(register)
        self.db_session.commit()
        self.db_session.refresh(register)

    def rollback(self):
        self.db_session.rollback()

    def find_all(self, model):
        return self.db_session.query(model).all()
    
    def find_by(self, model, field_name, value):
        statement = select(model).where(getattr(model, field_name) == value)
        return self.db_session.exec(statement).first()
    
    def exists_by(self, model, field_name, value):
        statement = select(model).where(getattr(model, field_name) == value)
        return self.db_session.exec(statement).first() is not None
    
    def find_by_multiple(self, model, **filters):
        conditions = [getattr(model, field) == value for field, value in filters.items()]
        statement = select(model).where(and_(*conditions))
        return self.db_session.exec(statement).first()