import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import { UserAvatar } from "../avatar";
import { Card } from "../card";

interface RecentReviewsProps {
  reviews: ReviewDataGet[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
        <Link
          to={{
            pathname: `/reviews/${review.id}`,
          }}
        >
          <Card
            key={review.id}
            className="p-4 border-slate-700 bg-slate-800 hover:border-pink-500/50 transition-all cursor-pointer"
          >
            <div className="flex gap-3 mb-3">
              <img
                src={review.movie.logo_url}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "./poster-not-found.jpg";
                }}
                className="w-16 h-24 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate mb-1">
                  {review.movie.title}
                </h3>
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

            <p className="text-sm text-slate-200 leading-relaxed mb-3 line-clamp-3">
              {review.text}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-700">
              <div className="flex items-center gap-2">
                <UserAvatar
                  userId={review.user_id}
                  userName={review.user_name}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white">
                    {review.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {"@" + review.user_name}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  {new Date(String(review.watch_date)).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
