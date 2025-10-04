import { useState } from "react";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import type { Page } from "services/api/flixy/types/overall";
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

interface WatchListFace {
  id?: number;
  name?: string;
  description?: string;
  movies: Page<MovieDataGet>;
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
  watchlist: WatchListFace;
  onAddMovie: (movie: MovieDataGet) => void;
}) {
  const [watchListMovies, setWatchListMovies] = useState<Page<MovieDataGet>>(
    watchlist.movies || []
  );

  const [showOnlyError, setShowOnlyError] = useState<String>("");

  function handleMovieAddition(movie: MovieDataGet) {
    if (showOnly) {
      const movieExists = watchListMovies.items.some((m) => m.id === movie.id);
      if (movieExists) {
        setShowOnlyError("Movie already exists in the watchlist.");
      } else {
        setShowOnlyError("");
        setWatchListMovies((prevMovies) => ({
          ...prevMovies,
          items: [...prevMovies.items, movie],
          total: prevMovies.total + 1,
        }));
        onAddMovie(movie);
      }
    } else {
      setWatchListMovies((prevMovies) => ({
        ...prevMovies,
        items: [...prevMovies.items, movie],
        total: prevMovies.total + 1,
      }));
    }
  }

  return (
    <div>
      <div className="flex items-center">
        <WatchListMoviesDisplay
          accessToken={accessToken}
          isCreateWatchList={true}
          watchlist_id={watchlist.id ? watchlist.id : 0}
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
