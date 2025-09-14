from sqlmodel import select, desc, asc
from sqlalchemy import and_, or_
from typing import Literal

class Database:
    def __init__(self, db_session):
        self.db_session = db_session

    def save(self, register):
        self.db_session.add(register)
        self.db_session.commit()
        self.db_session.refresh(register)

    def commit(self):
        self.db_session.commit()

    def add(self, register):
        self.db_session.add(register)
        self.db_session.flush()

    def delete(self, register):
        self.db_session.delete(register)
        self.db_session.commit()

    def remove(self, register):
        self.db_session.delete(register)

    def rollback(self):
        self.db_session.rollback()

    def find_all(self, model, condition=None, options=None):
        query_expression = select(model)
        if condition is not None:
            query_expression = query_expression.where(condition)

        if options:
            query_expression = query_expression.options(*options)

        return self.db_session.exec(query_expression).all()

    def find_by(self, model, field_name, value, options=None):
        statement = select(model).where(getattr(model, field_name) == value)

        if options:
            statement = statement.options(*options)

        return self.db_session.exec(statement).first()
    
    def exists_by(self, model, field_name, value):
        statement = select(model).where(getattr(model, field_name) == value)
        return self.db_session.exec(statement).first() is not None
    
    def exists_by_multiple(self, model, **filters):
        conditions = [getattr(model, field) == value for field, value in filters.items()]
        statement = select(model).where(and_(*conditions))
        return self.db_session.exec(statement).first() is not None
    
    def find_by_multiple(self, model, options=None, **filters):
        conditions = [getattr(model, field) == value for field, value in filters.items()]
        statement = select(model).where(and_(*conditions))

        if options:
            statement = statement.options(*options)
        
        return self.db_session.exec(statement).first()
    
    def find_all_by_multiple(self, model, conditions, options=None, order_by=None):
        statement = select(model).where(conditions)

        if options:
            statement = statement.options(*options)

        if order_by:
            if order_by["way"] == "desc":
                statement = statement.order_by(desc(getattr(model, order_by["column"])))
            else:
                statement = statement.order_by(getattr(model, order_by["column"]))

        return self.db_session.exec(statement)
    
    def left_join(
        self,
        left_model,
        right_model,
        join_condition,
        condition = None,
        order_by = None
    ):
        statement = (
            select(left_model, right_model)
            .join(right_model, join_condition, isouter=True)
        )

        if condition is not None:
            statement = statement.where(condition)

        if order_by:
            if order_by["way"] == "desc":
                statement = statement.order_by(desc(getattr(left_model, order_by["column"])))
            else:
                statement = statement.order_by(getattr(left_model, order_by["column"]))

        return self.db_session.exec(statement).all()
    
    def build_condition(self, criteria: list, combine_with: Literal["AND", "OR"] = "AND"):
        return and_(*criteria) if combine_with == "AND" else or_(*criteria)
