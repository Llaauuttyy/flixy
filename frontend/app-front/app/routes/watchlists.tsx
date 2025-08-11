import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Film, Plus, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getWatchLists } from "services/api/flixy/server/watchlists";
import type { ApiResponse } from "../../services/api/flixy/types/overall";
import type { Route } from "./+types/movies";

import { Button } from "components/ui/button";
import WatchList from "components/ui/watchlist";
import WatchListCreator from "components/ui/watchlist-creator";
import "dayjs/locale/en";
import "dayjs/locale/es";
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

export default function WatchListsPage() {
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

  function handleCreation() {
    setIsCreation(true);
  }

  function handleCancelCreation() {
    setIsCreation(false);
  }

  function handleWatchListCreation(watchlist: WatchListFace) {
    setWatchlists((prevWatchlists) => ({
      items: {
        items: [watchlist, ...prevWatchlists.items.items],
      },
    }));
    setIsCreation(false);
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
            Create WatchList
          </Button>
        )}
        {isCreation && (
          <Button
            onClick={handleCancelCreation}
            variant={"outline"}
            className="ml-2 hover:bg-red-700 hover:text-white text-red-500 border-red-500 disabled:opacity-50"
          >
            Cancel
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

  if (watchlists.items.items.length === 0) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <HeaderFull />

          <main className="overflow-auto w-full mx-auto py-6 px-6 md:px-6">
            <div className="flex justify-end mb-6">{getCreationButtons()}</div>
            <div className="h-px bg-gray-600 mt-2 mb-4" />
            {isCreation && (
              <WatchListCreator
                accessToken={String(apiResponse.accessToken)}
                onCreation={handleWatchListCreation}
              />
            )}
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
          {watchlists.items.items.map((watchlist) => (
            <WatchList
              accessToken={String(apiResponse.accessToken)}
              watchlist={watchlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
