import { Badge } from "components/ui/badge";
import { HeaderFull } from "components/ui/header-full";
import { MovieCard } from "components/ui/movie-card";
import { Pagination } from "components/ui/pagination";
import { SidebarNav } from "components/ui/sidebar-nav";
import { UserCard } from "components/ui/user-card";
import WatchList from "components/ui/watchlist/watchlist";
import { Eye, Film, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData } from "react-router-dom";
import { searchMovies } from "services/api/flixy/server/movies";
import { searchUsers } from "services/api/flixy/server/user-data";
import { searchWatchLists } from "services/api/flixy/server/watchlists";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";
import type { UserDataGet } from "services/api/flixy/types/user";
import type { WatchLists } from "services/api/flixy/types/watchlist";
import { getAccessToken, getCachedUserData } from "services/api/utils";
import type { Route } from "./+types/search";

const DEFAULT_PAGE = 1;
const DEFAULT_MOVIES_PAGE_SIZE = 8;
const DEFAULT_USERS_PAGE_SIZE = 8;

interface SearchResults {
  query: string;
  movies: Page<Movie>;
  users: Page<any>;
  watchlists: WatchLists;
  user?: UserDataGet;
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

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const query = url.searchParams.get("query") ?? "";
  const moviesPage = parseInt(
    url.searchParams.get("movies_page") ?? `${DEFAULT_PAGE}`,
    10
  );
  const usersPage = parseInt(
    url.searchParams.get("users_page") ?? `${DEFAULT_PAGE}`,
    10
  );
  const watchlistsPage = parseInt(
    url.searchParams.get("watchlists_page") ?? `${DEFAULT_PAGE}`,
    10
  );

  let apiResponse: ApiResponse = {};

  let searchResults: SearchResults = {} as SearchResults;

  if (!query) {
    apiResponse.error =
      "Service's not working properly. Please try again later.";
    return apiResponse;
  }

  try {
    searchResults.query = query;
    searchResults.movies = await searchMovies(
      query,
      moviesPage,
      DEFAULT_MOVIES_PAGE_SIZE,
      request
    );
    searchResults.users = await searchUsers(
      query,
      usersPage,
      DEFAULT_USERS_PAGE_SIZE,
      request
    );
    searchResults.watchlists = await searchWatchLists(
      query,
      usersPage,
      DEFAULT_USERS_PAGE_SIZE,
      request
    );

    searchResults.users.items = searchResults.users.items.map((user) => ({
      ...user,
      reviews: 234,
      verified: true,
    }));
    searchResults.user = await getCachedUserData(request);

    apiResponse.accessToken = await getAccessToken(request);

    apiResponse.data = searchResults;
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

export default function SearchPage() {
  const apiResponse: ApiResponse = useLoaderData();
  const fetcher = useFetcher();
  const { t } = useTranslation();

  const searchResults: SearchResults = fetcher.data?.data ?? apiResponse.data;

  if (apiResponse.error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <HeaderFull />
          <main className="overflow-auto mx-auto py-6 px-6 md:px-6">
            <p className="text-gray-400 mb-6">{apiResponse.error}</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <html lang="es">
      <body>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
          <SidebarNav />
          <div className="flex-1 overflow-y-auto">
            <HeaderFull />
            {/* Search Results */}
            <main className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">
                  {t("search.page_title")}
                </h1>
                <p className="text-slate-400">
                  {t("search.results_for_query")} "{searchResults.query}"
                </p>
              </div>
              <div className="space-y-8">
                {/* Movies Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Film className="w-5 h-5 text-pink-500" />
                    <h2 className="text-xl font-semibold">
                      {t("search.movies_section_title")}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-slate-700 text-slate-300"
                    >
                      {searchResults.movies.total}
                      {" " + t("search.results")}
                    </Badge>
                  </div>
                  <Pagination
                    itemsPage={searchResults.movies}
                    onPageChange={(page: number) => {
                      fetcher.load(
                        `/search?query=${searchResults.query}&movies_page=${page}&users_page=${searchResults.users.page}`
                      );
                    }}
                  >
                    <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
                      {searchResults.movies.items.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          accessToken={String(apiResponse.accessToken)}
                        />
                      ))}
                    </div>
                  </Pagination>
                </div>
                {/* Users Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-pink-500" />
                    <h2 className="text-xl font-semibold">
                      {t("search.users_section_title")}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-slate-700 text-slate-300"
                    >
                      {searchResults.users.total} {t("search.results")}
                    </Badge>
                  </div>
                  <Pagination
                    itemsPage={searchResults.users}
                    onPageChange={(page: number) => {
                      fetcher.load(
                        `/search?query=${searchResults.query}&users_page=${page}&movies_page=${searchResults.movies.page}`
                      );
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.users.items.map((user) => (
                        <UserCard
                          key={user.id}
                          user={user}
                          accessToken={String(apiResponse.accessToken)}
                        />
                      ))}
                    </div>
                  </Pagination>
                </div>
                {/* Watchlists Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-pink-500" />
                    <h2 className="text-xl font-semibold">
                      {t("search.watchlists_section_title")}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-slate-700 text-slate-300"
                    >
                      {searchResults.watchlists.total_watchlists}{" "}
                      {t("search.results")}
                    </Badge>
                  </div>
                  <Pagination
                    itemsPage={searchResults.watchlists.items}
                    onPageChange={(page: number) => {
                      fetcher.load(
                        `/search?query=${searchResults.query}&watchlists_page=${page}&users_page=${searchResults.users.page}&movies_page=${searchResults.movies.page}`
                      );
                    }}
                  >
                    <div className="grid grid-cols-1 gap-4">
                      {searchResults.watchlists.items.items.map((watchlist) => (
                        <WatchList
                          key={watchlist.id}
                          accessToken={String(apiResponse.accessToken)}
                          watchlist={watchlist}
                        />
                      ))}
                    </div>
                  </Pagination>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
