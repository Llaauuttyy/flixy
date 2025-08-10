import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData, useNavigate, useSubmit } from "react-router-dom";
import { searchMovies } from "services/api/flixy/client/movies";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";

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

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 100;

export function AddMovieWatchList({ accessToken }: { accessToken: string }) {
  const submit = useSubmit();
  const apiResponse: ApiResponse = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState(apiResponse?.data?.query ?? "");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [addingMovie, setAddingMovie] = useState(false);
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);

  function handleAddMovie() {
    setAddingMovie(true);
  }

  function handleCancelAddMovie() {
    setAddingMovie(false);
    setSearchText("");
    setSearchedMovies([]);
  }

  function handleMovieClick(id: number) {
    console.log("Movie ID:", id);
    return;
  }

  async function handleMovieSearch() {
    if (!searchText.trim()) {
      return;
    }

    let apiResponse: ApiResponse = {};

    let searchResults: SearchResults = {} as SearchResults;

    try {
      searchResults.movies = await searchMovies(
        accessToken,
        searchText,
        DEFAULT_PAGE,
        DEFAULT_PAGE_SIZE
      );

      apiResponse.data = searchResults;

      setSearchedMovies(searchResults.movies.items);

      console.log("Movies", searchResults.movies);
      return apiResponse;
    } catch (err: Error | any) {
      console.log("API GET /movies?search_query said: ", err.message);

      if (err instanceof TypeError) {
        apiResponse.error =
          "Service's not working properly. Please try again later.";
        return apiResponse;
      }

      apiResponse.error = err.message;
      return apiResponse;
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
              <ul className="h-25 absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1 overflow-y-auto z-[9999]">
                {searchedMovies.length > 0 ? (
                  searchedMovies.map((movie) => (
                    <li
                      key={movie.id}
                      onClick={() => handleMovieClick(movie.id)}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                    >
                      {movie.title} ({movie.year})
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No matches found.</li>
                )}
              </ul>
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
    </header>
  );
}
