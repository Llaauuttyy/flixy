# User
USER_NOT_FOUND = "User not found."
EXISTENT_USERNAME_ERROR = "There is already another user with that username."

# Auth
LOGIN_CREDENTIALS_ERROR = "Username or password are incorrect."
OLD_PASSWORD_DOESNT_MATCH_ERROR = "Old password does not match current password."
OLD_AND_NEW_PASSWORDS_ARE_THE_SAME_ERROR = "Old and new passwords are the same."
PASSWORD_VALIDATION_ERROR = "Password must have: uppercase, lowercase, number and special character."

# Movie
MOVIE_NOT_FOUND = "Movie not found by id."

# Review
REVIEWS_NOT_FOUND = "Reviews not found for this movie."
REVIEW_NOT_FOUND = "Review not found."
FUTURE_TRAVELER = "Date cannot be in the future."
INSULTING_REVIEW = "Your review contains insulting content. Try to express yourself and be nice at the same time. It is not that hard!"

# WatchList
WATCHLIST_ALREADY_EXISTS = "Watchlist with that name already exists."
WATCHLIST_NOT_FOUND = "Watchlist not found."

def MOVIE_ALREADY_IN_WATCHLIST(movie_id: int) -> str:
    return f"Movie with ID {movie_id} already in watchlist."

def MOVIE_NOT_FOUND_IN_WATCHLIST(movie_id: int) -> str:
    return f"Movie with ID {movie_id} not found in watchlist."