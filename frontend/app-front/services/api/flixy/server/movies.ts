import { getAccessToken } from "../../utils";

interface Order {
  column: string | null;
  way: string | null;
}

const getOrderParams = (order?: Order) => {
  let orderParams: string[] = [];

  if (order) {
    if (order.column) {
      orderParams.push(`order_column=${order.column}`);
    }
    if (order.way) {
      orderParams.push(`order_way=${order.way}`);
    }
  }

  return orderParams.join("&");
};

const getGenresParams = (genres: string[] | null) => {
  if (!genres) {
    return "";
  }

  return genres.map((g) => `genres=${g}`).join("&");
};

export async function getMovies(
  page: number,
  size: number,
  order: Order,
  genres: string[] | null,
  request: Request
) {
  const token = await getAccessToken(request);

  let orderParams = getOrderParams(order);
  let genresParams = getGenresParams(genres);

  const response = await fetch(
    process.env.VITE_API_URL +
      `/movies?page=${page}&size=${size}&${orderParams}&${genresParams}`,
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

export async function searchMovies(
  query: string,
  page: number,
  size: number,
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL +
      `/movies?search_query=${query}&page=${page}&size=${size}`,
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

export async function getRecommendations(
  page: number,
  size: number,
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL + `/recommendations?page=${page}&size=${size}`,
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
