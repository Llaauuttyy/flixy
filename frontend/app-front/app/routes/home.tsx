import { HeaderFull } from "components/ui/header-full";
import { FeaturedMovie } from "components/ui/home/featured-movie";
import { GenreSpotlight } from "components/ui/home/genre-spotlight";
import { GetRecommendations } from "components/ui/home/get-recommendations";
import { LastUserPicks } from "components/ui/home/last-user-picks";
import { PopularWatchLists } from "components/ui/home/popular-watchlists";
import { RecentReviews } from "components/ui/home/recent-reviews";
import { ShareYourThoughts } from "components/ui/home/share-your-thoughts";
import { TopRatedMovies } from "components/ui/home/top-rated-movies";
import { TrendingMovies } from "components/ui/home/trending-movies";
import { SidebarNav } from "components/ui/sidebar-nav";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";
import { getHomeFeed } from "services/api/flixy/server/feed";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import type { ApiResponse, Dictionary } from "services/api/flixy/types/overall";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import type { WatchListFace } from "services/api/flixy/types/watchlist";
import { getAccessToken, getCachedUserData } from "services/api/utils";
import type { Route } from "./+types/home";

interface WatchLists {
  items: {
    items: WatchListFace[];
  };
  total_movies: number;
  total_watchlists: number;
}

export async function loader({ request }: Route.LoaderArgs) {
  let apiResponse: ApiResponse = {};

  try {
    const feed = await getHomeFeed(request);
    const user = await getCachedUserData(request);

    apiResponse.data = { feed, user };

    apiResponse.accessToken = await getAccessToken(request);

    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /feed/home said: ", err.message);

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function HomePage() {
  const { t } = useTranslation();

  const apiResponse: ApiResponse = useLoaderData();

  const featuredMovie: MovieDataGet = apiResponse.data?.feed?.featured_movie;
  const trendingNowMovies: MovieDataGet[] =
    apiResponse.data?.feed?.trending_now_movies;
  const topRatedMovies: MovieDataGet[] =
    apiResponse.data?.feed?.top_rated_movies;
  const lastWatchedMoviesReviews: ReviewDataGet[] =
    apiResponse.data?.feed?.last_watched_movies;

  const recentReviews: ReviewDataGet[] = apiResponse.data?.feed?.recent_reviews;
  const MoviesCountByGenre: Dictionary<string> =
    apiResponse.data?.feed?.movies_count_by_genre;

  const popupularWatchLists: WatchLists =
    apiResponse.data?.feed?.popular_watchlists;

  if (apiResponse.error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <HeaderFull />
          <main className="overflow-auto mx-auto py-6 px-6 md:px-6">
            <p className="text-gray-400 mb-6">{apiResponse.error}</p>
          </main>
        </div>
      </div>
    );
  }
  return (
    <html lang="es">
      <body>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
          <SidebarNav />
          <div className="flex-1 overflow-y-auto">
            <HeaderFull />
            {/* Movies Section */}
            <main className="min-h-screen bg-slate-900">
              <div className="container pl-6 pr-6 space-y-12">
                {/* Hero Section */}
                <section className="pt-6">
                  <FeaturedMovie movie={featuredMovie} />
                </section>

                {/* Trending Now */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {t("home.trending_now")}
                      </h2>
                      <p className="text-slate-400 mt-1">
                        {t("home.trending_now_subtitle")}
                      </p>
                    </div>
                  </div>
                  <TrendingMovies
                    movies={trendingNowMovies}
                    accessToken={apiResponse.accessToken as string}
                  />
                </section>

                {/* Top Rated */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {t("home.top_rated")}
                      </h2>
                      <p className="text-slate-400 mt-1">
                        {t("home.top_rated_subtitle")}
                      </p>
                    </div>
                  </div>
                  <TopRatedMovies
                    movies={topRatedMovies}
                    accessToken={apiResponse.accessToken as string}
                  />
                </section>

                {/* Popular This Week */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {t("home.last_picked_by_you")}
                      </h2>
                      <p className="text-slate-400 mt-1">
                        {t("home.last_picked_by_you_subtitle")}
                      </p>
                    </div>
                  </div>
                  <LastUserPicks
                    reviews={lastWatchedMoviesReviews}
                    accessToken={apiResponse.accessToken as string}
                  />
                </section>

                {/* Popular WatchLists */}
                {popupularWatchLists.items.items && (
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-white">
                          {t("home.popular_watchlists")}
                        </h2>
                        <p className="text-slate-400 mt-1">
                          {t("home.popular_watchlists_subtitle")}
                        </p>
                      </div>
                    </div>
                    <PopularWatchLists
                      watchlists={popupularWatchLists}
                      accessToken={apiResponse.accessToken as string}
                    />
                  </section>
                )}

                {/* Recent Reviews */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {t("home.recent_reviews")}
                      </h2>
                      <p className="text-slate-400 mt-1">
                        {t("home.recent_reviews_subtitle")}
                      </p>
                    </div>
                  </div>
                  <RecentReviews reviews={recentReviews} />
                </section>

                {/* Genre Spotlight */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {t("home.genre_spotlight")}
                      </h2>
                      <p className="text-slate-400 mt-1">
                        {t("home.genre_spotlight_subtitle")}
                      </p>
                    </div>
                  </div>
                  <GenreSpotlight genres={MoviesCountByGenre} />
                </section>

                <section className="grid md:grid-cols-2 gap-6">
                  <GetRecommendations />
                  <ShareYourThoughts />
                </section>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
