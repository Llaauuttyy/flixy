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
  [key: string | number]: string | number | null | undefined;
}
