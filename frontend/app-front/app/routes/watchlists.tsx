import { HeaderFull } from "components/ui/header-full";
import { MovieCard } from "components/ui/movie-card";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Clock, Film, Pencil, Plus, Star, TrendingUp } from "lucide-react";
// import { Pagination } from "components/ui/pagination";
// import { useTranslation } from "react-i18next";
// import { useFetcher, useLoaderData } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getWatchLists } from "services/api/flixy/server/watchlists";
import type { ApiResponse } from "../../services/api/flixy/types/overall";
import type { Route } from "./+types/movies";

import relativeTime from "dayjs/plugin/relativeTime";

import { Button } from "components/ui/button";
import "dayjs/locale/en";
import "dayjs/locale/es";
import i18n from "i18n/i18n";

dayjs.extend(relativeTime);
dayjs.extend(utc);

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
  id: number;
  name: string;
  description: string;
  movies: Movie[];
  // icon: string;
  created_at: string;
  updated_at: string;
}

interface WatchLists {
  items: {
    items: WatchList[];
  };
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 4;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? `${DEFAULT_PAGE}`, 10);

  let apiResponse: ApiResponse = {};

  let watchlists: WatchLists = {} as WatchLists;

  console.log(watchlists);

  try {
    watchlists = await getWatchLists(page, DEFAULT_PAGE_SIZE, request);

    // apiResponse.accessToken = await getAccessToken(request);

    apiResponse.data = watchlists;
    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /movies said: ", err.message);

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function MovieInsights() {
  dayjs.locale(i18n.language || "en");

  const apiResponse: ApiResponse = useLoaderData();
  const [watchlists, setWatchlists] = useState<WatchLists>(
    apiResponse.data || []
  );

  const watchlistsData = watchlists.items.items.reduce(
    (totals, watchlist) => {
      totals.movies += watchlist.movies.length;
      totals.watchlists += 1;
      return totals;
    },
    { movies: 0, watchlists: 0 }
  );

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

  if (watchlists.items.items.length === 0) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <HeaderFull />

          <main className="overflow-auto w-full mx-auto py-6 px-6 md:px-6">
            <div className="flex justify-end mb-6">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Create WatchList
              </Button>
            </div>
            <div className="flex justify-center mb-6">
              <p className="text-gray-400 mb-6">No watchlists so far.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="sticky top-0 z-50 bg-gray-900">
          <HeaderFull />
        </div>
        {/* Header */}
        <div className="p-6 pb-3">
          <h1 className="text-3xl font-bold text-white mb-2">Watchlists</h1>
          <p className="text-gray-300">
            Manage your favorite genres and never miss a must-watch again
          </p>
          <div className="flex justify-between">
            {/* <div className="flex justify-end mb-6"> */}
            {/* </div> */}
            <div className="flex justify-start gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Film className="w-4 h-4 text-violet-400" />
                <span>{watchlistsData.movies} movies</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Star className="w-4 h-4 text-violet-400" />
                <span>{watchlistsData.watchlists} watchlists</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <span>Updated recently</span>
              </div>
            </div>
            <div className="mt-3 h-px bg-gray-600 mb-6" />
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Create WatchList
            </Button>
          </div>
          <div className="h-px bg-gray-600 mt-2 mb-4" />
        </div>

        {/* Watchlists Content */}

        <div className="p-6 pt-0">
          {watchlists.items.items.map((watchlist) => (
            <div key={watchlist.id} className="mb-12">
              {/* Watchlist Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* <span className="text-2xl">{watchlist.icon}</span> */}
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {watchlist.name}
                    </h2>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-400">
                        {watchlist.movies.length} movies
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{dayjs.utc(watchlist.created_at).fromNow()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Pencil className="w-3 h-3" />
                        <span>{dayjs.utc(watchlist.updated_at).fromNow()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {}}
                  className="mt-5 justify-end bg-transparent border-none text-violet-400 text-sm font-medium cursor-pointer px-4 py-2 rounded-md transition-all duration-200 hover:bg-slate-800"
                >
                  See WatchList
                </button>
              </div>

              {/* Divider Line */}
              <div className="h-px bg-gray-600 mb-6" />

              {/* Movie Posters Grid */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {watchlist.movies.length !== 0 ? (
                  watchlist.movies.map((movie) => (
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
                      accessToken={undefined}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No movies in this watchlist yet.
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Empty State Message */}
          {watchlists.items.items.length === 0 && (
            <div className="text-center py-16 px-8 text-gray-400">
              <p className="text-lg mb-2">No watchlists yet</p>
              <p className="text-sm">
                Create your first watchlist to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
