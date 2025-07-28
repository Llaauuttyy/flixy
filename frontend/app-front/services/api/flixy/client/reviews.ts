import type { ReviewCreation } from "../types/review";

export async function handleReviewCreation(
  accessToken: string | undefined,
  reviewData: ReviewCreation
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT + `/review`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reviewData),
    }
  );

  const response_json = await response.json();

  console.log();
  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}
