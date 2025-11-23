import { getAccessToken } from "../../utils";

export async function getReviewsData(
  page: number,
  size: number,
  movie_id: string | undefined,
  request: Request
) {
  const token = await getAccessToken(request);

  console.log("token", token);

  console.log("1");

  const response = await fetch(
    process.env.VITE_API_URL +
      `/review?movie_id=${movie_id}&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("2");
  console.log("response_json", response);

  const response_json = await response.json();

  console.log(response_json.detail);

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}

export async function getAllUserReviewsData(
  page: number,
  size: number,
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL + `/review?page=${page}&size=${size}`,
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

export async function getLatestReviews(
  following: boolean,
  page: number,
  size: number,
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL +
      `/review/text/latest?following=${following}&page=${page}&size=${size}`,
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

export async function getLatestRatings(
  following: boolean,
  page: number,
  size: number,
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL +
      `/review/rating/latest?following=${following}&page=${page}&size=${size}`,
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

export async function getTopMovies(request: Request) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL + `/review/rating/top`,
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

export async function getReviewData(
  review_id: string | undefined,
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL + `/review/${review_id}`,
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
