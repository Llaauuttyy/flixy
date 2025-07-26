import { useState } from "react";
import { handleReviewCreation } from "services/api/flixy/client/reviews";
import type { ApiResponse } from "services/api/flixy/types/overall";
import type {
  ReviewCreation,
  ReviewGetData,
} from "services/api/flixy/types/review";
import { ReviewCard } from "../../components/ui/review-card";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Textarea } from "./textarea";

interface ReviewCardProps {
  accessToken: string;
  movieId: number;
  title: string;
  userReview: ReviewGetData | null;
}

export function ReviewInput({
  accessToken,
  movieId,
  title,
  userReview,
}: ReviewCardProps) {
  const reviewLimit = 1000;
  const [review, setReview] = useState("");
  const [caracters, setCaracters] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  const [currentReview, setCurrentReview] = useState(userReview);

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  console.log(`ReviewCard: movie_id: ${movieId}, title: ${title}`);

  const handleSubmitReview = async () => {
    console.log("Submitting review:", review);
    console.log("Movie ID:", movieId);

    const reviewData: ReviewCreation = {
      movie_id: movieId,
      text: review,
      // TODO: Cambiar por date-picker.
      watch_date: new Date(),
    };

    let apiResponse: ApiResponse = {};

    try {
      let newUserReview: ReviewGetData = await handleReviewCreation(
        accessToken,
        reviewData
      );

      setCurrentReview(newUserReview);
    } catch (err: Error | any) {
      console.log("API POST /review: ", err.message);

      if (err instanceof TypeError) {
        apiResponse.error =
          "Service's not working properly. Please try again later.";
        setApiResponse(apiResponse);
      }

      apiResponse.error = err.message;
      setApiResponse(apiResponse);
    }
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

  if (currentReview) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Your Review</h2>
        {/* TODO: Agregar boton para editar review */}
        <ReviewCard userReview={currentReview} />
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        {/* Opinion Textarea */}
        <div className="grid mb-6">
          <p className="text-slate-300 mb-3">
            Have you watched{" "}
            <span className="text-purple-400 font-semibold">{title}</span>?
            Share your thoughts...
          </p>
          <Textarea
            placeholder="What did you think of the movie?"
            onChange={(e) => updateReview(e.target.value)}
            className="mb-2 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-[120px]"
          />
          <p className="text-slate-300">
            {" "}
            <span className={`${getCaractersColor()}`}>{caracters}</span> / 1000
          </p>
        </div>

        <Button
          onClick={handleSubmitReview}
          disabled={hasReachedLimit || caracters <= 0}
          className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
        >
          Publish review
        </Button>

        {apiResponse?.error && (
          <p className="text-red-500 mt-4">{apiResponse.error}</p>
        )}
      </CardContent>
    </Card>
  );
}
