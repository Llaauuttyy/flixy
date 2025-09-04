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

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}

export async function handleReviewDeleteText(
  accessToken: string | undefined,
  reviewId: number
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT + `/review/${reviewId}/text`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }
}

export async function handleReviewDelete(
  accessToken: string | undefined,
  reviewId: number
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT + `/review/${reviewId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }
}

export async function handleLikeReview(
  accessToken: string | undefined,
  reviewId: number
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT + `/review/${reviewId}/like`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }
}
