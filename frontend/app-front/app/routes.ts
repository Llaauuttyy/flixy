import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  // rutas públicas.
  route("register", "routes/register.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),

  // chequea si ya está logueado.
  route("", "routes/auth/logged.tsx", {}, [route("login", "routes/login.tsx")]),

  // layout de rutas protegidas.
  route("", "routes/auth/protected.tsx", {}, [
    index("routes/home.tsx"),
    route("movies", "routes/movies.tsx"),
    route("movies/:movieId", "routes/movie-detail.tsx"),

    route("watchlists", "routes/watchlists.tsx"),
    route("watchlists/:watchListId", "routes/watchlist-detail.tsx"),

    route("profile", "routes/profile.tsx"),
    route("search", "routes/search.tsx"),

    route("social", "routes/social.tsx"),

    route("reviews", "routes/reviews.tsx"),
    route("reviews/:reviewId", "routes/review-detail.tsx"),

    route("recommendations", "routes/recommendations.tsx"),
    route("settings", "routes/settings.tsx"),
    route("signout", "routes/auth/signout.tsx"),
  ]),
] satisfies RouteConfig;
