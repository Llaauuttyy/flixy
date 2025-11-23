import type { CommentDataGet } from "./comment";
import type { MovieDataGet } from "./movie";
import type { Page } from "./overall";
import type { UserAchievement } from "./user";

export interface ReviewCreation {
  movie_id: number;
  rating?: number;
  text?: string;
  watch_date?: Date;
  [key: string]: string | number | Date | undefined;
}

export interface ReviewDataGet {
  id: number;
  name: string;
  user_name: string;
  user_id: number;
  movie_id: number;
  rating: number | null;
  text: string | null;
  watch_date: Date;
  likes: number;
  liked_by_user: boolean;
  updated_at: Date;
  movie: MovieDataGet;
  achievements: UserAchievement[];
  comments: CommentDataGet[];
  [key: string]:
    | string
    | number
    | Date
    | boolean
    | MovieDataGet
    | UserAchievement[]
    | CommentDataGet[]
    | null
    | undefined;
}

export interface ReviewsData {
  user_review?: ReviewDataGet | undefined;
  reviews?: Page<ReviewDataGet> | undefined;
  [key: string]: ReviewDataGet | Page<ReviewDataGet> | undefined;
}
