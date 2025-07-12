import { getSession } from "~/session/sessions.server";

export const getAccessToken = async (
  request: Request
): Promise<string | undefined> => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("accessToken");
};
