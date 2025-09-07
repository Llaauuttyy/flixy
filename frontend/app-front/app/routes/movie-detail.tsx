import { Check, Eye, Plus, Star } from "lucide-react";
import { Link, useFetcher, useLoaderData } from "react-router-dom";

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
import {
  getWatchLists,
  handleWatchListEdition,
} from "services/api/flixy/client/watchlists";
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
import { useRef, useState } from "react";
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
import type { WatchListEdit } from "services/api/flixy/types/watchlist";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 3;

const DEFAULT_PAGE_WATCHLISTS = 1;
const DEFAULT_PAGE_SIZE_WATCHLISTS = 5;

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

  const [addingToWatchList, setAddingToWatchList] = useState(false);
  const [userWatchLists, setUserWatchLists] = useState<
    { id: number; name: string }[]
  >([]);
  const [pageWatchLists, setPageWatchLists] = useState(DEFAULT_PAGE_WATCHLISTS);
  const [sizeWatchLists, setSizeWatchLists] = useState(
    DEFAULT_PAGE_SIZE_WATCHLISTS
  );
  const [apiResponseWatchLists, setApiResponseWatchLists] =
    useState<ApiResponse>({});
  const [apiAddMovieResponse, setApiAddMovieResponse] = useState<ApiResponse>(
    {}
  );
  const [reachWatchListsEnd, setReachWatchListsEnd] = useState(false);
  const loadingWatchListsRef = useRef<boolean>(false);

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

  const switchAddWatchList = () => {
    setAddingToWatchList(!addingToWatchList);
  };

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (
      !loadingWatchListsRef.current &&
      scrollTop + clientHeight >= scrollHeight - 10
    ) {
      loadingWatchListsRef.current = true;

      const nextPage = pageWatchLists + 1;
      setPageWatchLists(nextPage);

      console.log("Reached the bottom, loading more watchlists...", nextPage);

      handleGetWatchLists(nextPage).finally(() => {
        loadingWatchListsRef.current = false;
      });
    }
  };

  const handleAddMovieToWatchList = async (watchListId: number) => {
    console.log("Adding movie to watchlist ID: ", watchListId);
    setApiAddMovieResponse({
      data: undefined,
      error: undefined,
      success: undefined,
    });

    const movieId: number = Number(currentMovieData.id);

    const watchListData: WatchListEdit = {
      watchlist_id: watchListId,
      data: {
        movie_ids_to_add: [movieId],
      },
    };

    try {
      const response = await handleWatchListEdition(
        String(apiResponse.accessToken),
        watchListData
      );

      console.log("Movie added to watchlist: ", response);
      setApiAddMovieResponse({
        data: response,
        error: undefined,
        success: "Movie added to watchlist successfully.",
      });
    } catch (err: unknown) {
      console.log("API PATCH /watchlist said: ", (err as Error).message);

      if (err instanceof TypeError) {
        setApiAddMovieResponse({
          data: undefined,
          error: t("exceptions.service_error"),
          success: undefined,
        });
      } else {
        setApiAddMovieResponse({
          data: undefined,
          error: (err as Error).message,
          success: undefined,
        });
      }
    }
  };

  const handleGetWatchLists = async (
    page: number = DEFAULT_PAGE_WATCHLISTS
  ) => {
    let watchLists = {} as ApiResponse;
    try {
      watchLists.data = await getWatchLists(
        apiResponse.accessToken as string,
        page,
        sizeWatchLists
      );

      setApiResponseWatchLists(watchLists);

      console.log("Watchlists: ", watchLists);
      if (!watchLists.data.items || watchLists.data.items.items.length === 0) {
        console.log("No more watchlists to load.");
        setReachWatchListsEnd(true);
      }

      let newUserWatchLists = watchLists.data.items.items.map(
        (watchlist: any) => ({
          id: watchlist.id,
          name: watchlist.name,
        })
      );

      setUserWatchLists((prev) => [...prev, ...newUserWatchLists]);
    } catch (err: Error | any) {
      console.log("API GET /watchlists: ", err.message);

      watchLists.error =
        err instanceof TypeError ? t("exceptions.service_error") : err.message;

      setApiResponseWatchLists(watchLists);
    }
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
              {apiAddMovieResponse.error && (
                <p className="text-red-400 mb-4">{apiAddMovieResponse.error}</p>
              )}
              {apiAddMovieResponse.success && (
                <p className="text-green-400 mb-4">
                  {apiAddMovieResponse.success}
                </p>
              )}
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
                      <Button className="border-[#202135] px-6 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
                          className="border-[#202135] px-6 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          onClick={handleWatchMovie}
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          {t("movie_detail.mark_as_watched")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                <div className="relative inline-block">
                  <Button
                    onClick={() => {
                      if (!addingToWatchList) {
                        handleGetWatchLists();
                      } else {
                        setUserWatchLists([]);
                        setPageWatchLists(DEFAULT_PAGE_WATCHLISTS);
                        setReachWatchListsEnd(false);
                      }
                      switchAddWatchList();
                    }}
                    variant="outline"
                    className="border-[#202135] px-6 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {t("movie_detail.add_to_watchlist")}
                  </Button>

                  {addingToWatchList && (
                    <ul
                      onScroll={(e) => {
                        if (!reachWatchListsEnd) handleScroll(e);
                      }}
                      className="absolute top-full left-0 mt-2 w-56 max-h-45 bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-y-auto z-[9999]"
                    >
                      <li className="px-1 py-1 hover:bg-gray-700 cursor-pointer text-gray-300 z-[9999]">
                        <Link className="px-3 py-2" to="/watchlists">
                          <Plus size={20} className="inline " />{" "}
                          {t("movie_detail.create_watchlist")}
                        </Link>
                      </li>
                      <Separator className="bg-purple-400" />
                      {userWatchLists.length > 0 ? (
                        userWatchLists.map((watchlist) => (
                          <li
                            key={watchlist.id}
                            className="flex hover:bg-gray-700 cursor-pointer text-gray-300 z-[9999]"
                          >
                            <Button
                              className="px-2 py-2 w-full h-full justify-start"
                              onClick={() =>
                                handleAddMovieToWatchList(watchlist.id)
                              }
                            >
                              {watchlist.name}
                            </Button>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">
                          {t("movie_detail.no_watchlists")}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <Separator className="bg-[#202135]" />

              {currentMovieData.youtube_trailer_id && (
                <>
                  <iframe
                    className={`h-130 w-full rounded-lg shadow-lg z-1`}
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
