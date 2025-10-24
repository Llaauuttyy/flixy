import type { ReviewsData } from "./review";
import type { UserDataGet } from "./user";

export interface MovieDataGet {
  error?: string | undefined;
  id: number | undefined;
  title: string | undefined;
  year: number | undefined;
  imdb_rating: number | undefined;
  genres: string | undefined;
  countries: string | undefined;
  duration: number | undefined;
  cast: string | undefined;
  directors: string | undefined;
  writers: string | undefined;
  plot: string | undefined;
  logo_url: string | undefined;
  youtube_trailer_id?: string | undefined;
  is_trailer_reliable?: boolean | undefined;
  flixy_rating: number | undefined;
  user_rating?: number;
  access_token?: string | undefined;
  [key: string | number]: string | number | null | boolean | undefined;
}

export interface MovieOverallData {
  movie: MovieDataGet;
  reviews: ReviewsData;
  user?: UserDataGet;
  [key: string]: null | undefined | MovieDataGet | ReviewsData | UserDataGet;
}

export interface MovieGenre {
  name: string;
  average_rating: number;
  movies_watched: number;
  [key: string]: string | number;
}
