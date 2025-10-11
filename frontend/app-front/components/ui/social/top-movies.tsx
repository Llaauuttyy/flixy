import { Star, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { MovieDataGet } from "services/api/flixy/types/movie";

interface TopMovie {
  movie: MovieDataGet;
  average_rating: number;
  total_ratings: number;
}

interface TopMoviesProps {
  topMovies: TopMovie[];
}

export const TopMovies = ({ topMovies }: TopMoviesProps) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-4">
      {topMovies.map((topMovie, index) => (
        <Link to={`/movies/${topMovie.movie.id}`} key={topMovie.movie.id}>
          <div className="group relative overflow-hidden rounded-lg border border-gray-600 bg-gray-700 cursor-pointer">
            <div className="flex gap-3 p-3 items-center">
              {/* Rank Badge */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                {index + 1}
              </div>

              {/* Movie Poster Thumbnail */}
              <div className="flex-shrink-0 w-16 h-24 rounded overflow-hidden bg-slate-700">
                <img
                  src={topMovie.movie.logo_url || "/placeholder.svg"}
                  alt={topMovie.movie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm mb-1 truncate">
                  {topMovie.movie.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-purple-500 text-purple-500" />
                  <span className="text-white font-bold text-sm">
                    {topMovie.average_rating.toFixed(1)}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Users className="h-3 w-3" />
                    <span>
                      {`${topMovie.total_ratings.toLocaleString()} ${t(
                        "social.top_movies.ratings"
                      )}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
