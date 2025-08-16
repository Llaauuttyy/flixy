import type { MovieDataGet } from "./movie";
import type { Page } from "./overall";

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

export interface WatchListDelete {
  watchlist_id: number;
  [key: string]: number;
}

export interface WatchListInsights {
  total_movies: number;
  total_watched_movies: number;
  average_rating_imdb: number;
  average_rating_user: number;
}

export interface WatchListActivity {
  action: string;
  target: string;
  timestamp: string;
}

export interface WatchListGet {
  id: number;
  name: string;
  description: string | null;
  movies: Page<MovieDataGet>;
  activity: WatchListActivity[];
  insights: WatchListInsights;
  created_at: string;
  updated_at: string;
}
