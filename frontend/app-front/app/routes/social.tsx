"use client";

import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { HeaderFull } from "components/ui/header-full";
import { Pagination } from "components/ui/pagination";
import { ReviewCard } from "components/ui/review-card";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData } from "react-router-dom";
import { getLatestReviews } from "services/api/flixy/server/reviews";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import { getAccessToken } from "services/api/utils";
import type { Route } from "./+types/social";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_REVIEW_TAB = "following";

type ReviewTab = "following" | "all";

interface LatestReviews {
  reviews: Page<ReviewDataGet>;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const reviewTab =
    url.searchParams.get("review_tab") ?? `${DEFAULT_REVIEW_TAB}`;
  const reviewPage = parseInt(
    url.searchParams.get("review_page") ?? `${DEFAULT_PAGE}`
  );

  let apiResponse: ApiResponse = {};
  let latestReviews = {} as LatestReviews;

  try {
    apiResponse.accessToken = await getAccessToken(request);

    latestReviews.reviews = await getLatestReviews(
      reviewTab === "following",
      reviewPage,
      DEFAULT_PAGE_SIZE,
      request
    );

    apiResponse.data = latestReviews;
    return apiResponse;
  } catch (err: Error | any) {
    console.log(
      "API GET /user/followers | GET /user/following said: ",
      err.message
    );

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<ReviewTab>("following");
  const { t } = useTranslation();

  const apiResponse: ApiResponse = useLoaderData();
  const fetcher = useFetcher();

  let reviews: Page<ReviewDataGet> =
    fetcher.data?.data.reviews ?? (apiResponse.data?.reviews || {});

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
          <SidebarNav />
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Header */}
            <HeaderFull />
            <main className="flex-1 overflow-auto">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-3">
                    <div className="space-y-6">
                      {/* Recent Reviews Section */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">
                            {t("social.recent_reviews.title")}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {t("social.recent_reviews.subtitle")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid w-full grid-cols-2 bg-gray-800 border-gray-700 mb-4">
                            <Button
                              className={`text-gray-300 ${
                                activeTab === "following"
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() => {
                                const newTab = "following";
                                setActiveTab(newTab);
                                fetcher.load(
                                  `/social?review_tab=${newTab}&page=${DEFAULT_PAGE}`
                                );
                              }}
                            >
                              {t("social.recent_reviews.following_tab")}
                            </Button>
                            <Button
                              className={`text-gray-300 ${
                                activeTab === "all"
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() => {
                                const newTab = "all";
                                setActiveTab(newTab);
                                fetcher.load(
                                  `/social?review_tab=${newTab}&page=${DEFAULT_PAGE}`
                                );
                              }}
                            >
                              {t("social.recent_reviews.all_tab")}
                            </Button>
                          </div>
                          <Pagination
                            itemsPage={reviews}
                            onPageChange={(page: number) => {
                              fetcher.load(
                                `/social?review_tab=${activeTab}&review_page=${page}`
                              );
                            }}
                          >
                            <div className="space-y-4">
                              {reviews.items &&
                                reviews.items.map((review) => (
                                  <ReviewCard
                                    key={review.id}
                                    accessToken={String(
                                      apiResponse.accessToken
                                    )}
                                    userReview={review}
                                  />
                                ))}
                            </div>
                          </Pagination>
                        </CardContent>
                      </Card>

                      {/* Favorite Movies Section */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">
                            Favorite Movies
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            My all-time favorite films that shaped my love for
                            cinema
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              {
                                title: "The Godfather",
                                year: "1972",
                                rating: 10,
                                genre: "Crime Drama",
                              },
                              {
                                title: "2001: A Space Odyssey",
                                year: "1968",
                                rating: 10,
                                genre: "Sci-Fi",
                              },
                              {
                                title: "Pulp Fiction",
                                year: "1994",
                                rating: 9,
                                genre: "Crime",
                              },
                              {
                                title: "Seven Samurai",
                                year: "1954",
                                rating: 10,
                                genre: "Action Drama",
                              },
                              {
                                title: "Citizen Kane",
                                year: "1941",
                                rating: 9,
                                genre: "Drama",
                              },
                              {
                                title: "Vertigo",
                                year: "1958",
                                rating: 9,
                                genre: "Thriller",
                              },
                            ].map((movie, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border border-gray-600 bg-gray-700"
                              >
                                <div>
                                  <p className="font-medium text-white">
                                    {movie.title}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {movie.year} • {movie.genre}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="font-medium text-white">
                                    {movie.rating}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">
                          Movie Stats
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Your viewing habits at a glance
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Average Rating</span>
                          <span className="text-white font-medium">7.8/10</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Favorite Genre</span>
                          <span className="text-white font-medium">Drama</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">This Month</span>
                          <span className="text-white font-medium">
                            23 movies
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">
                            Favorite Director
                          </span>
                          <span className="text-white font-medium">
                            C. Nolan
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Popular Hashtags */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">
                          Favorite Genres
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "#Drama",
                            "#SciFi",
                            "#Thriller",
                            "#Crime",
                            "#Biography",
                            "#Mystery",
                            "#Horror",
                            "#Comedy",
                          ].map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-gray-600 bg-gray-700 text-gray-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">
                          Recent Activity
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          What you've been up to lately
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <p className="text-gray-300">
                            <span className="text-purple-400">Reviewed</span>{" "}
                            Oppenheimer
                          </p>
                          <p className="text-gray-500">2 days ago</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-300">
                            <span className="text-green-400">
                              Added to watchlist
                            </span>{" "}
                            Dune: Part Two
                          </p>
                          <p className="text-gray-500">3 days ago</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-300">
                            <span className="text-blue-400">Followed</span>{" "}
                            Christopher Nolan
                          </p>
                          <p className="text-gray-500">1 week ago</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
