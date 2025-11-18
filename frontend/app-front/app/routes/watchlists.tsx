import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Film, Plus, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import { getWatchLists } from "services/api/flixy/server/watchlists";
import type { ApiResponse, Page } from "../../services/api/flixy/types/overall";
import type { Route } from "./+types/movies";

import { Button } from "components/ui/button";
import { Pagination } from "components/ui/pagination";
import WatchList from "components/ui/watchlist/watchlist";
import WatchListCreator from "components/ui/watchlist/watchlist-creator";
import "dayjs/locale/en";
import "dayjs/locale/es";
import { useTranslation } from "react-i18next";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import { getAccessToken, getCachedUserData } from "services/api/utils";

interface WatchListFace {
  id: number;
  name: string;
  description: string;
  movies: Page<MovieDataGet>;
  // icon: string;
  created_at: string;
  updated_at: string;
}

interface WatchLists {
  items: {
    items: WatchListFace[];
  };
  total_movies: number;
  total_watchlists: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 6;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? `${DEFAULT_PAGE}`, 10);

  let apiResponse: ApiResponse = {};

  let watchlists: WatchLists = {} as WatchLists;

  try {
    watchlists = await getWatchLists(page, DEFAULT_PAGE_SIZE, request);

    apiResponse.accessToken = await getAccessToken(request);

    apiResponse.data = { watchlists, user: await getCachedUserData(request) };
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

export default function WatchListsPage() {
  const { t } = useTranslation();
  const apiResponse: ApiResponse = useLoaderData();
  const fetcher = useFetcher();

  const [isCreation, setIsCreation] = useState(false);

  const [watchlists, setWatchlists] = useState<Page<WatchListFace>>(
    fetcher.data?.data?.watchlists.items ??
      apiResponse.data?.watchlists.items ?? {
        items: [],
        total: 0,
        page: 1,
        size: 0,
        pages: 0,
      }
  );

  let [newWatchLists, setNewWatchLists] = useState<WatchListFace[]>([]);

  const [watchListsData, setWatchListsData] = useState({
    movies: apiResponse?.data?.watchlists?.total_movies
      ? apiResponse?.data?.watchlists?.total_movies
      : 0,
    watchlists: apiResponse?.data?.watchlists?.total_watchlists
      ? apiResponse?.data?.watchlists?.total_watchlists
      : 0,
  });

  useEffect(() => {
    if (fetcher.data?.data.items) {
      setWatchlists(fetcher.data.data.items);
    }
  }, [fetcher.data]);

  function handleCreation() {
    setIsCreation(true);
  }

  function handleCancelCreation() {
    setIsCreation(false);
  }

  function handleWatchListCreation(watchlist: WatchListFace) {
    setNewWatchLists((prevWatchlists) => [watchlist, ...prevWatchlists]);
    setWatchListsData((prevData) => ({
      ...prevData,
      watchlists: prevData.watchlists + 1,
      movies: prevData.movies + watchlist.movies.total,
    }));
    setIsCreation(false);
  }

  function handleWatchListDeletion(watchlist_id: number) {
    setNewWatchLists((prevWatchlists) =>
      prevWatchlists.filter((wl) => wl.id !== watchlist_id)
    );
    setWatchListsData((prevData) => ({
      ...prevData,
      watchlists: prevData.watchlists - 1,
      movies:
        prevData.movies -
        (watchlists.items
          ? watchlists.items.find((wl) => wl.id === watchlist_id)?.movies
              .total || 0
          : 0),
    }));
    setWatchlists((prevWatchlists) => ({
      ...prevWatchlists,
      items: (prevWatchlists.items ?? []).filter(
        (wl) => wl.id !== watchlist_id
      ),
    }));
  }

  function handleWatchListSaved(saved: boolean) {
    if (!saved) {
      window.location.reload();
    }
  }

  function getCreationButtons() {
    return (
      <>
        {!isCreation && (
          <Button
            onClick={handleCreation}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("watchlists.create_button")}
          </Button>
        )}
        {isCreation && (
          <Button
            onClick={handleCancelCreation}
            variant={"outline"}
            className="ml-2 hover:bg-red-700 hover:text-white text-red-500 border-red-500 disabled:opacity-50"
          >
            {t("watchlists.cancel_button")}
          </Button>
        )}
      </>
    );
  }

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

  if (
    (!watchlists.items || watchlists.items.length === 0) &&
    newWatchLists.length === 0
  ) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <HeaderFull />

          <main className="overflow-auto w-full mx-auto py-6 px-6 md:px-6">
            <div className="flex justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {t("watchlists.title")}
                </h1>
                <p className="text-gray-300">{t("watchlists.subtitle")}</p>
              </div>
              <div className="flex justify-end mb-6">
                {getCreationButtons()}
              </div>
            </div>
            <div className="h-px bg-gray-600 mt-2 mb-4" />
            {isCreation && (
              <WatchListCreator
                accessToken={String(apiResponse.accessToken)}
                onCreation={handleWatchListCreation}
              />
            )}
            <div className="flex justify-center mb-6">
              <p className="text-gray-400 mb-6">
                {t("watchlists.no_watchlists")}
              </p>
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
          <h1 className="text-3xl font-bold text-white mb-2">
            {t("watchlists.title")}
          </h1>
          <p className="text-gray-300">{t("watchlists.subtitle")}</p>
          <div className="flex justify-between">
            {/* <div className="flex justify-end mb-6"> */}
            {/* </div> */}
            <div className="flex justify-start gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Film className="w-4 h-4 text-violet-400" />
                <span>
                  {watchListsData.movies}{" "}
                  {t("watchlists.general_insights.movies")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Star className="w-4 h-4 text-violet-400" />
                <span>
                  {watchListsData.watchlists}{" "}
                  {t("watchlists.general_insights.watchlists")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <span>{t("watchlists.general_insights.last_activity")}</span>
              </div>
            </div>
            <div className="mt-3 h-px bg-gray-600 mb-6" />
            {getCreationButtons()}
          </div>
          <div className="h-px bg-gray-600 mt-2 mb-4" />
          {isCreation && (
            <WatchListCreator
              accessToken={String(apiResponse.accessToken)}
              onCreation={handleWatchListCreation}
            />
          )}
        </div>

        {/* Watchlists Content */}
        <div className="p-6 pt-0">
          {newWatchLists.length > 0 && (
            <div>
              {newWatchLists.map((watchlist) => (
                <WatchList
                  key={watchlist.id}
                  accessToken={String(apiResponse.accessToken)}
                  watchlist={watchlist}
                  onDelete={handleWatchListDeletion}
                />
              ))}
            </div>
          )}
          {watchlists.items && watchlists.items.length !== 0 && (
            <Pagination
              itemsPage={watchlists}
              onPageChange={(page: number) => {
                fetcher.load(`/watchlists?page=${page}`);
                setNewWatchLists([]);
              }}
            >
              {watchlists.items.map((watchlist) => (
                <WatchList
                  accessToken={String(apiResponse.accessToken)}
                  watchlist={watchlist}
                  onDelete={handleWatchListDeletion}
                  onSaved={handleWatchListSaved}
                />
              ))}
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
