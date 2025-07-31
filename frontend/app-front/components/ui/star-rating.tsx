import { cn } from "lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

import { setMovieRating } from "services/api/flixy/client/movies";
import type { MovieSetRating } from "services/api/flixy/types/movie";
interface StarRatingProps {
  initialRating: number;
  // onRatingChange?: (rating: number) => void;
  movieId: number;
  accessToken: string | undefined;
  size?: number;
  interactive?: boolean;
}

export function StarRating({
  initialRating,
  movieId,
  accessToken,
  size = 24,
  interactive = true,
}: StarRatingProps) {
  const [currentRating, setCurrentRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = async (rating: number) => {
    if (interactive) {
      setCurrentRating(rating);

      let newRating: MovieSetRating = {
        id: movieId,
        rating: rating,
      };

      await setMovieRating(accessToken, newRating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (interactive) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <Star
          key={starIndex}
          size={size}
          className={cn(
            "cursor-pointer transition-colors",
            displayRating >= starIndex
              ? "text-purple-400 fill-purple-400"
              : "text-gray-500",
            !interactive && "cursor-default"
          )}
          onClick={() => handleClick(starIndex)}
          onMouseEnter={() => handleMouseEnter(starIndex)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
}
