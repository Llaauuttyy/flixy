from app.model.user import User
from app.model.review_like import ReviewLike
from app.model.user_achievement import UserAchievement
from app.dto.achievement import AchievementDTO
from app.dto.movie import MovieGetResponse
from app.model.user_relationship import UserRelationship
from app.model.movie import Movie
from fastapi import HTTPException
from app.model.review import Review
from app.db.database import Database
from app.dto.review import ReviewCreationDTO, ReviewGetSingularAchievementsDTO, ReviewGetSingularDTO, TopMovieRatingDTO
from sqlalchemy.exc import IntegrityError
from app.constants.message import FUTURE_TRAVELER, MOVIE_NOT_FOUND, REVIEW_NOT_FOUND, INSULTING_REVIEW, UNDELETABLE_REVIEW_ERROR
from sqlalchemy.orm import selectinload
from typing import Tuple, List, Optional
from datetime import datetime as datetime
from app.external.moderation_assistant import Moderator

class ReviewService:
    def set_up_review_singular_dto(self, review: Review, user_id: int, db: Database) -> ReviewGetSingularDTO:
        liked_by_user = db.exists_by_multiple(ReviewLike, review_id=review.id, user_id=user_id)
        return ReviewGetSingularDTO(
            id=review.id,
            user_id=review.user_id,
            movie_id=review.movie_id,
            rating=review.rating,
            text=review.text,
            watch_date=review.watch_date,
            likes=review.likes,
            created_at=review.created_at,
            updated_at=review.visible_updated_at,
            liked_by_user=liked_by_user,
            name=review.user.name,
            user_name=review.user.username
        )
    
    def set_up_review_singular_achievements_dto(self, review: Review, user_id: int, db: Database) -> ReviewGetSingularAchievementsDTO:
        liked_by_user = db.exists_by_multiple(ReviewLike, review_id=review.id, user_id=user_id)
        
        movie = None
        if review.movie:
            movie_data = review.movie
            movie = MovieGetResponse(
                id=movie_data.id,
                title=movie_data.title,
                year=movie_data.year,
                imdb_rating=movie_data.imdb_rating,
                genres=movie_data.genres,
                countries=movie_data.countries,
                duration=movie_data.duration,
                cast=movie_data.cast,
                directors=movie_data.directors,
                writers=movie_data.writers,
                plot=movie_data.plot,
                logo_url=movie_data.logo_url,
                user_rating=review.rating if review.rating else None
            )

        achievements = review.user.achievements
        achievement_dtos = list()

        for user_achievement in achievements:
            achievement = user_achievement.achievement
            achievement_dtos.append(
                AchievementDTO(
                    name=achievement.name,
                    description=achievement.description,
                    icon_name=achievement.icon_name,
                    color=achievement.color,
                    unlocked=True,
                    unlocked_at=user_achievement.unlocked_at
                )
            )

        return ReviewGetSingularAchievementsDTO(
            id=review.id,
            user_id=review.user_id,
            movie_id=review.movie_id,
            rating=review.rating,
            text=review.text,
            watch_date=review.watch_date,
            likes=review.likes,
            created_at=review.created_at,
            updated_at=review.visible_updated_at,
            liked_by_user=liked_by_user,
            name=review.user.name,
            user_name=review.user.username,
            movie=movie,
            achievements=achievement_dtos
        )
    
    def set_up_top_movie_rating_dto(self, top_movie: dict) -> TopMovieRatingDTO:
        movie_data = top_movie["movie"]
        return TopMovieRatingDTO(
            movie=MovieGetResponse(
                id=movie_data.id,
                title=movie_data.title,
                year=movie_data.year,
                imdb_rating=movie_data.imdb_rating,
                genres=movie_data.genres,
                countries=movie_data.countries,
                duration=movie_data.duration,
                cast=movie_data.cast,
                directors=movie_data.directors,
                writers=movie_data.writers,
                plot=movie_data.plot,
                logo_url=movie_data.logo_url,
                user_rating=None
            ),
            average_rating=top_movie["average_rating"],
            total_ratings=len(top_movie["ratings"])
        )

    def get_all_reviews(self, db: Database, user_id: int, movie_id: Optional[int]) -> Tuple[Optional[ReviewGetSingularAchievementsDTO], List[ReviewGetSingularAchievementsDTO]]:
        current_user_review = None
        reviews = []

        if movie_id:
            current_user_review = db.find_by_multiple(
                Review,
                options=[selectinload(Review.user).selectinload(User.achievements).selectinload(UserAchievement.achievement)],
                movie_id=movie_id,
                user_id=user_id
            )
            
            reviews = db.find_all(
                Review,
                db.build_condition([Review.movie_id == movie_id, Review.user_id != user_id]),
                [selectinload(Review.user).selectinload(User.achievements).selectinload(UserAchievement.achievement)]
            )

            if not current_user_review and not reviews:
                return (None, [])

            if current_user_review:
                current_user_review = self.set_up_review_singular_achievements_dto(current_user_review, user_id, db)

        else:
            reviews = db.find_all(
                Review,
                db.build_condition([Review.user_id == user_id]),
                [selectinload(Review.user).selectinload(User.achievements).selectinload(UserAchievement.achievement), selectinload(Review.movie)]
            )

        if reviews:
            reviews_singular = list()
            for review in reviews:
                reviews_singular.append(
                    self.set_up_review_singular_achievements_dto(review, user_id, db)
                )

            reviews = reviews_singular

        return (current_user_review, reviews)
    
    def create_review(self, db: Database, review_dto: ReviewCreationDTO, user_id: int) -> ReviewGetSingularDTO:
        try:
            if review_dto.watch_date and review_dto.watch_date.replace(tzinfo=None) > datetime.now():
                raise Exception(FUTURE_TRAVELER)
            
            if review_dto.text and Moderator().is_review_insulting(review_dto.text):
                raise Exception(INSULTING_REVIEW)
            
            existing_review = db.find_by_multiple(Review, user_id=user_id, movie_id=review_dto.movie_id)

            if existing_review:
                if review_dto.text:
                    existing_review.text = review_dto.text
                if review_dto.rating:

                    if existing_review.rating:
                        existing_review.movie.flixy_ratings_sum += (-1 * existing_review.rating)
                    else:
                        existing_review.movie.flixy_ratings_total += 1

                    existing_review.movie.flixy_ratings_sum += review_dto.rating

                    existing_review.rating = review_dto.rating
                if review_dto.watch_date:
                    existing_review.watch_date = review_dto.watch_date

                existing_review.visible_updated_at = datetime.now()
                db.save(existing_review)
                review = existing_review
            else:
                curent_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                new_review = Review(
                    user_id=user_id,
                    movie_id=review_dto.movie_id,
                    rating=review_dto.rating if review_dto.rating else None,
                    text=review_dto.text,
                    watch_date=review_dto.watch_date if review_dto.watch_date else curent_date,
                )

                movie = db.find_by(Movie, "id", review_dto.movie_id)

                if review_dto.rating:
                    movie.flixy_ratings_sum += review_dto.rating
                    movie.flixy_ratings_total += 1
                    db.add(movie)

                db.save(new_review)
                review = new_review

            user = db.find_by(User, "id", review.user_id)

            return ReviewGetSingularDTO(
                id=review.id,
                user_id=review.user_id,
                movie_id=review.movie_id,
                rating=review.rating,
                text=review.text,
                watch_date=review.watch_date,
                likes=review.likes,
                created_at=review.created_at,
                updated_at=review.visible_updated_at,
                name=user.name,
                user_name=user.username
            )

        except IntegrityError as e:
            db.rollback()

            if "foreign key constraint" in str(e).lower():
                raise HTTPException(status_code=404, detail=MOVIE_NOT_FOUND)
            else:
                raise HTTPException(status_code=400, detail=str(e))

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    def remove_review_likes(self, db: Database, review_to_delete: Review):
        review_likes = db.find_all(ReviewLike, ReviewLike.review_id == review_to_delete.id)

        for like in review_likes:
            db.remove(like)
            review_to_delete.likes = 0
        
    def delete_review_text(self, db: Database, user_id: int, id: int):
        try:
            review_to_delete = db.find_by_multiple(Review, id=id, user_id=user_id)

            if not review_to_delete:
                raise HTTPException(status_code=404, detail=REVIEW_NOT_FOUND)

            review_to_delete.text = None
            review_to_delete.visible_updated_at = datetime.now()

            self.remove_review_likes(db, review_to_delete)

            db.save(review_to_delete)
        except IntegrityError as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    def delete_review(self, db: Database, user_id: int, id: int):
        try:
            review_to_delete = db.find_by_multiple(Review, id=id, user_id=user_id)

            if not review_to_delete:
                raise HTTPException(status_code=404, detail=REVIEW_NOT_FOUND)
            
            if review_to_delete.text or review_to_delete.rating:
                raise HTTPException(status_code=409, detail=UNDELETABLE_REVIEW_ERROR)

            self.remove_review_likes(db, review_to_delete)

            db.delete(review_to_delete)
        except IntegrityError as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    def like_review(self, db: Database, user_id: int, id: int) -> ReviewGetSingularAchievementsDTO:
        try:
            review_to_like = db.find_by(Review, "id", id)
            user_like = db.find_by_multiple(ReviewLike, review_id=id, user_id=user_id)

            if not review_to_like:
                raise HTTPException(status_code=404, detail=REVIEW_NOT_FOUND)
            
            if not user_like:
                user_like = ReviewLike(user_id=user_id, review_id=id)
                db.save(user_like)
                review_to_like.likes += 1
            else:
                db.delete(user_like)
                review_to_like.likes -= 1

            db.save(review_to_like)
            return self.set_up_review_singular_achievements_dto(review_to_like, user_id, db)
        except IntegrityError as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    def latest_text_reviews(self, db: Database, user_id: int, following: bool) -> list[ReviewGetSingularAchievementsDTO]:
        order_by = {"column": "visible_updated_at", "way": "desc"}
        try:
            if following:
                following_users = db.find_all(UserRelationship, UserRelationship.follower_id == user_id)
                conditions = db.build_condition([Review.user_id.in_([user.followed_id for user in following_users]), Review.text != None])
                return [self.set_up_review_singular_achievements_dto(review, user_id, db) for review in db.find_all_by_multiple(Review, conditions, order_by=order_by)]
            else:
                conditions = db.build_condition([Review.user_id != user_id, Review.text != None])
                return [self.set_up_review_singular_achievements_dto(review, user_id, db) for review in db.find_all_by_multiple(Review, conditions, order_by=order_by)]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        
    def latest_rating_reviews(self, db: Database, user_id: int, following: bool) -> list[ReviewGetSingularAchievementsDTO]:
        order_by = {"column": "visible_updated_at", "way": "desc"}
        try:
            if following:
                following_users = db.find_all(UserRelationship, UserRelationship.follower_id == user_id)
                conditions = db.build_condition([Review.user_id.in_([user.followed_id for user in following_users]), Review.rating != None])
                return [self.set_up_review_singular_achievements_dto(review, user_id, db) for review in db.find_all_by_multiple(Review, conditions, order_by=order_by)]
            else:
                conditions = db.build_condition([Review.user_id != user_id, Review.rating != None])
                return [self.set_up_review_singular_achievements_dto(review, user_id, db) for review in db.find_all_by_multiple(Review, conditions, order_by=order_by)]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        
    def top_movie_ratings(self, db: Database) -> list[TopMovieRatingDTO]:
        try:
            movie_ratings = {} 
            all_ratings = db.find_all(Review, Review.rating != None, [selectinload(Review.movie)])

            for review in all_ratings:
                movie_id = review.movie_id
                if movie_id not in movie_ratings:
                    movie_ratings[movie_id] = {"movie": review.movie, "ratings": []}
                movie_ratings[movie_id]["ratings"].append(review.rating)

            for id, ratings in movie_ratings.items():
                movie_ratings[id]["average_rating"] = sum(ratings["ratings"]) / len(ratings["ratings"])

            top_movies = sorted(movie_ratings.values(), key=lambda x: x["average_rating"], reverse=True)[:10]

            return [self.set_up_top_movie_rating_dto(top_movie) for top_movie in top_movies]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))