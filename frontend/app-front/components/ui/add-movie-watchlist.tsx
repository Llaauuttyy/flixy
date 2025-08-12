import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSubmit } from "react-router-dom";
import { searchMovies } from "services/api/flixy/client/movies";
import { handleWatchListEdition } from "services/api/flixy/client/watchlists";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";
import type {
  WatchListEdit,
  WatchListEditData,
} from "services/api/flixy/types/watchlist";

interface SearchResults {
  movies: Page<Movie>;
}

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

interface AddMovieWatchListProps {
  showOnly?: boolean;
  accessToken: string;
  watchListId: number;
  onMovieSelect: (movie: Movie) => void;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 100;

export function AddMovieWatchList({
  showOnly,
  accessToken,
  watchListId,
  onMovieSelect,
}: AddMovieWatchListProps) {
  const submit = useSubmit();
  const [apiResponseMovieAdd, setApiResponseMovieAdd] = useState<ApiResponse>(
    {}
  );
  const [apiResponseSearch, setApiResponseSearch] = useState<ApiResponse>({});
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isShowOnly = showOnly ?? false;

  console.log(watchListId);

  const [addingMovie, setAddingMovie] = useState(false);
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);

  function handleAddMovie() {
    setAddingMovie(true);
  }

  function handleCancelAddMovie() {
    setAddingMovie(false);
    setSearchText("");
    setSearchedMovies([]);
    setApiResponseMovieAdd({});
  }

  async function handleMovieAddClick(movie: Movie) {
    try {
      if (!isShowOnly) {
        const watchListMovieEditData: WatchListEditData = {
          movie_ids_to_add: [movie.id],
        };
        const watchListMovieEdit: WatchListEdit = {
          watchlist_id: watchListId,
          data: watchListMovieEditData,
        };

        const success = await handleWatchListEdition(
          accessToken,
          watchListMovieEdit
        );

        setApiResponseMovieAdd({ success });
      }
      onMovieSelect(movie);
    } catch (err: Error | any) {
      console.log("API POST /watchlist/movie said: ", err.message);

      if (err instanceof TypeError) {
        setApiResponseMovieAdd({
          error: "Service's not working properly. Please try again later.",
        });
        return;
      }

      setApiResponseMovieAdd({
        error: err.message,
      });
    }
  }

  async function handleMovieSearch() {
    if (!searchText.trim()) {
      return;
    }

    let apiResponseSearch: ApiResponse = {};

    let searchResults: SearchResults = {} as SearchResults;

    try {
      searchResults.movies = await searchMovies(
        accessToken,
        searchText,
        DEFAULT_PAGE,
        DEFAULT_PAGE_SIZE
      );

      apiResponseSearch.data = searchResults;

      setSearchedMovies(searchResults.movies.items);
      setApiResponseSearch(apiResponseSearch);
    } catch (err: Error | any) {
      console.log("API GET /movies?search_query said: ", err.message);

      if (err instanceof TypeError) {
        apiResponseSearch.error =
          "Service's not working properly. Please try again later.";
        setApiResponseSearch(apiResponseSearch);
      }

      apiResponseSearch.error = err.message;
      setApiResponseSearch(apiResponseSearch);
    }
  }

  if (!addingMovie) {
    return (
      <div className="flex items-center justify-center">
        <Button
          onClick={handleAddMovie}
          className="justify-end bg-transparent border-none text-gray-400 text-sm font-medium cursor-pointer rounded-md transition-all duration-200 hover:bg-slate-800"
        >
          <Plus className="text-gray-400" />
          Add More
        </Button>
      </div>
    );
  }

  return (
    <header className="pt-2 pl-2">
      <div className="flex justify-between items-center">
        <div className="h-40 flex-1 max-w-md">
          <div className="flex justify-between relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-1" />
            <Input
              id="search-bar"
              name="search-bar"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                handleMovieSearch();
              }}
              onClear={() => {
                setSearchText("");
                setSearchedMovies([]);
              }}
              placeholder={t("header.search_placeholder")}
              className="pl-10 bg-gray-800 border-gray-700 text-gray-300"
            />

            {addingMovie && (
              <>
                <ul className="h-25 absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1 overflow-y-auto z-[9999]">
                  {searchedMovies.length > 0 ? (
                    <>
                      {searchedMovies.map((movie) => (
                        <li
                          key={movie.id}
                          onClick={() => handleMovieAddClick(movie)}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                        >
                          {movie.title} ({movie.year})
                        </li>
                      ))}
                    </>
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      No matches found.
                    </li>
                  )}
                </ul>
              </>
            )}

            <Button
              onClick={handleCancelAddMovie}
              variant={"outline"}
              className="ml-2 hover:bg-red-700 hover:text-white text-red-500 border-red-500 disabled:opacity-50"
            >
              {t("review_input.cancel_button")}
            </Button>
          </div>
        </div>
      </div>
      {apiResponseMovieAdd?.error && (
        <p className="px-4 py-2 text-red-400">{apiResponseMovieAdd.error}</p>
      )}
      {apiResponseMovieAdd?.success && (
        <p className="px-4 py-2 text-green-400">
          Movie successfully added to watchlist!
        </p>
      )}
    </header>
  );
}
