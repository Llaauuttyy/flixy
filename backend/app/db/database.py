class Database:
    def __init__(self, db_session):
        self.db_session = db_session

    def add(self, register):
        self.db_session.add(register)
        self.db_session.commit()
        self.db_session.refresh(register)

    def rollback(self):
        self.db_session.rollback()