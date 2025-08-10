import { useState } from "react";
import { AddMovieWatchList } from "./add-movie-watchlist";
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

interface WatchList {
  id?: number;
  name?: string;
  description?: string;
  movies: Movie[];
  // icon: string;
  created_at?: string;
  updated_at?: string;
}

export default function WatchListMovies({
  showOnly,
  accessToken,
  watchlist,
}: {
  showOnly?: boolean;
  accessToken: string;
  watchlist: WatchList;
}) {
  const [watchListMovies, setWatchListMovies] = useState<Movie[]>(
    watchlist.movies || []
  );

  const [showOnlyError, setShowOnlyError] = useState<String>("");

  function handleMovieAddition(movie: Movie) {
    if (showOnly) {
      const movieExists = watchListMovies.some((m) => m.id === movie.id);
      if (movieExists) {
        setShowOnlyError("Movie already exists in the watchlist.");
      } else {
        setShowOnlyError("");
        setWatchListMovies((prevMovies) => [...prevMovies, movie]);
      }
    } else {
      setWatchListMovies((prevMovies) => [...prevMovies, movie]);
    }
  }

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {watchListMovies.length > 5 ? (
          <>
            {watchListMovies.slice(0, 4).map((movie) => (
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
              ...
            </div>

            <MovieCard
              key={watchListMovies[watchListMovies.length - 1].id}
              movie={watchListMovies[watchListMovies.length - 1]}
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
          watchListMovies.map((movie) => (
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
        <AddMovieWatchList
          showOnly={showOnly}
          accessToken={String(accessToken)}
          watchListId={watchlist.id ? watchlist.id : 0}
          onMovieSelect={handleMovieAddition}
        />
      </div>
      {showOnly && showOnlyError && (
        <p className="text-red-500 text-sm mt-2">{showOnlyError}</p>
      )}
    </div>
  );
}
