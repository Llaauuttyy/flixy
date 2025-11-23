import { getAccessToken } from "services/api/utils";

export async function getCommentsByReview(
  review_id: string | undefined,
  page: number,
  size: number,
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(
    process.env.VITE_API_URL +
      `/comments?review_id=${review_id}&page=${page}&size=${size}`,
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
