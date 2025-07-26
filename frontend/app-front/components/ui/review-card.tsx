import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Textarea } from "./textarea";

interface ReviewCardProps {
  movie_id: number;
  title: string;
}

export function ReviewCard({ movie_id, title }: ReviewCardProps) {
  const reviewLimit = 1000;
  const [caracters, setCaracters] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  console.log(`ReviewCard: movie_id: ${movie_id}, title: ${title}`);

  const updateReview = (review: string): void => {
    let reviewLength: number = review.length;

    if (reviewLength > reviewLimit) {
      setHasReachedLimit(true);
    } else {
      setHasReachedLimit(false);
    }

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

  function handleSubmitReview(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    throw new Error("Function not implemented.");
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
      </CardContent>
    </Card>
  );
}
