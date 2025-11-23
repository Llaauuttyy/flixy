import type {
  WatchListCreate,
  WatchListDelete,
  WatchListEdit,
  WatchListGetMovie,
} from "../types/watchlist";

export async function getWatchLists(
  accessToken: string | undefined,
  page: number,
  size: number
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT +
      `/watchlists?page=${page}&size=${size}`,
    {
      headers: {
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

export async function handleWatchListCreation(
  accessToken: string | undefined,
  watchlistData: WatchListCreate
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT + `/watchlist`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(watchlistData),
    }
  );

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}

export async function handleWatchListEdition(
  accessToken: string | undefined,
  watchlistData: WatchListEdit
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT +
      `/watchlist/${watchlistData.watchlist_id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(watchlistData.data),
    }
  );

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}

export async function handleWatchListDeletion(
  accessToken: string | undefined,
  watchlistData: WatchListDelete
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT +
      `/watchlist/${watchlistData.watchlist_id}`,
    {
      method: "DELETE",
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

export async function handleGetMovieFromWatchList(
  accessToken: string | undefined,
  watchlistData: WatchListGetMovie
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT +
      `/watchlist/${watchlistData.watchlist_id}/movies/${watchlistData.movie_id}`,
    {
      method: "GET",
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

export async function handleSaveWatchlist(
  accessToken: string | undefined,
  watchlistId: number
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT + `/watchlist/${watchlistId}/save`,
    {
      method: "POST",
      headers: {
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
