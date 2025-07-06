import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  route("movies", "routes/movies.tsx"),
  route("movies/:movieId", "routes/movie-detail.tsx"),

  route("settings", "routes/settings.tsx"),
] satisfies RouteConfig;
