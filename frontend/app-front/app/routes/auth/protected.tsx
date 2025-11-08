import { Outlet } from "react-router-dom";
import { handleRefreshToken } from "services/api/flixy/server/auth";
import { handleUserDataGet } from "services/api/flixy/server/user-data";
import {
  commitUserSession,
  getUserSession,
} from "../../session/sessions.server";
import type { Route } from "./+types/protected";

export async function loader({ request }: Route.LoaderArgs) {
  const {
    getAccessSession,
    getRefreshSession,
    commitAccessSession,
    commitRefreshSession,
  } = await import("../../session/sessions.server");
  const { redirect } = await import("react-router");

  const accessSession = await getAccessSession(request.headers.get("Cookie"));
  const refreshSession = await getRefreshSession(request.headers.get("Cookie"));
  const userDataSession = await getUserSession(request.headers.get("Cookie"));

  if (!accessSession.has("accessToken")) {
    const refreshToken = refreshSession.get("refreshToken");
    try {
      const {
        access_token,
        refresh_token,
        access_token_expiration_time,
        refresh_token_expiration_time,
      } = await handleRefreshToken({ refresh_token: refreshToken ?? null });
      const userDataResponse = await handleUserDataGet({
        request,
        token: access_token,
      });

      accessSession.set("accessToken", access_token);
      refreshSession.set("refreshToken", refresh_token);
      userDataSession.set("user", userDataResponse);

      return redirect("/", {
        headers: {
          "Set-Cookie": [
            await commitAccessSession(accessSession, {
              maxAge: access_token_expiration_time,
            }),
            await commitRefreshSession(refreshSession, {
              maxAge: refresh_token_expiration_time,
            }),
            await commitUserSession(userDataSession),
          ].join(", "),
        },
      });
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return redirect("/login");
    }
  }

  return null;
}

export default function ProtectedLayout() {
  return <Outlet />;
}
