import { useState } from "react";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import type { Page } from "services/api/flixy/types/overall";
import type { WatchListGet } from "services/api/flixy/types/watchlist";
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
  movies: Page<MovieDataGet>;
  // icon: string;
  created_at?: string;
  updated_at?: string;
}

export default function WatchListMovies({
  showOnly,
  isSeeWatchList = false,
  isEditWatchList = false,
  watchList,
  accessToken,
  onMovieDeletion,
  highlightedMovies = [],
}: {
  showOnly?: boolean;
  isSeeWatchList?: boolean;
  isEditWatchList?: boolean;
  watchList: WatchList | WatchListGet;
  accessToken: string;
  onMovieDeletion?: (movie: MovieDataGet) => void;
  highlightedMovies?: number[];
}) {
  const [watchListMovies, setWatchListMovies] = useState<Page<MovieDataGet>>(
    watchList.movies?.items
      ? watchList.movies
      : { items: [], total: 0, page: 1, size: 0, pages: 0 }
  );

  const [showOnlyError, setShowOnlyError] = useState<String>("");

  function handleMovieDeletion(movie: MovieDataGet) {
    if (onMovieDeletion) {
      console.log("Edit: Deleting movie:", movie);
      onMovieDeletion(movie);
    }
  }

  function handleMovieAddition(movie: MovieDataGet) {
    if (showOnly) {
      const movieExists = watchListMovies.items.some(
        (m: MovieDataGet) => m.id === movie.id
      );
      if (movieExists) {
        setShowOnlyError("Movie already exists in the watchlist.");
      } else {
        setShowOnlyError("");
        setWatchListMovies((prevMovies) => ({
          ...prevMovies,
          items: [...prevMovies.items, movie],
          total: prevMovies.total + 1,
        }));
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
        {watchListMovies.total === 0 && !isSeeWatchList && (
          <div className="italic text-gray-300 mb-4 text-sm">
            No movies so far.
          </div>
        )}
        <WatchListMoviesDisplay
          accessToken={accessToken}
          watchlist_id={watchList.id ? watchList.id : 0}
          isSeeWatchList={isSeeWatchList}
          movies={watchListMovies}
          isEditWatchList={isEditWatchList}
          onMovieDeletion={handleMovieDeletion}
          highlightedMovies={highlightedMovies}
        />
        {!isSeeWatchList && (
          <AddMovieWatchList
            showOnly={showOnly}
            accessToken={String(accessToken)}
            watchListId={watchList.id ? watchList.id : 0}
            onMovieSelect={handleMovieAddition}
          />
        )}
      </div>
      {showOnly && showOnlyError && (
        <p className="text-red-500 text-sm mt-2">{showOnlyError}</p>
      )}
    </div>
  );
}
