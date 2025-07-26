import type { Page } from "./overall";

export interface ReviewCreation {
  movie_id: number;
  text: string;
  watch_date: Date;
  [key: string]: string | number | Date;
}

export interface ReviewGetData {
  user_name: string;
  movie_id: number;
  text: string;
  watch_date: Date;
  [key: string]: string | number | Date;
}

export interface ReviewsData {
  user_review?: ReviewGetData | undefined;
  reviews?: Page<ReviewGetData> | undefined;
  [key: string]: ReviewGetData | Page<ReviewGetData> | undefined;
}
