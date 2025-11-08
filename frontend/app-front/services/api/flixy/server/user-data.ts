import { getAccessToken } from "../../utils";

interface UserDataGetProps {
  request: Request;
  token?: string;
  userId?: number;
}

export async function handleUserDataGet({
  request,
  token,
  userId,
}: UserDataGetProps) {
  token = token || (await getAccessToken(request));
  const idParam = userId ? `?id=${userId}` : "";

  const response = await fetch(process.env.VITE_API_URL + `/user${idParam}`, {
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

export async function getUserInsights(request: Request, id?: number) {
  const token = await getAccessToken(request);
  const idParam = id ? `?id=${id}` : "";

  const response = await fetch(
    process.env.VITE_API_URL + `/user/insights${idParam}`,
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

export async function searchUsers(
  query: string,
  page: number,
  size: number,
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL +
      `/users?search_query=${query}&page=${page}&size=${size}`,
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

export async function getUserAchievements(request: Request) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL + `/user/achievements`,
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

export async function getUserFollowers(
  page: number,
  size: number,
  request: Request,
  id?: number
) {
  const token = await getAccessToken(request);
  const idParam = id ? `&id=${id}` : "";

  const response = await fetch(
    process.env.VITE_API_URL +
      `/user/followers?page=${page}&size=${size}${idParam}`,
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

export async function getUserFollowing(
  page: number,
  size: number,
  request: Request,
  id?: number
) {
  const token = await getAccessToken(request);
  const idParam = id ? `&id=${id}` : "";

  const response = await fetch(
    process.env.VITE_API_URL +
      `/user/following?page=${page}&size=${size}${idParam}`,
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
