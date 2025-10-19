import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Clock, Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom";

import relativeTime from "dayjs/plugin/relativeTime";

import "dayjs/locale/en";
import "dayjs/locale/es";
import i18n from "i18n/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { handleWatchListDeletion } from "services/api/flixy/client/watchlists";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";
import type { WatchListDelete } from "services/api/flixy/types/watchlist";
import { Button } from "../button";
import { ConfirmationBox } from "../confirmation-box";
import WatchListMovies from "./watchlist-movies";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface WatchList {
  id: number;
  name: string;
  description: string;
  movies: Page<MovieDataGet>;
  // icon: string;
  created_at: string;
  updated_at: string;
}

export default function WatchList({
  accessToken,
  watchlist,
  onDelete,
}: {
  accessToken: string;
  watchlist: WatchList;
  onDelete(watchlistId: number): void;
}) {
  dayjs.locale(i18n.language || "en");

  const { t } = useTranslation();

  const [apiResponse, setApiDeleteResponse] = useState<ApiResponse>({});
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmationBox = (value: boolean) => {
    if (value) {
      handleDeleteWatchList();
    }
  };

  const handleDeleteWatchList = async () => {
    setIsDeleting(true);

    let apiResponse: ApiResponse = {};

    const watchListDelete: WatchListDelete = {
      watchlist_id: watchlist.id,
    };

    try {
      await handleWatchListDeletion(accessToken, watchListDelete);

      onDelete(watchlist.id);
    } catch (err: Error | any) {
      console.log("API DELETE /watchlist/:watchListId ", err.message);

      if (err instanceof TypeError) {
        apiResponse.error = t("exceptions.service_error");
        setApiDeleteResponse(apiResponse);
      }

      apiResponse.error = err.message;
      setApiDeleteResponse(apiResponse);
    }

    setIsDeleting(false);
  };

  return (
    <div key={watchlist.id} className="mb-12">
      {/* Watchlist Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {watchlist.name}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-gray-400">
                {watchlist.movies.total}{" "}
                {t("watchlists.general_insights.movies")}
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
        <div className="flex item-center">
          <Link to={`/watchlists/${watchlist.id}`}>
            <Button
              onClick={() => {}}
              className="mt-5 justify-end bg-transparent hover:underline border-none text-violet-400 text-sm font-medium cursor-pointer px-4 py-2 rounded-md transition-all duration-200 hover:bg-slate-800"
            >
              {t("watchlists.see_watchlist")}
            </Button>
          </Link>
          <ConfirmationBox
            isAccepted={(value) => handleConfirmationBox(value)}
            title={t("confirmation_box.watchlist.title")}
            subtitle={t("confirmation_box.watchlist.subtitle")}
            cancelText={t("confirmation_box.watchlist.cancel")}
            acceptText={t("confirmation_box.watchlist.accept")}
          >
            <Button
              disabled={isDeleting}
              className="mt-5 rounded-lg border bg-card text-card-foreground shadow-sm border-slate-700 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50"
            >
              <Trash size={30} color="red" />
            </Button>
          </ConfirmationBox>
        </div>
      </div>

      {/* Divider Line */}
      <div className="h-px bg-gray-600 mb-6" />
      {apiResponse.error && (
        <p className="text-red-400 mb-4">{apiResponse.error}</p>
      )}

      {/* Movie Posters Grid */}
      <WatchListMovies accessToken={accessToken} watchList={watchlist} />
    </div>
  );
}
