import { Link } from "react-router-dom";
import { MovieCard } from "./movie-card";

interface Movie {
  id: number;
  title: string;
  year: number;
  imdb_rating: number;
  genres: string;
  countries: string;
  duration: number;
  cast: string;
  directors: string;
  writers: string;
  plot: string;
  logo_url: string;
  user_rating: number | null;
}

export default function WatchListMoviesDisplay({
  accessToken,
  watchlist_id,
  movies,
}: {
  accessToken: string;
  watchlist_id: number;
  movies: Movie[];
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {movies.length > 5 ? (
        <>
          {movies.slice(0, 4).map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              styles={{
                card_width: 128,
                card_height: 160,
                title_size: "sm",
                title_padding: 1,
                show_rate_this_movie: false,
                star_component_multiplier: 0.5,
                show_details_size: "xs",
                show_details_padding: 1,
              }}
              accessToken={String(accessToken)}
            />
          ))}
          <div className="flex items-center justify-center w-12 text-gray-400 text-2xl">
            <Link to={`/watchlists/${watchlist_id}`}>...</Link>
          </div>

          <MovieCard
            key={movies[movies.length - 1].id}
            movie={movies[movies.length - 1]}
            styles={{
              card_width: 128,
              card_height: 160,
              title_size: "sm",
              title_padding: 1,
              show_rate_this_movie: false,
              star_component_multiplier: 0.5,
              show_details_size: "xs",
              show_details_padding: 1,
            }}
            accessToken={String(accessToken)}
          />
        </>
      ) : (
        movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            styles={{
              card_width: 128,
              card_height: 160,
              title_size: "sm",
              title_padding: 1,
              show_rate_this_movie: false,
              star_component_multiplier: 0.5,
              show_details_size: "xs",
              show_details_padding: 1,
            }}
            accessToken={String(accessToken)}
          />
        ))
      )}
    </div>
  );
}
