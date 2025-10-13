import { Star } from "lucide-react";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import { MovieCard } from "../movie-card";

interface LastUserPicksProps {
  reviews: ReviewDataGet[];
  accessToken: string | undefined;
}

export function LastUserPicks({ reviews, accessToken }: LastUserPicksProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {reviews.slice(0, 5).map((review) => (
        <div key={review.movie.id} className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-1 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20">
            <span className="text-sm font-semibold text-pink-500 line-clamp-1">
              {review.movie.title}
            </span>
          </div>
          <div className="pt-2 w-full flex justify-center">
            <MovieCard movie={review.movie} accessToken={accessToken} />
          </div>

          <div className="pt-2 flex-1 min-w-0">
            {review.rating && (
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < (review.rating ?? 0)
                        ? "fill-purple-400 text-purple-400"
                        : "text-slate-600"
                    }`}
                  />
                ))}
                <span className="text-sm font-semibold text-white ml-1">
                  {review.rating}/5
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
