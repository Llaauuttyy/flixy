import type { ReviewsData } from "./review";

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
  access_token?: string | undefined;
  [key: string | number]: string | number | null | undefined;
}

export interface MovieSetRating {
  id: number;
  rating: number;
  [key: string | number]: string | number | null | undefined;
}

export interface MovieOverallData {
  movie: MovieDataGet;
  reviews: ReviewsData;
  [key: string]: null | undefined | MovieDataGet | ReviewsData;
}

export interface MovieGenre {
  name: string;
  average_rating: number;
  movies_watched: number;
  [key: string]: string | number;
}
