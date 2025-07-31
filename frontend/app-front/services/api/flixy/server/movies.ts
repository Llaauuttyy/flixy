import { getAccessToken } from "../../utils";

export async function getMovies(page: number, size: number, request: Request) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL + `/movies?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}

export async function getMovieData(
  request: Request,
  movieId: string | undefined
) {
  const token = await getAccessToken(request);

  const response = await fetch(process.env.VITE_API_URL + `/movie/${movieId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}
