from app.model.movie import Movie


def get_movie_average_rating(movie: Movie) -> float:    
    return (
        round(movie.flixy_ratings_sum / movie.flixy_ratings_total, 1)
        if movie.flixy_ratings_total > 0
        else 0
    )