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
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData } from "react-router-dom";
import {
  getLatestRatings,
  getLatestReviews,
} from "services/api/flixy/server/reviews";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import { getAccessToken } from "services/api/utils";
import type { Route } from "./+types/social";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const DEFAULT_PAGE = 1;
const DEFAULT_REVIEW_PAGE_SIZE = 5;
const DEFAULT_RATING_PAGE_SIZE = 8;
const DEFAULT_TAB = "following";

type Tab = "following" | "all";

interface LatestReviews {
  reviews: Page<ReviewDataGet>;
  ratings: Page<ReviewDataGet>;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const reviewTab = url.searchParams.get("review_tab") ?? `${DEFAULT_TAB}`;
  const reviewPage = parseInt(
    url.searchParams.get("review_page") ?? `${DEFAULT_PAGE}`
  );
  const ratingTab = url.searchParams.get("rating_tab") ?? `${DEFAULT_TAB}`;
  const ratingPage = parseInt(
    url.searchParams.get("rating_page") ?? `${DEFAULT_PAGE}`
  );

  let apiResponse: ApiResponse = {};
  let latestReviews = {} as LatestReviews;

  try {
    apiResponse.accessToken = await getAccessToken(request);

    latestReviews.reviews = await getLatestReviews(
      reviewTab === "following",
      reviewPage,
      DEFAULT_REVIEW_PAGE_SIZE,
      request
    );

    latestReviews.ratings = await getLatestRatings(
      ratingTab === "following",
      ratingPage,
      DEFAULT_RATING_PAGE_SIZE,
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
  const [activeReviewTab, setActiveReviewTab] = useState<Tab>(DEFAULT_TAB);
  const [reviewPage, setReviewPage] = useState<number>(DEFAULT_PAGE);
  const [activeRatingTab, setActiveRatingTab] = useState<Tab>(DEFAULT_TAB);
  const [ratingPage, setRatingPage] = useState<number>(DEFAULT_PAGE);
  const { t } = useTranslation();

  const apiResponse: ApiResponse = useLoaderData();
  const fetcher = useFetcher();

  let reviews: Page<ReviewDataGet> =
    fetcher.data?.data.reviews ?? (apiResponse.data?.reviews || {});
  let ratings: Page<ReviewDataGet> =
    fetcher.data?.data.ratings ?? (apiResponse.data?.ratings || {});

  const handleReviewTabChange = (newTab: Tab) => {
    if (activeReviewTab === newTab) return;
    setActiveReviewTab(newTab);
    setReviewPage(DEFAULT_PAGE);
    fetcher.load(
      `/social?review_tab=${newTab}&review_page=${DEFAULT_PAGE}&rating_tab=${activeRatingTab}&rating_page=${ratingPage}`
    );
  };

  const handleRatingTabChange = (newTab: Tab) => {
    if (activeRatingTab === newTab) return;
    setActiveRatingTab(newTab);
    setRatingPage(DEFAULT_PAGE);
    fetcher.load(
      `/social?rating_tab=${newTab}&rating_page=${DEFAULT_PAGE}&review_tab=${activeReviewTab}&review_page=${reviewPage}`
    );
  };

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
                          <div className="grid w-full grid-cols-2 bg-gray-800 gap-4 border-gray-700 mb-4">
                            <Button
                              className={`text-gray-300 hover:bg-gray-700 ${
                                activeReviewTab === "following"
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() => handleReviewTabChange("following")}
                            >
                              {t("social.recent_reviews.following_tab")}
                            </Button>
                            <Button
                              className={`text-gray-300 hover:bg-gray-700 ${
                                activeReviewTab === "all"
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() => handleReviewTabChange("all")}
                            >
                              {t("social.recent_reviews.all_tab")}
                            </Button>
                          </div>
                          <Pagination
                            itemsPage={reviews}
                            onPageChange={(page: number) => {
                              setReviewPage(page);
                              fetcher.load(
                                `/social?review_tab=${activeReviewTab}&review_page=${page}`
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
                                    showMovieTitle
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
                            {t("social.recent_ratings.title")}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {t("social.recent_ratings.subtitle")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid w-full grid-cols-2 bg-gray-800 gap-4 border-gray-700 mb-4">
                            <Button
                              className={`text-gray-300 hover:bg-gray-700 ${
                                activeRatingTab === "following"
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() => handleRatingTabChange("following")}
                            >
                              {t("social.recent_ratings.following_tab")}
                            </Button>
                            <Button
                              className={`text-gray-300 hover:bg-gray-700 ${
                                activeRatingTab === "all"
                                  ? "bg-gray-700 text-white"
                                  : ""
                              }`}
                              onClick={() => handleRatingTabChange("all")}
                            >
                              {t("social.recent_ratings.all_tab")}
                            </Button>
                          </div>
                          <Pagination
                            itemsPage={ratings}
                            onPageChange={(page: number) => {
                              setRatingPage(page);
                              fetcher.load(
                                `/social?rating_tab=${activeRatingTab}&rating_page=${page}`
                              );
                            }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {ratings.items &&
                                ratings.items.map((rating) => (
                                  <div
                                    key={rating.id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-600 bg-gray-700"
                                  >
                                    <div>
                                      <p className="font-medium text-white">
                                        {rating.movie.title}
                                      </p>
                                      <p className="text-sm text-gray-400">
                                        {rating.movie.genres}
                                      </p>
                                      <p className="text-sm text-gray-300 font-medium">
                                        {dayjs.utc(rating.updated_at).fromNow()}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-purple-400 fill-current" />
                                      <span className="font-medium text-white">
                                        {rating.rating}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </Pagination>
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
