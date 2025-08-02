import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { HeaderFull } from "components/ui/header-full";
import { MovieCard } from "components/ui/movie-card";
import { Pagination } from "components/ui/pagination";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Film, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData } from "react-router-dom";
import { searchMovies } from "services/api/flixy/server/movies";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";
import { getAccessToken } from "services/api/utils";
import type { Route } from "./+types/search";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 8;

interface SearchResults {
  query: string;
  movies: Page<Movie>;
  users: Page<any>;
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

const userResults = [
  {
    id: 1,
    username: "moviebuff2024",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 1234,
    reviews: 89,
    verified: true,
  },
  {
    id: 2,
    username: "cinephile_sarah",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 856,
    reviews: 156,
    verified: false,
  },
  {
    id: 3,
    username: "filmcritic_mike",
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 2341,
    reviews: 234,
    verified: true,
  },
  {
    id: 4,
    username: "horror_fan_jenny",
    name: "Jenny Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 567,
    reviews: 78,
    verified: false,
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const query = url.searchParams.get("query") ?? "";
  const page = parseInt(
    url.searchParams.get("movies_page") ?? `${DEFAULT_PAGE}`,
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
    searchResults.movies = await searchMovies(
      query,
      page,
      DEFAULT_PAGE_SIZE,
      request
    );
    searchResults.query = query;
    searchResults.users = {
      items: userResults,
      total: userResults.length,
      page: 1,
      size: 5,
      pages: 1,
    };

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
                        `/search?query=${searchResults.query}&movies_page=${page}`
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.users.items.map((user) => (
                      <div
                        key={user.id}
                        className="bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-pink-500">
                              {user.name
                                .split(" ")
                                .map((n: any) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{user.name}</h3>
                              {user.verified && (
                                <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-400">
                              @{user.username}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                              <span>
                                {user.followers.toLocaleString()}{" "}
                                {t("search.user_followers")}
                              </span>
                              <span>
                                {user.reviews} {t("search.user_reviews")}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600 text-white"
                          >
                            {t("search.user_follow_button")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
