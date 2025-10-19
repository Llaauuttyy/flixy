import { useFetcher, useLoaderData } from "react-router-dom";

import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";

import type { Route } from "./+types/movie-detail";

import { useTranslation } from "react-i18next";

import { getAccessToken } from "services/api/utils";
import type { ApiResponse, Page } from "../../services/api/flixy/types/overall";

import { Avatar, AvatarFallback } from "components/ui/avatar";
import { Card, CardContent } from "components/ui/card";
import { CommentCard } from "components/ui/comment/comment-card";
import { CommentInput } from "components/ui/comment/comment-input";
import { Pagination } from "components/ui/pagination";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import {
  MessageCircle,
  MonitorPlay,
  Pencil,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { handleLikeReview } from "services/api/flixy/client/reviews";
import { getCommentsByReview } from "services/api/flixy/server/comment";
import { getReviewData } from "services/api/flixy/server/reviews";
import type { CommentDataGet } from "services/api/flixy/types/comment";
import type { ReviewDataGet } from "services/api/flixy/types/review";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

dayjs.extend(relativeTime);
dayjs.extend(utc);

export async function loader({ request, params }: Route.LoaderArgs) {
  let reviewData: ReviewDataGet = {} as ReviewDataGet;
  let commentsData: Page<CommentDataGet> = {} as Page<CommentDataGet>;

  const reviewId = params.reviewId;

  if (
    !reviewId ||
    reviewId.trim() === "" ||
    isNaN(Number(reviewId)) ||
    Number(reviewId) < 1
  ) {
    reviewData.error = "Invalid review ID";
    return reviewData;
  }

  let apiResponse: ApiResponse = {};

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? `${DEFAULT_PAGE}`);

  try {
    reviewData = await getReviewData(reviewId, request);
    commentsData = await getCommentsByReview(
      reviewId,
      page,
      DEFAULT_PAGE_SIZE,
      request
    );

    apiResponse.accessToken = await getAccessToken(request);

    apiResponse.data = {
      review: reviewData,
      comments: commentsData,
    };

    console.log("FRAN 2 ", apiResponse);

    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /reviews/:reviewId said: ", err.message);

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function ReviewDetail() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const [apiResponse, setApiResponse] = useState<ApiResponse>(useLoaderData());
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [currentReview, setCurrentReview] = useState<ReviewDataGet>(
    fetcher.data?.data.review ?? (apiResponse.data.review || {})
  );
  const [currentComments, setCurrentComments] = useState<Page<CommentDataGet>>(
    fetcher.data?.data.comments ?? (apiResponse.data.comments || {})
  );

  const handleLike = async () => {
    setLikeDisabled(true);

    try {
      const review = await handleLikeReview(
        String(apiResponse.accessToken),
        currentReview.id
      );
      setCurrentReview(review);
    } catch (err: Error | any) {
      console.log("API POST /review/:reviewId/like ", err.message);
    }

    setLikeDisabled(false);
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
        <main className="overflow-auto w-full mx-auto">
          <div className="bg-slate-900 text-white">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
              {/* Review header */}
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Movie poster */}
                    <img
                      src={currentReview.movie.logo_url || "/placeholder.svg"}
                      alt={currentReview.movie.title}
                      className="w-32 h-48 object-cover rounded-lg"
                    />

                    {/* Review info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h1 className="text-2xl font-bold mb-2">
                            {currentReview.movie.title}
                          </h1>
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-purple-600">
                                {currentReview.user_name[0]?.toUpperCase() ||
                                  "NN"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">
                                {currentReview.name}
                              </p>
                              <div className="flex items-center text-slate-400 gap-2">
                                <Pencil size={13}></Pencil>
                                <span className="text-sm ml-1">
                                  {dayjs
                                    .utc(currentReview.updated_at)
                                    .fromNow()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-5 w-5 fill-purple-500 text-purple-500"
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <MonitorPlay className="pr-2" size={24} />{" "}
                            {new Date(
                              String(currentReview.watch_date)
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <p className="text-lg leading-relaxed mb-4">
                        {currentReview.text}
                      </p>

                      <div className="flex items-center gap-4">
                        <button
                          disabled={likeDisabled}
                          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                          onClick={handleLike}
                        >
                          <ThumbsUp
                            className="w-4 h-4"
                            fill={
                              currentReview.liked_by_user
                                ? "var(--color-purple-400)"
                                : "none"
                            }
                          />
                          <span
                            className={`text-sm ${
                              currentReview.liked_by_user
                                ? "text-purple-400 font-bold"
                                : ""
                            }`}
                          >
                            {currentReview.likes}
                          </span>
                        </button>
                        <button
                          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                          onClick={() => setShowCommentInput(true)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">
                            {t("review_card.comment_button")}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {showCommentInput && (
                    <CommentInput
                      accessToken={String(apiResponse.accessToken)}
                      reviewId={currentReview.id}
                      onCancel={() => setShowCommentInput(false)}
                      onComment={(comment: CommentDataGet) => {
                        if (currentComments.total < DEFAULT_PAGE_SIZE) {
                          setCurrentComments((prev) => ({
                            ...prev,
                            total: prev.total + 1,
                            items: [...prev.items, comment],
                          }));
                        } else {
                          setCurrentComments((prev) => ({
                            ...prev,
                            total: prev.total + 1,
                          }));
                        }
                        setShowCommentInput(false);
                      }}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Comments section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    Comments ({currentComments.total || 0})
                  </h2>
                </div>

                {/* Comment list */}
                <Pagination itemsPage={currentComments}>
                  <div className="space-y-4">
                    {currentComments.items.map((comment) => (
                      <CommentCard
                        accessToken={String(apiResponse.accessToken)}
                        comment={comment}
                      />
                    ))}
                  </div>
                </Pagination>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
