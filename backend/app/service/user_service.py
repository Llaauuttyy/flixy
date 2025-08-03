from app.model.user import User
from app.db.database import Database
from app.dto.user import UserDTO, UserUpdateDTO
from app.constants.message import EXISTENT_USERNAME_ERROR, USER_NOT_FOUND
from app.model.rating import Rating
from app.dto.insight import InsightDTO, Genre
from sqlalchemy.orm import selectinload

class UserService:
    def get_all_users(self, db: Database) -> list[UserDTO]:
        users = db.find_all(User)
        return [UserDTO(id=user.id, name=user.name, username=user.username, email=user.email) for user in users]
    
    def get_user_by_id(self, db: Database, user_id: int) -> UserDTO:
        user = db.find_by(User, "id", user_id)
        return UserDTO(id=user.id, name=user.name, username=user.username, email=user.email)
    
    def update_user_data(self, user_dto: UserUpdateDTO, user_id: int, db: Database) -> UserDTO:
        user_to_update = db.find_by(User, "id", user_id)

        if user_to_update is None:
            raise Exception(USER_NOT_FOUND)
        
        for attr, value in user_dto.model_dump(exclude_unset=True).items():
            if attr == "username" and db.exists_by(User, attr, value):
                raise Exception(EXISTENT_USERNAME_ERROR)
            setattr(user_to_update, attr, value)

        db.save(user_to_update)
        
        return UserDTO(
            id=user_to_update.id,
            name=user_to_update.name,
            username=user_to_update.username,
            email=user_to_update.email
        )
    
    def get_user_insights(self, db: Database, user_id: int) -> InsightDTO:
        # TODO: Merge Ratings and Review tables. So it can be used for reviews, ratings and watched lists.
        # Cases:
            # rating, review
            # 5, null
            # null, "Great movie!"
        # Both cases count as watched movie.

        user = db.find_by(User, "id", user_id, options=[selectinload(User.reviews), selectinload(User.ratings).selectinload(Rating.movie)])

        movie_ids = []
        genres = dict()
        total_movies_watched = 0

        total_sum_ratings = 0.0
        total_average_rating = 0.0
        total_time_watched = 0

        for rating in user.ratings:
            print(f"Rating ID: {rating.id}, Score: {rating.user_rating}, Movie ID: {rating.movie.id}, Movie Title: {rating.movie.title}")

            for movie_genre in rating.movie.genres.lower().split(","):
                movie_genre = movie_genre.strip()
                if movie_genre not in genres.keys():
                    genres[movie_genre] = {
                        "sum_rating": rating.user_rating,
                        "movies_watched": 1
                    }
                else:
                    genres[movie_genre]["sum_rating"] += rating.user_rating
                    genres[movie_genre]["movies_watched"] += 1

                movie_ids.append(rating.movie.id)

            total_movies_watched += 1
            total_sum_ratings += rating.user_rating
            total_time_watched += rating.movie.duration
        
        if genres:
            for genre_name, genre_data in genres.items():
                avg = round(genre_data["sum_rating"] / genre_data["movies_watched"], 1)

                genres[genre_name] = Genre(
                    name=genre_name.capitalize(),
                    average_rating=avg,
                    movies_watched=genre_data["movies_watched"]
                )

            total_average_rating = round(total_sum_ratings / total_movies_watched, 1)
        
        for review in user.reviews:
            print(f"Review ID: {review.id}, Watch Date: {review.watch_date}")

            if review.movie_id not in movie_ids:
                total_movies_watched += 1
                # TODO: Add watch time when tables are merged.
                movie_ids.append(review.movie_id)

        return InsightDTO(
            user_id=user_id,
            genres=list(genres.values()),
            total_reviews=len(user.reviews),
            total_ratings=len(user.ratings),
            total_movies_watched=total_movies_watched,
            total_time_watched=total_time_watched,
            total_average_rating=total_average_rating,
            reviewed_movies_percentage=round((len(user.reviews) / total_movies_watched) * 100, 0) if total_movies_watched > 0 else 0.0
        )
    def search_users(self, db: Database, search_query: str, user_id: int):
        search_conditions = db.build_condition([User.name.ilike(f"%{search_query}%"),User.username.ilike(f"%{search_query}%")], "OR")
        conditions = db.build_condition([search_conditions, User.id != user_id])
        users = db.find_all_by_multiple(User, conditions)
        return [UserDTO(id=user.id, name=user.name, username=user.username, email=user.email) for user in users]
