import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getWatchLists } from "services/api/flixy/server/watchlists";
import type { ApiResponse } from "../../services/api/flixy/types/overall";
import type { Route } from "./+types/movies";

import WatchListMovies from "components/ui/watchlist-movies";
import "dayjs/locale/en";
import "dayjs/locale/es";
import { Calendar, Clock, Eye, Film } from "lucide-react";
import { getAccessToken } from "services/api/utils";

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
    items: WatchListFace[];
  };
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 4;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? `${DEFAULT_PAGE}`, 10);

  let apiResponse: ApiResponse = {};

  let watchlists: WatchLists = {} as WatchLists;

  try {
    watchlists = await getWatchLists(page, DEFAULT_PAGE_SIZE, request);

    apiResponse.accessToken = await getAccessToken(request);

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

export default function WatchListsPage({
  watchlist_id,
}: {
  watchlist_id: number;
}) {
  const apiResponse: ApiResponse = useLoaderData();
  const [isCreation, setIsCreation] = useState(false);
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

  const currentWatchlist = {
    id: 1,
    name: "My Favorite Sci-Fi",
    description: "A collection of my all-time favorite sci-fi movies.",
    movieCount: 3,
    createdDate: "2024-01-15",
    lastUpdated: "2024-02-10",
    isPublic: true,
    movies: [
      { id: 101, title: "Interstellar", rating: 9 },
      { id: 102, title: "The Matrix", rating: 8.5 },
      { id: 103, title: "Arrival", rating: 8 },
    ],
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <SidebarNav />

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="sticky top-0 z-50 bg-gray-900 shadow-lg">
          <HeaderFull />
        </div>

        <main className="flex-1 p-6 space-y-8">
          <section>
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentWatchlist.name}
            </h1>
            <p className="text-gray-300 mb-4">{currentWatchlist.description}</p>

            <div className="flex flex-wrap gap-6 text-sm bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">
                  {currentWatchlist.movieCount} movies
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">
                  Created {currentWatchlist.createdDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">
                  Updated {currentWatchlist.lastUpdated}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">
                  {currentWatchlist.isPublic ? "Public" : "Private"}
                </span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-400" />
                Watchlist Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Movies</span>
                  <span className="text-white font-medium">
                    {currentWatchlist.movieCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Average Rating</span>
                  <span className="text-white font-medium">
                    {currentWatchlist.movies.filter((m) => m.rating > 0)
                      .length > 0
                      ? (
                          currentWatchlist.movies.reduce(
                            (acc, m) => acc + m.rating,
                            0
                          ) /
                          currentWatchlist.movies.filter((m) => m.rating > 0)
                            .length
                        ).toFixed(1)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Visibility</span>
                  <span className="text-white font-medium">
                    {currentWatchlist.isPublic ? "Public" : "Private"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-300">
                    Added "Mimic" {currentWatchlist.lastUpdated}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                  <span className="text-slate-300">
                    Updated description 2 hours ago
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                  <span className="text-slate-300">
                    Made watchlist public 1 day ago
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              Movies in this Watchlist
            </h2>
            <WatchListMovies
              accessToken={String(apiResponse.accessToken)}
              watchlist={watchlists.items.items[0]}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
