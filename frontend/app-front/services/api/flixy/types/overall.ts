export interface ApiResponse {
  error?: string | null;
  data?: any | null;
  success?: string | null;
  accessToken?: string | null;
  [key: string]: string | null | undefined;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export type Dictionary<T> = {
  [key: string]: T;
};
