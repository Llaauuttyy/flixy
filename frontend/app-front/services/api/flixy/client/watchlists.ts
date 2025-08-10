import type { WatchListMovieAdd } from "../types/watchlist";

export async function handleAddMovieToWatchList(
  accessToken: string | undefined,
  watchlistData: WatchListMovieAdd
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT +
      `/watchlist/${watchlistData.watchlist_id}/movie/${watchlistData.movie_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}
