import { Check, Eye, Plus, Star } from "lucide-react";
import { useFetcher, useLoaderData } from "react-router-dom";

import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ReviewCard } from "../../components/ui/review-card";
import { ReviewInput } from "../../components/ui/review-input";
import { Separator } from "../../components/ui/separator";
import type { Route } from "./+types/movie-detail";

import { StarRating } from "components/ui/star-rating";
import { useTranslation } from "react-i18next";
import { getAccessToken } from "services/api/utils";
import { getMovieData } from "../../services/api/flixy/server/movies";
import type {
  MovieDataGet,
  MovieOverallData,
} from "../../services/api/flixy/types/movie";
import type { ApiResponse, Page } from "../../services/api/flixy/types/overall";

import { DatePicker } from "components/ui/datepicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Pagination } from "components/ui/pagination";
import dayjs from "dayjs";
import { useState } from "react";
import {
  handleReviewCreation,
  handleReviewDelete,
} from "services/api/flixy/client/reviews";
import { getReviewsData } from "services/api/flixy/server/reviews";
import type {
  ReviewCreation,
  ReviewDataGet,
  ReviewsData,
} from "services/api/flixy/types/review";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 3;

export async function loader({ request, params }: Route.LoaderArgs) {
  let movieData: MovieDataGet = {} as MovieDataGet;
  let reviewsData: ReviewsData = {} as ReviewsData;

  const movieId = params.movieId;

  if (
    !movieId ||
    movieId.trim() === "" ||
    isNaN(Number(movieId)) ||
    Number(movieId) < 1
  ) {
    movieData.error = "Invalid movie ID";
    return movieData;
  }

  let apiResponse: ApiResponse = {};

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? `${DEFAULT_PAGE}`, 10);

  try {
    movieData = await getMovieData(request, movieId);
    reviewsData = await getReviewsData(
      page,
      DEFAULT_PAGE_SIZE,
      movieId,
      request
    );

    apiResponse.accessToken = await getAccessToken(request);

    let overallData: MovieOverallData = {
      movie: movieData,
      reviews: reviewsData,
    };
    apiResponse.data = overallData;

    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /movie/:movieId said: ", err.message);

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function MovieDetail() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const [apiResponse, setApiResponse] = useState<ApiResponse>(useLoaderData());
  const [watchedDialogOpen, setWatchedDialogOpen] = useState(false);
  const [watchedDate, setWatchedDate] = useState<dayjs.Dayjs>(
    dayjs().startOf("day")
  );

  let currentMovieData: MovieDataGet = apiResponse.data.movie || {};
  let userReview: ReviewDataGet = apiResponse.data.reviews.user_review || null;

  let currentReviews: Page<ReviewDataGet> =
    fetcher.data?.data.reviews.reviews ??
    (apiResponse.data.reviews.reviews || {});

  const getDurationFromMovie = (minutes_str: string): string => {
    let minutes = parseInt(minutes_str, 10);

    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;

    let duration: string = ``;

    if (hours) {
      duration += `${hours}h`;
    }

    if (remainingMinutes) {
      duration += ` ${remainingMinutes}m`;
    }

    return duration;
  };

  const handleWatchMovie = async () => {
    const reviewData: ReviewCreation = {
      movie_id: currentMovieData.id as number,
      watch_date: watchedDate.toDate(),
    };

    try {
      let newUserReview: ReviewDataGet = await handleReviewCreation(
        apiResponse.accessToken as string,
        reviewData
      );

      setApiResponse((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          reviews: {
            ...prev.data.reviews,
            user_review: newUserReview,
          },
        },
      }));
    } catch (err: Error | any) {
      console.log("API POST /review: ", err.message);

      setApiResponse((prev) => ({
        ...prev,
        error:
          err instanceof TypeError
            ? t("exceptions.service_error")
            : err.message,
      }));
    }

    setWatchedDialogOpen(false);
  };

  const handleUnWatchMovie = async () => {
    try {
      await handleReviewDelete(
        apiResponse.accessToken as string,
        userReview.id
      );

      setApiResponse((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          reviews: {
            ...prev.data.reviews,
            user_review: null,
          },
        },
      }));
      setWatchedDate(dayjs().startOf("day"));
    } catch (err: Error | any) {
      console.log("API DELETE /review/:reviewId: ", err.message);

      setApiResponse((prev) => ({
        ...prev,
        error:
          err instanceof TypeError
            ? t("exceptions.service_error")
            : err.message,
      }));
    }
  };

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
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderFull />
        {/* Main Content */}
        <main className="overflow-auto mx-auto py-6 px-6 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="md:col-span-1 flex justify-center">
              <img
                src={currentMovieData.logo_url}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "../poster-not-found.jpg";
                }}
                className="sticky top-1 w-[400px] h-[600px] rounded-lg shadow-lg object-cover bg-black"
              />
            </div>

            {/* Movie Details */}
            <div className="md:col-span-2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {currentMovieData.title}
              </h1>
              <div className="flex items-center gap-4 text-[#A0A0A0]">
                <span className="text-lg"> {currentMovieData.year} </span>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-[#202135]"
                />
                <span className="text-lg">
                  {getDurationFromMovie(String(currentMovieData.duration))}
                </span>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-[#202135]"
                />
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                  <span className="text-lg font-semibold">
                    {currentMovieData.imdb_rating}
                  </span>
                  <span className="text-sm">/10</span>{" "}
                  <Badge className="ml-2 bg-yellow-400 text-black font-bold rounded-sm px-1.5 py-0.5">
                    IMDb
                  </Badge>
                </div>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-[#202135]"
                />
                <div className="flex items-center gap-1">
                  <span className="text-lg">
                    {String(currentMovieData.countries).split(",")[0]}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {String(currentMovieData.genres)
                  .split(",")
                  .map((genre: string, index: number) => (
                    <Badge
                      key={index}
                      className="bg-[#202135] text-[#E0E0E0] hover:bg-[#202135]/80"
                    >
                      {genre.trim()}
                    </Badge>
                  ))}
              </div>
              <div>
                <StarRating
                  initialRating={Number(currentMovieData.user_rating) || 0}
                  movieId={Number(currentMovieData.id)}
                  accessToken={String(apiResponse.accessToken)}
                  size={24}
                  onRatingChange={(rating) =>
                    setApiResponse((prev) => ({
                      ...prev,
                      data: {
                        ...prev.data,
                        reviews: {
                          ...prev.data.reviews,
                          user_review: {
                            ...prev.data.reviews.user_review,
                            rating: rating,
                          },
                        },
                      },
                    }))
                  }
                />
              </div>
              <p className="text-lg leading-relaxed text-[#E0E0E0]">
                {currentMovieData.plot}
              </p>
              <div className="flex gap-4">
                {/* Mark as Watched Button */}
                {userReview ? (
                  <Button
                    className="bg-grey-900 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-[inset_0_0_0_2px_#8B5CF6] hover:shadow-[inset_0_0_0_2px_#EC4899]"
                    disabled={
                      userReview.text != null || userReview.rating != null
                    }
                    onClick={handleUnWatchMovie}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {t("movie_detail.watched")}
                  </Button>
                ) : (
                  <Dialog
                    open={watchedDialogOpen}
                    onOpenChange={setWatchedDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#8B5CF6]/90 hover:to-[#EC4899]/90 text-white px-6 py-3 rounded-md text-lg font-semibold">
                        <Eye className="w-5 h-5 mr-2" />
                        {t("movie_detail.mark_as_watched")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>
                          {t("movie_detail.dialog.title")}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                          {t("movie_detail.dialog.subtitle")}
                        </DialogDescription>
                      </DialogHeader>
                      <DatePicker
                        label={t("review_input.watch_date_input")}
                        value={watchedDate}
                        onChange={(newValue) =>
                          setWatchedDate(newValue as dayjs.Dayjs)
                        }
                        maxDate={dayjs().startOf("day")}
                        format="LL"
                      />
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setWatchedDialogOpen(false)}
                          className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
                        >
                          {t("movie_detail.dialog.cancel")}
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#8B5CF6]/90 hover:to-[#EC4899]/90 text-white px-6 py-3 rounded-md text-lg font-semibold"
                          onClick={handleWatchMovie}
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          {t("movie_detail.mark_as_watched")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                <Button
                  variant="outline"
                  className="border-[#202135] text-[#E0E0E0] hover:bg-[#202135]/50 px-6 py-3 rounded-md text-lg font-semibold bg-transparent"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Watchlist
                </Button>
              </div>
              <Separator className="bg-[#202135]" />

              {currentMovieData.youtube_trailer_id && (
                <>
                  <iframe
                    className="h-130 w-full rounded-lg shadow-lg"
                    src={`https://www.youtube.com/embed/${currentMovieData.youtube_trailer_id}`}
                  ></iframe>
                  <Separator className="bg-[#202135]" />
                </>
              )}

              {/* Cast & Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700 text-[#E0E0E0]">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      {t("movie_detail.directors")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-[#A0A0A0]">
                      {currentMovieData.directors}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700 text-[#E0E0E0]">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      {t("movie_detail.writers")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-[#A0A0A0]">
                      {currentMovieData.writers}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700 text-[#E0E0E0]">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      {t("movie_detail.cast")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-[#A0A0A0]">
                      {currentMovieData.cast}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Separator className="bg-[#202135]" />
              <ReviewInput
                accessToken={String(apiResponse.accessToken)}
                movieId={Number(currentMovieData.id)}
                title={String(currentMovieData.title)}
                userReview={userReview}
                onChangeReview={(review) =>
                  setApiResponse((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      reviews: {
                        ...prev.data.reviews,
                        user_review: review,
                      },
                    },
                  }))
                }
              />
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("movie_detail.reviews_title")}
                </h2>
                {currentReviews.items &&
                currentReviews.items.filter((review) => review.text?.trim())
                  .length !== 0 ? (
                  <Pagination
                    itemsPage={currentReviews}
                    onPageChange={(page: number) => {
                      fetcher.load(
                        `/movies/${currentMovieData.id}?page=${page}`
                      );
                    }}
                  >
                    <div className="space-y-4">
                      {currentReviews.items
                        .filter((review) => review.text?.trim())
                        .map((review) => (
                          <ReviewCard
                            userReview={review}
                            accessToken={String(apiResponse.accessToken)}
                          />
                        ))}
                    </div>
                  </Pagination>
                ) : (
                  <p className="text-gray-400 mb-6">
                    {t("review_card.no_reviews")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
