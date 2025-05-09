class UserRepository:
    def __init__(self, db):
        self.db = db

    async def create(self, user):
        query = """
            INSERT INTO users (name, username, email, hashed_password)
            VALUES (:name, :username, :email, :hashed_password)
            RETURNING id
        """
        values = {
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "hashed_password": user.hashed_password
        }
        result = await self.db.execute(query=query, values=values)
        return result

    async def get_by_email(self, email):
        query = """
            SELECT * FROM users WHERE email = :email
        """
        values = {"email": email}
        result = await self.db.fetch_one(query=query, values=values)
        return result
