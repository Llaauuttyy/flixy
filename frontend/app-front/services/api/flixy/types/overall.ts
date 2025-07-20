export interface ApiResponse {
  error?: string | null;
  data?: any | null;
  success?: string | null;
  accessToken?: string | null;
  [key: string]: string | null | undefined;
}
