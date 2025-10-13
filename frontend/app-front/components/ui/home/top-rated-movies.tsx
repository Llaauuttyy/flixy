import { Star } from "lucide-react";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import { Badge } from "../badge";
import { MovieCard } from "../movie-card";

interface TopRatedMoviesProps {
  movies: MovieDataGet[];
  accessToken: string | undefined;
}

export function TopRatedMovies({ movies, accessToken }: TopRatedMoviesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {movies.slice(0, 5).map((movie) => (
        <div key={movie.id} className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-1 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20">
            <span className="text-sm font-semibold text-pink-500 line-clamp-1">
              {movie.title}
            </span>
          </div>
          <div className="pt-2 w-full flex justify-center">
            <MovieCard movie={movie} accessToken={accessToken} />
          </div>

          <div className="pt-2 flex flex-col items-center justify-center gap-2 w-full max-w-[220px]">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
              <span className="text-lg font-semibold">{movie.imdb_rating}</span>
              <span className="text-sm">/10</span>
              <Badge className="bg-yellow-400 text-black font-bold rounded-sm px-1.5 py-0.5">
                IMDb
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
