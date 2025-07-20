import { cn } from "lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  initialRating: number;
  // onRatingChange?: (rating: number) => void;
  movieId: number;
  size?: number;
  interactive?: boolean;
}

export function StarRating({
  initialRating,
  movieId,
  size = 24,
  interactive = true,
}: StarRatingProps) {
  const [currentRating, setCurrentRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  // const handleRatingChange = (newRating: number) => {
  //   setCurrentRating(newRating);
  //   console.log(`Movie "${movieId}" rated: ${newRating} stars`);
  // };

  const handleClick = (rating: number) => {
    if (interactive) {
      setCurrentRating(rating);
      console.log(`Movie "${movieId}" rated: ${rating} stars`);
      // onRatingChange?.(rating);
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
