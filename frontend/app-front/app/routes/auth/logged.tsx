import { Outlet } from "react-router-dom";
import type { Route } from "./+types/logged";

export async function loader({ request }: Route.LoaderArgs) {
  const { getAccessSession } = await import("../../session/sessions.server");
  const { redirect } = await import("react-router");
  const url = new URL(request.url);

  const session = await getAccessSession(request.headers.get("Cookie"));

  if (url.pathname === "/login" && session.has("accessToken")) {
    return redirect("/");
  }

  return null;
}

export default function ProtectedLayout() {
  return <Outlet />;
}
