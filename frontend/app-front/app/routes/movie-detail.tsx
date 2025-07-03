// import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MovieCard } from "components/ui/movie-card"
import { SidebarNav } from "components/ui/sidebar-nav"
import { HeaderFull } from "components/ui/header-full"

import type { Route } from "./+types/login";
import { getSession, commitSession, destroySession } from "../session/sessions.server";
import { redirect } from "react-router";

import { useParams } from "react-router-dom"

import { useLocation } from "react-router-dom"

export async function loader({request}: Route.LoaderArgs) {
  const session = await getSession(
      request.headers.get("Cookie")
  );

  if (session.has("accessToken")) {
      // Me quedo en /home
      return null;
  }

  return redirect("/login", {
      headers: {
          "Set-Cookie": await commitSession(session),
      },
  })
}

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


export default function MovieDetail() {
  const { movieId } = useParams()

  // const location = useLocation()
  // const movie = location.state?.movie

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold">Movie details</h1>
      {/* <p>Title: {movie.title}</p> */}
      <p>Movie ID: {movieId}</p>
    </div>
  )
}
