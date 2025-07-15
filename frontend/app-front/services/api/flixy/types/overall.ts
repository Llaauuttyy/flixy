export interface ApiResponse {
  error?: string | null
  success?: string | null;
  [key: string]: string | null | undefined;
}

