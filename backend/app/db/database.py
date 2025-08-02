from sqlmodel import select
from sqlalchemy import and_, or_

class Database:
    def __init__(self, db_session):
        self.db_session = db_session

    def save(self, register):
        self.db_session.add(register)
        self.db_session.commit()
        self.db_session.refresh(register)

    def delete(self, register):
        self.db_session.delete(register)
        self.db_session.commit()

    def rollback(self):
        self.db_session.rollback()

    def find_all(self, model, condition=None, options=None):
        query_expression = select(model)
        if condition is not None:
            query_expression = query_expression.where(condition)

        if options:
            query_expression = query_expression.options(*options)

        return self.db_session.exec(query_expression).all()

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
    
    def find_all_by_multiple(self, model, **filters):
        conditions = [getattr(model, field) == value for field, value in filters.items()]
        statement = select(model).where(and_(*conditions))
        return self.db_session.exec(statement)
    
    def left_join(
        self,
        left_model,
        right_model,
        join_condition,
        and_filters: list = None,
        or_filters: list = None
    ):
        statement = (
            select(left_model, right_model)
            .join(right_model, join_condition, isouter=True)
        )

        if and_filters:
            statement = statement.where(and_(*and_filters))
        if or_filters:
            statement = statement.where(or_(*or_filters))

        return self.db_session.exec(statement).all()
