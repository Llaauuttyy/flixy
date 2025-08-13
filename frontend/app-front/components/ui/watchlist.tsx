import { Clock, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
// import { Pagination } from "components/ui/pagination";
// import { useTranslation } from "react-i18next";
// import { useFetcher, useLoaderData } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
// import type { Route } from "./+types/movies";

import relativeTime from "dayjs/plugin/relativeTime";

import "dayjs/locale/en";
import "dayjs/locale/es";
import i18n from "i18n/i18n";
import { Button } from "./button";
import WatchListMovies from "./watchlist-movies";

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

export default function WatchList({
  accessToken,
  watchlist,
}: {
  accessToken: string;
  watchlist: WatchList;
}) {
  dayjs.locale(i18n.language || "en");

  return (
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
        <Link to={`/watchlists/${watchlist.id}`}>
          <Button
            onClick={() => {}}
            className="mt-5 justify-end bg-transparent border-none text-violet-400 text-sm font-medium cursor-pointer px-4 py-2 rounded-md transition-all duration-200 hover:bg-slate-800"
          >
            See WatchList
          </Button>
        </Link>
      </div>

      {/* Divider Line */}
      <div className="h-px bg-gray-600 mb-6" />

      {/* Movie Posters Grid */}
      <WatchListMovies accessToken={accessToken} watchlist={watchlist} />
    </div>
  );
}
