import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Edit, Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  handleReviewCreation,
  handleReviewDelete,
} from "services/api/flixy/client/reviews";
import type { ApiResponse } from "services/api/flixy/types/overall";
import type {
  ReviewCreation,
  ReviewDataGet,
} from "services/api/flixy/types/review";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { ReviewCard } from "./review-card";
import { Textarea } from "./textarea";

interface ReviewCardProps {
  accessToken: string;
  movieId: number;
  title: string;
  userReview: ReviewDataGet | null;
}

export function ReviewInput({
  accessToken,
  movieId,
  title,
  userReview,
}: ReviewCardProps) {
  const { t } = useTranslation();

  const reviewLimit = 1000;
  const [review, setReview] = useState("");
  const [caracters, setCaracters] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [currentReview, setCurrentReview] = useState(userReview);
  const [date, setDate] = useState<dayjs.Dayjs>(
    currentReview?.watch_date
      ? dayjs(currentReview.watch_date).startOf("day")
      : dayjs().startOf("day")
  );

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>();
  const [apiDeleteResponse, setApiDeleteResponse] =
    useState<ApiResponse | null>();

  const handleEditReview = () => {
    setIsEditing(true);
    setReview(String(currentReview?.text));
    setCaracters(String(currentReview?.text).length);
  };

  const handleDeleteReview = async () => {
    if (!currentReview) {
      return;
    }

    let apiResponse: ApiResponse = {};

    try {
      await handleReviewDelete(accessToken, currentReview.id);

      setCurrentReview(null);
    } catch (err: Error | any) {
      console.log("API DELETE /review/:reviewId ", err.message);

      if (err instanceof TypeError) {
        apiResponse.error = t("exceptions.service_error");
        setApiDeleteResponse(apiResponse);
      }

      apiResponse.error = err.message;
      setApiDeleteResponse(apiResponse);
    }
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

      setCurrentReview(newUserReview);
      setIsEditing(false);
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

  if (isEditing || !currentReview) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          {/* Opinion Textarea */}
          <div className="grid mb-6">
            <div className="flex justify-between items-center">
              <p className="text-slate-300 mb-3">
                {t("review_input.have_watched")}{" "}
                <span className="text-purple-400 font-semibold">{title}</span>?
                {t("review_input.share_thoughts")}
              </p>
              <div className="inline-block p-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label={t("review_input.watch_date_input")}
                      value={date}
                      onChange={(newValue) => setDate(newValue as dayjs.Dayjs)}
                      format="LL"
                      maxDate={dayjs().startOf("day")}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          size: "small",
                          InputLabelProps: {
                            sx: {
                              color: "#cbd5e1",
                            },
                          },
                          InputProps: {
                            sx: {
                              color: "#ffffff",
                              "& .MuiSvgIcon-root": {
                                color: "#ffffff",
                              },
                            },
                          },
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#cbd5e1",
                              },
                              "&:hover fieldset": {
                                borderColor: "#cbd5e1",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#cbd5e1",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#cbd5e1",
                            },
                          },
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>

            <Textarea
              placeholder={t("review_input.review_placeholder")}
              value={review || currentReview?.text}
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
              className="ml-2 bg-red-600 hover:bg-red-700 disabled:opacity-50"
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
        <div className="flex justify-between items-center mb-[10px]">
          <h2 className="text-2xl font-semibold">
            {t("movie_detail.review_user")}
          </h2>
          <div className="flex gap-[10px]">
            <Button
              onClick={handleEditReview}
              className="rounded-lg border bg-card text-card-foreground shadow-sm border-slate-700 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50"
            >
              <Edit size={30} />
            </Button>
            <Button
              onClick={handleDeleteReview}
              className="rounded-lg border bg-card text-card-foreground shadow-sm border-slate-700 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50"
            >
              <Trash size={30} color="red" />
            </Button>
          </div>
        </div>
        {apiDeleteResponse?.error && (
          <p className="text-red-500 mt-4 mb-4">{apiDeleteResponse.error}</p>
        )}
        <ReviewCard userReview={currentReview} />
      </div>
    );
  }
}
