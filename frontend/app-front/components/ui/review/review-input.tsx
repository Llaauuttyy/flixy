import { DatePicker } from "components/ui/datepicker";
import dayjs from "dayjs";
import { Edit, Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  handleReviewCreation,
  handleReviewDeleteText,
} from "services/api/flixy/client/reviews";
import type { ApiResponse } from "services/api/flixy/types/overall";
import type {
  ReviewCreation,
  ReviewDataGet,
} from "services/api/flixy/types/review";
import { Button } from "../button";
import { Card, CardContent } from "../card";
import { ConfirmationBox } from "../confirmation-box";
import { ReviewCard } from "../review/review-card";
import { Textarea } from "../textarea";

interface ReviewCardProps {
  accessToken: string;
  movieId: number;
  title: string;
  userReview: ReviewDataGet | null;
  onChangeReview?: (review: ReviewDataGet | null) => void;
}

export function ReviewInput({
  accessToken,
  movieId,
  title,
  userReview,
  onChangeReview,
}: ReviewCardProps) {
  const { t } = useTranslation();

  const reviewLimit = 1000;
  const [review, setReview] = useState<string>("");
  const [caracters, setCaracters] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentReview, setCurrentReview] = useState(userReview);
  const [date, setDate] = useState<dayjs.Dayjs>(
    currentReview?.watch_date
      ? dayjs(currentReview.watch_date).startOf("day")
      : dayjs().startOf("day")
  );

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>();
  const [apiDeleteResponse, setApiDeleteResponse] =
    useState<ApiResponse | null>();

  useEffect(() => {
    setCurrentReview(userReview);
    setDate(
      userReview?.watch_date
        ? dayjs(userReview.watch_date).startOf("day")
        : dayjs().startOf("day")
    );
  }, [userReview]);

  const handleEditReview = () => {
    setIsEditing(true);
    setReview(String(currentReview?.text));
    setCaracters(String(currentReview?.text).length);
  };

  const handleConfirmationBox = (value: boolean) => {
    if (value) {
      handleDeleteReview();
    }
  };

  const handleDeleteReview = async () => {
    if (!currentReview) {
      return;
    }

    setIsDeleting(true);

    let apiResponse: ApiResponse = {};

    try {
      await handleReviewDeleteText(accessToken, currentReview.id);

      if (onChangeReview) {
        onChangeReview(currentReview ? { ...currentReview, text: null } : null);
      }
      setCurrentReview((prev) => (prev ? { ...prev, text: null } : null));
      setReview("");
      setCaracters(0);
    } catch (err: Error | any) {
      console.log("API DELETE /review/:reviewId ", err.message);

      if (err instanceof TypeError) {
        apiResponse.error = t("exceptions.service_error");
        setApiDeleteResponse(apiResponse);
      }

      apiResponse.error = err.message;
      setApiDeleteResponse(apiResponse);
    }

    setIsDeleting(false);
  };

  const handleCancelReview = () => {
    setDate(dayjs(currentReview?.watch_date).startOf("day"));
    setReview(String(currentReview?.text));

    setIsEditing(false);
  };

  const handleSubmitReview = async () => {
    setIsLoading(true);

    const reviewData: ReviewCreation = {
      movie_id: movieId,
      text: review,
      watch_date: date.toDate(),
    };

    let apiResponse: ApiResponse = {};

    try {
      let newUserReview: ReviewDataGet = await handleReviewCreation(
        accessToken,
        reviewData
      );

      newUserReview.achievements = currentReview?.achievements || [];

      setCurrentReview(newUserReview);
      setIsEditing(false);
      if (onChangeReview) {
        onChangeReview(newUserReview);
      }
    } catch (err: Error | any) {
      console.log("API POST /review: ", err.message);

      if (err instanceof TypeError) {
        apiResponse.error = t("exceptions.service_error");
        setApiResponse(apiResponse);
      }

      apiResponse.error = err.message;
      setApiResponse(apiResponse);
    }

    setIsLoading(false);
  };

  const updateReview = (review: string): void => {
    let reviewLength: number = review.length;

    if (reviewLength > reviewLimit) {
      setHasReachedLimit(true);
    } else {
      setHasReachedLimit(false);
    }

    setReview(review);
    setCaracters(reviewLength);
  };

  const getCaractersColor = (): string => {
    if (caracters == 0) {
      return "text-red-300";
    } else if (caracters >= 800 && caracters < 900) {
      return "text-red-400";
    } else if (caracters >= 900 && caracters <= reviewLimit) {
      return "text-red-500";
    } else if (caracters > reviewLimit) {
      return "text-red-600";
    }

    return "text-slate-300";
  };

  if (isEditing || !currentReview?.text) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          {/* Opinion Textarea */}
          <div className="grid mb-6">
            <div className="flex justify-between items-center">
              <p className="text-slate-300 mb-3">
                {t("review_input.have_watched")}{" "}
                <span className="text-purple-400 font-semibold">{title}</span>?
                {" " + t("review_input.share_thoughts")}
              </p>
              <div className="inline-block p-2">
                <DatePicker
                  label={t("review_input.watch_date_input")}
                  value={date}
                  onChange={(newValue) => setDate(newValue as dayjs.Dayjs)}
                  format="LL"
                  maxDate={dayjs().startOf("day")}
                />
              </div>
            </div>

            <Textarea
              placeholder={t("review_input.review_placeholder")}
              value={review || currentReview?.text || ""}
              onChange={(e) => updateReview(e.target.value)}
              className="mb-2 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-[120px]"
            />
            <p className="text-slate-300">
              {" "}
              <span className={`${getCaractersColor()}`}>{caracters}</span> /
              {reviewLimit}
            </p>
          </div>

          <Button
            onClick={handleSubmitReview}
            disabled={
              hasReachedLimit ||
              caracters <= 0 ||
              isLoading ||
              (currentReview?.text === review &&
                dayjs(currentReview?.watch_date).isSame(date, "day"))
            }
            className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t("review_input.review_analizying")}
              </>
            ) : (
              t("review_input.review_button")
            )}
          </Button>

          {isEditing ? (
            <Button
              onClick={handleCancelReview}
              variant={"outline"}
              className="ml-2 hover:bg-red-700 hover:text-white text-red-500 border-red-500 disabled:opacity-50"
            >
              {t("review_input.cancel_button")}
            </Button>
          ) : null}

          {apiResponse?.error && (
            <p className="text-red-500 mt-4">{apiResponse.error}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (currentReview) {
    return (
      <div>
        <div className="flex justify-between items-center mb-[10px]"></div>
        {apiDeleteResponse?.error && (
          <p className="text-red-500 mt-4 mb-4">{apiDeleteResponse.error}</p>
        )}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-8 shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
          {/* Review Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white/90 tracking-wide">
              {t("review_input.your_review")}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-300 text-sm font-medium">
                  {t("review_input.published")}
                </span>
              </div>
              <div className="flex gap-[10px]">
                <Button
                  onClick={handleEditReview}
                  className="rounded-lg border bg-card text-card-foreground shadow-sm border-slate-700 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50"
                >
                  <Edit size={30} />
                </Button>
                <ConfirmationBox
                  isAccepted={(value) => handleConfirmationBox(value)}
                  title={t("confirmation_box.review.title")}
                  subtitle={t("confirmation_box.review.subtitle")}
                  cancelText={t("confirmation_box.review.cancel")}
                  acceptText={t("confirmation_box.review.accept")}
                >
                  <Button
                    disabled={isDeleting}
                    className="rounded-lg border bg-card text-card-foreground shadow-sm border-slate-700 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50"
                  >
                    <Trash size={30} color="red" />
                  </Button>
                </ConfirmationBox>
              </div>
            </div>
          </div>
          <ReviewCard userReview={currentReview} accessToken={accessToken} />
          <div className="flex items-center justify-between pt-6 border-t border-gray-600/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">★</span>
              </div>
              <div>
                <p className="text-gray-300 text-sm font-medium">
                  {t("review_input.verified")}
                </p>
                <p className="text-gray-500 text-xs">
                  {t("review_input.visible")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {new Date(String(userReview?.created_at)).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
