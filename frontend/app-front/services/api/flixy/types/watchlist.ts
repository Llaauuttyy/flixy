import type { MovieDataGet } from "./movie";
import type { Page } from "./overall";

export interface WatchListCreate {
  name: string;
  description: string | null;
  private: boolean;
  movie_ids: number[];
  [key: string]: string | boolean | number[] | null;
}

export interface WatchListEditData {
  name?: string;
  description?: string | null;
  private: boolean;
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

export interface WatchListGetMovie {
  watchlist_id: number;
  movie_id: number;
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
  private: boolean;
  editable?: boolean;
  activity: WatchListActivity[];
  insights: WatchListInsights;
  created_at: string;
  updated_at: string;
}

export interface WatchLists {
  items: Page<WatchListFace>;
  total_watchlists: number;
  total_movies: number;
}

export interface WatchListFace {
  id: number;
  name: string;
  description: string;
  movies: Page<MovieDataGet>;
  editable?: boolean;
  saved_by_user: boolean;
  created_at: string;
  updated_at: string;
}
