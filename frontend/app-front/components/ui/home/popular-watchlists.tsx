import type { WatchListFace } from "services/api/flixy/types/watchlist";
import WatchList from "../watchlist/watchlist";

interface WatchLists {
  items: {
    items: WatchListFace[];
  };
  total_movies: number;
  total_watchlists: number;
}

interface PopularWatchListsProps {
  watchlists: WatchLists;
  accessToken: string | undefined;
}

export function PopularWatchLists({
  watchlists,
  accessToken,
}: PopularWatchListsProps) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="p-6 pt-0">
        {watchlists.items.items.length > 0 && (
          <div>
            {watchlists.items.items.slice(0, 5).map((watchlist) => (
              <WatchList
                key={watchlist.id}
                accessToken={String(accessToken)}
                watchlist={watchlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
