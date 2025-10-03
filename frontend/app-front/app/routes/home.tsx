import { HeaderFull } from "components/ui/header-full";
import { FeaturedMovie } from "components/ui/home/featured-movie";
import { GenreSpotlight } from "components/ui/home/genre-spotlight";
import { GetRecommendations } from "components/ui/home/get-recommendations";
import { LastUserPicks } from "components/ui/home/last-user-picks";
import { RecentReviews } from "components/ui/home/recent-reviews";
import { ShareYourThoughts } from "components/ui/home/share-your-thoughts";
import { TopRatedMovies } from "components/ui/home/top-rated-movies";
import { TrendingMovies } from "components/ui/home/trending-movies";
import { SidebarNav } from "components/ui/sidebar-nav";
import { useLoaderData } from "react-router-dom";
import { getHomeFeed } from "services/api/flixy/server/feed";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import type { ApiResponse } from "services/api/flixy/types/overall";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import { getAccessToken } from "services/api/utils";
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
  let apiResponse: ApiResponse = {};

  try {
    apiResponse.data = await getHomeFeed(request);

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
  const apiResponse: ApiResponse = useLoaderData();

  const featuredMovie: MovieDataGet = apiResponse.data?.featured_movie;
  const trendingNowMovies: MovieDataGet[] =
    apiResponse.data?.trending_now_movies;
  const topRatedMovies: MovieDataGet[] = apiResponse.data?.top_rated_movies;
  const lastWatchedMovies: MovieDataGet[] =
    apiResponse.data?.last_watched_movies;

  const recentReviews: ReviewDataGet[] = apiResponse.data?.recent_reviews;

  console.log("Featured Movie: ", recentReviews);

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
                        Trending Now
                      </h2>
                      <p className="text-slate-400 mt-1">
                        {"What everyone's watching this week"}
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
                        Top Rated
                      </h2>
                      <p className="text-slate-400 mt-1">
                        Highest rated movies by the community
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
                        Last Picked By You
                      </h2>
                      <p className="text-slate-400 mt-1">
                        Movies you have watched recently
                      </p>
                    </div>
                  </div>
                  <LastUserPicks
                    movies={lastWatchedMovies}
                    accessToken={apiResponse.accessToken as string}
                  />
                </section>

                {/* Recent Reviews */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Recent Reviews
                      </h2>
                      <p className="text-slate-400 mt-1">
                        Latest thoughts from the community
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
                        Genre Spotlight
                      </h2>
                      <p className="text-slate-400 mt-1">
                        Explore movies by your favorite genres
                      </p>
                    </div>
                  </div>
                  <GenreSpotlight />
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
