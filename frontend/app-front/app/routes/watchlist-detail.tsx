import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import i18n from "i18n/i18n";

import { Badge } from "components/ui/badge";
import WatchListMovies from "components/ui/watchlist-movies";
import { Clock, Eye, Film, Pencil } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { getWatchList } from "services/api/flixy/server/watchlists";
import type { WatchListGet } from "services/api/flixy/types/watchlist";
import { getAccessToken } from "services/api/utils";
import type { ApiResponse } from "../../services/api/flixy/types/overall";
import type { Route } from "./+types/watchlist-detail";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export async function loader({ request, params }: Route.LoaderArgs) {
  let apiResponse: ApiResponse = {};

  const watchListId = params.watchListId;

  if (
    !watchListId ||
    watchListId.trim() === "" ||
    isNaN(Number(watchListId)) ||
    Number(watchListId) < 1
  ) {
    apiResponse.error = "Invalid watchlist ID";
    return apiResponse;
  }
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? `${DEFAULT_PAGE}`, 10);

  let watchlist: WatchListGet = {} as WatchListGet;

  try {
    watchlist = await getWatchList(
      watchListId,
      page,
      DEFAULT_PAGE_SIZE,
      request
    );

    console.log(`Watchlist ${watchListId}: `, watchlist);

    apiResponse.accessToken = await getAccessToken(request);

    apiResponse.data = watchlist;
    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /watchlist/:watchListId said: ", err.message);

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function WatchListsPage() {
  const apiResponse: ApiResponse = useLoaderData();

  dayjs.locale(i18n.language || "en");

  const [watchlist, setWatchlist] = useState<WatchListGet>(
    apiResponse.data || {}
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
              {watchlist.name}
            </h1>
            {watchlist.description ? (
              <p className="text-gray-300 mb-4">{watchlist.description}</p>
            ) : (
              <p className="italic text-gray-300 mb-4">
                No description so far.
              </p>
            )}

            <div className="flex flex-wrap gap-6 text-sm bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">
                  {watchlist.insights.total_movies} movies
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">
                  Created {dayjs.utc(watchlist.created_at).fromNow()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">
                  Updated {dayjs.utc(watchlist.updated_at).fromNow()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">Public</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              Movies in this Watchlist
            </h2>
            <WatchListMovies
              accessToken={String(apiResponse.accessToken)}
              isSeeWatchList={true}
              watchList={watchlist}
            />
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
                    {watchlist.insights.total_movies}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Watched</span>
                  <span className="text-white font-medium">
                    {watchlist.insights.total_watched_movies}{" "}
                    <span className="text-slate-300 text-sm">
                      (of {watchlist.insights.total_movies})
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    Average
                    <Badge className="ml-1 bg-yellow-400 text-black font-bold rounded-sm px-1.5 py-0.5">
                      IMDb
                    </Badge>{" "}
                    Rating
                  </span>
                  <span className="text-white font-medium">
                    {watchlist.insights.average_rating_imdb.toFixed(1)}{" "}
                    <Badge
                      variant="secondary"
                      className="bg-gray-700 text-gray-300"
                    >
                      {(watchlist.insights.average_rating_imdb / 2).toFixed(1)}
                      <Badge className="m-0 text-purple-400 font-bold rounded-sm px-0.5">
                        Flixy
                      </Badge>
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    <Link to={`/profile`}>
                      <span className="text-purple-400 font-bold hover:underline">
                        Your
                      </span>{" "}
                    </Link>
                    Rating
                  </span>
                  <span className="text-white font-medium">
                    {watchlist.insights.average_rating_user.toFixed(1)}{" "}
                    <Badge
                      variant="secondary"
                      className="bg-gray-700 text-gray-300"
                    >
                      {(watchlist.insights.average_rating_user * 2).toFixed(1)}
                      <Badge className="text-yellow-400 font-bold rounded-sm px-0.5">
                        IMDb
                      </Badge>
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Visibility</span>
                  <span className="text-white font-medium">Public</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>
              <div className="space-y-3 text-sm">
                {watchlist.activity.length !== 0 ? (
                  watchlist.activity.map(
                    (activity: any, index: number) =>
                      activity.action === "Add" && (
                        <div className="flex items-center gap-3" key={index}>
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <Link to={`/movies/${activity.target.id}`}>
                            <span className="text-slate-300">
                              Added{" "}
                              <span className="text-purple-400 font-bold hover:underline cursor-pointer">
                                {activity.target.title}
                              </span>{" "}
                              {dayjs.utc(activity.timestamp).fromNow()}.
                            </span>
                          </Link>
                        </div>
                      )
                  )
                ) : (
                  <p className="italic text-gray-300 mb-4">
                    No activity so far.
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
