import type { MovieDataGet } from "services/api/flixy/types/movie";
import { MovieCard } from "../movie-card";

interface TrendingMoviesProps {
  movies: MovieDataGet[];
  accessToken: string | undefined;
}

export function TopRatedMovies({ movies, accessToken }: TrendingMoviesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {movies.slice(0, 5).map((movie) => (
        <MovieCard
          movie={movie}
          accessToken={accessToken}
          key={movie.id}
        ></MovieCard>
      ))}
    </div>
  );
}
