import { Pagination } from "components/ui/pagination";
import { Trash } from "lucide-react";
import { Link, useFetcher } from "react-router-dom";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import type { Page } from "services/api/flixy/types/overall";
import { Button } from "./button";
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
  isSeeWatchList = false,
  isEditWatchList = false,
  onMovieDeletion,
  highlightedMovies = [],
  movies,
}: {
  accessToken: string;
  watchlist_id: number;
  isSeeWatchList?: boolean;
  isEditWatchList?: boolean;
  onMovieDeletion?: (movie: MovieDataGet) => void;
  highlightedMovies?: number[];
  movies: Page<MovieDataGet>;
}) {
  const fetcher = useFetcher();

  let movie_page: Page<MovieDataGet> = fetcher.data?.data.movies ?? movies;

  function handleMovieDeletion(movie: MovieDataGet) {
    if (onMovieDeletion) {
      onMovieDeletion(movie);
    }
  }

  function deleteButton(movie: MovieDataGet) {
    const isActive = highlightedMovies.includes(Number(movie.id));

    return (
      <Button
        onClick={() => handleMovieDeletion(movie)}
        className={`m-10 mt-2 mb-2 rounded-lg border shadow-sm border-slate-700 hover:bg-slate-700 disabled:opacity-50
        ${isActive ? "bg-red-700 text-white" : "bg-slate-800/50 text-card-foreground"}
      `}
      >
        <Trash size={30} color={isActive ? "white" : "red"} />
      </Button>
    );
  }

  return (
    <div className="flex-1 gap-4 overflow-y-auto pb-2">
      {isSeeWatchList ? (
        <Pagination
          itemsPage={movie_page}
          onPageChange={(page: number) => {
            fetcher.load(`/watchlists/${watchlist_id}?page=${page}`);
          }}
        >
          <div className="w-full grid gap-4 grid-cols-[repeat(auto-fill,minmax(128px,128px))]">
            {movie_page.items.map((movie) => (
              <div className="grid">
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
                <>{isEditWatchList && deleteButton(movie)}</>
              </div>
            ))}
          </div>
        </Pagination>
      ) : movie_page.items.length > 5 ? (
        <div className="flex gap-4 pb-2">
          {movie_page.items.slice(0, 4).map((movie) => (
            <div className="grid">
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
              <>{isEditWatchList && deleteButton}</>
            </div>
          ))}

          <div className="flex items-center justify-center w-12 text-gray-400 text-2xl">
            <Link to={`/watchlists/${watchlist_id}`}>...</Link>
          </div>

          <MovieCard
            key={movie_page.items[movie_page.items.length - 1].id}
            movie={movie_page.items[movie_page.items.length - 1]}
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
          {isEditWatchList &&
            deleteButton(movie_page.items[movie_page.items.length - 1])}
        </div>
      ) : (
        <div className="flex gap-4 pb-2">
          {movie_page.items.map((movie) => (
            <div className="grid">
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
              <>{isEditWatchList && deleteButton(movie)}</>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
