import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // rutas públicas.
  route("register", "routes/register.tsx"),
  
  // chequea si ya está logueado.
  route("", "routes/auth/logged.tsx", {}, [
    route("login", "routes/login.tsx"),
  ]),

  // layout de rutas protegidas.
  route("", "routes/auth/protected.tsx", {}, [
    index("routes/home.tsx"),
    route("movies", "routes/movies.tsx"),
    route("movies/:movieId", "routes/movie-detail.tsx"),
    route("settings", "routes/settings.tsx"),

    route("signout", "routes/auth/signout.tsx"),
  ]),
] satisfies RouteConfig;
