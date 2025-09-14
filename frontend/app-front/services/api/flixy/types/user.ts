import type { MovieGenre } from "./movie";
import type { ReviewDataGet } from "./review";

export interface UserDataGet {
  error?: string | null;
  name: string;
  username: string;
  email: string;
  accessToken?: string | undefined;
  [key: string]: string | null | undefined;
}

export interface UserDataChange {
  error?: string | null;
  success?: string | null;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  [key: string]: string | null | undefined;
}

export type PasswordData = {
  currentPassword: FormDataEntryValue | null;
  newPassword: FormDataEntryValue | null;
};

export interface UserInsights {
  id: number;
  genres: MovieGenre[];
  achievements: UserAchievement[];
  total_reviews: number;
  total_ratings: number;
  total_movies_watched: number;
  total_time_watched: number;
  total_likes: number;
  most_liked_review: ReviewDataGet | null;
  total_average_rating: number;
  reviewed_movies_percentage: number;
}

export interface UserAchievement {
  name: string;
  description: string;
  icon_name: string;
  color: string;
  unlocked: boolean;
  unlocked_at: Date;
}
