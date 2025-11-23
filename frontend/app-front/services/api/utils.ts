import { getAccessSession, getUserSession } from "~/session/sessions.server";
import type { UserDataGet } from "./flixy/types/user";

export const getAccessToken = async (
  request: Request
): Promise<string | undefined> => {
  const session = await getAccessSession(request.headers.get("Cookie"));
  return session.get("accessToken");
};

export const getCachedUserData = async (
  request: Request
): Promise<UserDataGet | undefined> => {
  const session = await getUserSession(request.headers.get("Cookie"));
  return session.get("user");
};
