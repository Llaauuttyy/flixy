import type { MovieSetRating } from "../types/movie";

export async function setMovieRating(
  accessToken: string | undefined,
  movieData: MovieSetRating
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT + `/movie/rate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(movieData),
    }
  );

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}
