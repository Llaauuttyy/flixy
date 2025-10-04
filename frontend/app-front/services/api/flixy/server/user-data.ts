import { getAccessToken } from "../../utils";

export async function handleUserDataGet(request: Request) {
  const token = await getAccessToken(request);

  const response = await fetch(process.env.VITE_API_URL + "/user", {
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

export async function getUserInsights(request: Request) {
  const token = await getAccessToken(request);

  const response = await fetch(process.env.VITE_API_URL + `/user/insights`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL + `/user/followers?page=${page}&size=${size}`,
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
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL + `/user/following?page=${page}&size=${size}`,
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
