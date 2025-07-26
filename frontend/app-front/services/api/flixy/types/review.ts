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
