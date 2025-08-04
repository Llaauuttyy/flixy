import type { Page } from "./overall";

export interface ReviewCreation {
  movie_id: number;
  rating?: number;
  text?: string;
  watch_date?: Date;
  [key: string]: string | number | Date | undefined;
}

export interface ReviewDataGet {
  id: number;
  user_name: string;
  movie_id: number;
  text: string;
  watch_date: Date;
  updated_at: Date;
  [key: string]: string | number | Date;
}

export interface ReviewsData {
  user_review?: ReviewDataGet | undefined;
  reviews?: Page<ReviewDataGet> | undefined;
  [key: string]: ReviewDataGet | Page<ReviewDataGet> | undefined;
}
