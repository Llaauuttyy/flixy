import { redirect } from "react-router";
import { destroySession, getSession } from "../../session/sessions.server";
import type { Route } from "./+types/signout";

export async function action({request,}: Route.ActionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    );
  
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
  }

export default function Logout() {
  return null;
}


