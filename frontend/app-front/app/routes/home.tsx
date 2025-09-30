import { HeaderFull } from "components/ui/header-full";
import { FeaturedMovie } from "components/ui/home/featured-movie";
import { GenreSpotlight } from "components/ui/home/genre-spotlight";
import { GetRecommendations } from "components/ui/home/get-recommendations";
import { PopularThisWeek } from "components/ui/home/popular-this-week";
import { RecentReviews } from "components/ui/home/recent-reviews";
import { ShareYourThoughts } from "components/ui/home/share-your-thoughts";
import { TopRatedMovies } from "components/ui/home/top-rated-movies";
import { TrendingMovies } from "components/ui/home/trending-movies";
import { SidebarNav } from "components/ui/sidebar-nav";

export default function HomePage() {
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
                  <FeaturedMovie />
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
                  <TrendingMovies />
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
                  <TopRatedMovies />
                </section>

                {/* Popular This Week */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Popular This Week
                      </h2>
                      <p className="text-slate-400 mt-1">
                        Most watched movies in the last 7 days
                      </p>
                    </div>
                  </div>
                  <PopularThisWeek />
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
                  <RecentReviews />
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
