export interface WatchListCreate {
  name: string;
  description: string | null;
  movie_ids: number[];
  [key: string]: string | number[] | null;
}

export interface WatchListEditData {
  name?: string;
  description?: string | null;
  movie_ids_to_add?: number[];
  movie_ids_to_delete?: number[];
}

export interface WatchListEdit {
  watchlist_id: number;
  data: WatchListEditData;
  [key: string]: number | WatchListEditData;
}
