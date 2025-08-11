export interface WatchListCreate {
  name: string;
  description: string | null;
  movie_ids: number[];
  [key: string]: string | number[] | null;
}

export interface WatchListMovieAdd {
  watchlist_id: number;
  movie_id: number;
  [key: string]: number;
}
