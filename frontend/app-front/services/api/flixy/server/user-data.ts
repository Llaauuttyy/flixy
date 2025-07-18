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
