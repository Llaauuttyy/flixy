import { redirect } from "react-router";
import {
  destroyAccessSession,
  destroyRefreshSession,
  destroyUserSession,
  getAccessSession,
  getRefreshSession,
  getUserSession,
} from "../../session/sessions.server";
import type { Route } from "./+types/signout";

export async function action({ request }: Route.ActionArgs) {
  const accessSession = await getAccessSession(request.headers.get("Cookie"));
  const refreshSession = await getRefreshSession(request.headers.get("Cookie"));
  const userDataSession = await getUserSession(request.headers.get("Cookie"));

  return redirect("/login", {
    headers: {
      "Set-Cookie": [
        await destroyAccessSession(accessSession),
        await destroyRefreshSession(refreshSession),
        await destroyUserSession(userDataSession),
      ].join(", "),
    },
  });
}

export default function Logout() {
  return null;
}
