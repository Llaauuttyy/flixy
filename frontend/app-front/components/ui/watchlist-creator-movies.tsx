import { useState } from "react";
import { AddMovieWatchList } from "./add-movie-watchlist";
import WatchListMoviesDisplay from "./watchlist-movies-display";

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

export default function WatchListCreatorMovies({
  showOnly,
  accessToken,
  watchlist,
  onAddMovie,
}: {
  showOnly?: boolean;
  accessToken: string;
  watchlist: WatchList;
  onAddMovie: (movie: Movie) => void;
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
        onAddMovie(movie);
      }
    } else {
      setWatchListMovies((prevMovies) => [...prevMovies, movie]);
    }
  }

  return (
    <div>
      <div className="flex items-center">
        <WatchListMoviesDisplay
          accessToken={accessToken}
          movies={watchListMovies}
        />
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
