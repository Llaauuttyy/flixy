from typing import Optional
from app.model.user import User
from app.model.achievement import Achievement
from app.db.database import Database
from app.dto.user import UserDTO, UserUpdateDTO
from app.constants.message import EXISTENT_USERNAME_ERROR, USER_NOT_FOUND
from app.dto.insight import InsightDTO, Genre
from app.model.review import Review
from app.model.user_relationship import UserRelationship
from app.dto.review import ReviewDTO
from app.dto.movie import MovieGetResponse
from app.model.user_achievement import UserAchievement
from app.model.achievement import Achievement
from app.dto.achievement import AchievementsDTO, AchievementDTO
from sqlalchemy.orm import selectinload
import json

class UserService:
    def get_all_users(self, db: Database) -> list[UserDTO]:
        users = db.find_all(User)
        return [UserDTO(id=user.id, name=user.name, username=user.username, email=user.email) for user in users]
    
    def get_user_by_id(self, db: Database, user_id: int) -> UserDTO:
        user = db.find_by(User, "id", user_id)
        return UserDTO(
            id=user.id,
            name=user.name,
            username=user.username,
            email=user.email
        )
    
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
        user = db.find_by(User, "id", user_id, options=[selectinload(User.reviews).selectinload(Review.movie)])

        genres, totals = calculate_user_stats(user)
        genres = process_genres(genres)

        all_reviews = list(db.find_all_by_multiple(Review, db.build_condition([Review.user_id == user_id], [selectinload(Review.movie)])))

        # Pasar los minutos a horas para hacer el calculo del achievement.
        insight_dto = build_insight_dto_pre_achievements(user_id, genres, totals, all_reviews)
        return build_insight_dto(db, insight_dto)

    def search_users(self, db: Database, search_query: str, user_id: int):
        search_conditions = db.build_condition([User.name.ilike(f"%{search_query}%"),User.username.ilike(f"%{search_query}%")], "OR")
        conditions = db.build_condition([search_conditions, User.id != user_id])
        users = db.find_all_by_multiple(User, conditions)
        return [UserDTO(
                id=user.id,
                name=user.name,
                username=user.username,
                email=user.email,
                followed_by_user=db.exists_by_multiple(UserRelationship, follower_id=user_id, followed_id=user.id)
            ) for user in users]
    
    def follow_user(self, follower_id: int, followed_id: int, db: Database):
        relation = db.find_by_multiple(UserRelationship, follower_id=follower_id, followed_id=followed_id)
        followed = db.find_by(User, "id", followed_id)
        follower = db.find_by(User, "id", follower_id)

        if not followed:
            raise Exception(USER_NOT_FOUND)
        
        if relation:
            followed.followers -= 1
            follower.following -= 1
            db.delete(relation)
        else:
            followed.followers += 1
            follower.following += 1
            db.save(UserRelationship(follower_id=follower_id, followed_id=followed_id))

    def get_user_achievements(self, db: Database, user_id: int) -> AchievementsDTO:
        user = db.find_by(User, "id", user_id, options=[selectinload(User.achievements).selectinload(UserAchievement.achievement)])

        user_achievements = user.achievements
        achievements = db.find_all(Achievement)

        print(achievements)

        achievement_dtos = []

        for achievement in achievements:
            dto = AchievementDTO(
                name=achievement.name,
                description=achievement.description,
                icon_name=achievement.icon_name,
                color=achievement.color,
                unlocked=False,
                unlocked_at=None
            )
            for user_achievement in user_achievements:
                if achievement.id == user_achievement.achievement.id:
                    dto.unlocked = True
                    dto.unlocked_at = user_achievement.unlocked_at

            achievement_dtos.append(dto)

        return AchievementsDTO(
            achievements=achievement_dtos
        )

# Funciones auxiliares para mejorar legibilidad

def calculate_user_stats(user: User) -> tuple[dict, dict]:
    genres = dict()
    totals = {
        "movies_watched": 0,
        "sum_ratings": 0.0,
        "rated_movies": 0,
        "average_rating": 0.0,
        "reviews": 0,
        "time_watched": 0
    }

    for review in user.reviews:
        # Procesar géneros
        for movie_genre in review.movie.genres.lower().split(","):
            movie_genre = movie_genre.strip()
            genres.setdefault(movie_genre, {"sum_rating": 0, "movies_rated": 0, "movies_watched": 0})

            if review.rating is not None:
                genres[movie_genre]["sum_rating"] += review.rating
                genres[movie_genre]["movies_rated"] += 1

            genres[movie_genre]["movies_watched"] += 1

        # Totales generales
        if review.text is not None:
            totals["reviews"] += 1
        if review.rating is not None:
            totals["sum_ratings"] += review.rating
            totals["rated_movies"] += 1

        totals["movies_watched"] += 1
        totals["time_watched"] += review.movie.duration

    return genres, totals

def process_genres(genres: dict) -> list[Genre]:
    processed = []
    for genre_name, data in genres.items():
        avg = round(data["sum_rating"] / data["movies_rated"], 1) if data["movies_rated"] else 0
        processed.append(
            Genre(
                name=genre_name.capitalize(),
                average_rating=avg,
                movies_watched=data["movies_watched"]
            )
        )
    return processed

def build_insight_dto_pre_achievements(user_id: int, genres: list[Genre], totals: dict, all_reviews: list[Review]) -> InsightDTO:
    average_rating = round(totals["sum_ratings"] / totals["rated_movies"], 1) if totals["rated_movies"] > 0 else 0.0
    reviewed_movies_percentage = (
        round((totals["reviews"] / totals["movies_watched"]) * 100, 0) if totals["movies_watched"] > 0 else 0.0
    )

    most_liked_review = get_most_liked_review(all_reviews)
    most_liked_review_likes = most_liked_review.likes if most_liked_review else 0

    return InsightDTO(
        user_id=user_id,
        genres=genres,
        achievements=[],
        total_reviews=totals["reviews"],
        total_ratings=totals["rated_movies"],
        total_movies_watched=totals["movies_watched"],
        total_time_watched=round(totals["time_watched"] / 60),
        total_likes=get_total_likes(all_reviews),
        most_liked_review=most_liked_review,
        most_liked_review_likes=most_liked_review_likes,
        total_average_rating=average_rating,
        reviewed_movies_percentage=reviewed_movies_percentage
    )

def build_insight_dto(db: Database, insight_dto: InsightDTO) -> InsightDTO:
    achievements = db.find_all(Achievement)
    
    achivements_unlocked = []

    user_achievements = db.find_all(UserAchievement, UserAchievement.user_id==insight_dto.user_id, options=[selectinload(UserAchievement.achievement)])
    for ua in user_achievements:
        achivements_unlocked.append(AchievementDTO(
            name=ua.achievement.name,
            description=ua.achievement.description,
            icon_name=ua.achievement.icon_name,
            color=ua.achievement.color,
            unlocked=True,
            unlocked_at=ua.unlocked_at
        ))

    achivements_to_unlock = []
    if achivements_unlocked:
        achivements_to_unlock = [a for a in achievements if all(a.name != au.name for au in achivements_unlocked)]
    else:
        achivements_to_unlock = achievements
    
    for achievement in achivements_to_unlock:
        dto = AchievementDTO(
            name=achievement.name,
            description=achievement.description,
            icon_name=achievement.icon_name,
            color=achievement.color,
            unlocked=False,
            unlocked_at=None
        )   

        unlock_conditions = json.loads(achievement.unlock_conditions)
        if getattr(insight_dto, unlock_conditions.get("target_field")) >= unlock_conditions.get("value"):
            dto.unlocked = True
            
            new_user_achievement = UserAchievement(user_id=insight_dto.user_id, achievement_id=achievement.id)
            dto.unlocked_at = new_user_achievement.unlocked_at
            
            db.save(new_user_achievement)

        achivements_unlocked.append(dto)

    insight_dto.achievements = achivements_unlocked
    return insight_dto

def get_most_liked_review(reviews: list[Review]) -> Optional[ReviewDTO]:
    most_liked_review = max(reviews, key=lambda r: r.likes, default=None)
    return ReviewDTO(
        id=most_liked_review.id,
        user_id=most_liked_review.user_id,
        movie_id=most_liked_review.movie_id,
        rating=most_liked_review.rating,
        text=most_liked_review.text,
        watch_date=most_liked_review.watch_date,
        likes=most_liked_review.likes,
        created_at=most_liked_review.created_at,
        updated_at=most_liked_review.updated_at,
        movie=MovieGetResponse(
            id=most_liked_review.movie.id,
            title=most_liked_review.movie.title,
            year=most_liked_review.movie.year,
            imdb_rating=most_liked_review.movie.imdb_rating,
            genres=most_liked_review.movie.genres,
            countries=most_liked_review.movie.countries,
            duration=most_liked_review.movie.duration,
            cast=most_liked_review.movie.cast,
            directors=most_liked_review.movie.directors,
            writers=most_liked_review.movie.writers,
            plot=most_liked_review.movie.plot,
            logo_url=most_liked_review.movie.logo_url,
        )
    ) if most_liked_review else None

def get_total_likes(reviews: list[Review]) -> int:
    return sum(r.likes for r in (reviews if reviews else []))