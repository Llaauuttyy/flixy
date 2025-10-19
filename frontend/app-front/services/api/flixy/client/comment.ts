import type { CommentCreation } from "../types/comment";

export async function handleCommentCreation(
  accessToken: string | undefined,
  commentData: CommentCreation
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT + `/comment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(commentData),
    }
  );

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}

export async function handleLikeComment(
  accessToken: string | undefined,
  commentId: number
) {
  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT + `/comment/${commentId}/like`,
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

  return response_json;
}
