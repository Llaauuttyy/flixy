import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { useTranslation } from "react-i18next";
import type { ReviewDataGet } from "services/api/flixy/types/review";

import "dayjs/locale/en";
import "dayjs/locale/es";
import i18n from "i18n/i18n";
import { useState } from "react";
import type { Page } from "services/api/flixy/types/overall";
import { Separator } from "../../components/ui/separator";
import { MovieCard } from "./movie-card";
import MovieHeaderData from "./movie-header-data";
import { ReviewInput } from "./review-input";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface ReviewDetailHandlerProps {
  reviewsPage: Page<ReviewDataGet>;
  accessToken: string;
}

export function ReviewDetailHandler({
  reviewsPage,
  accessToken,
}: ReviewDetailHandlerProps) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState(reviewsPage.items ?? []);

  const [currentReviewBeingCreated, setCurrentReviewBeingCreated] =
    useState<number>(0);

  dayjs.locale(i18n.language || "en");

  const handleReviewChange = (review: ReviewDataGet | null) => {
    if (!review) return;

    const updatedReviews = reviews.map((r) =>
      r.id === review.id
        ? {
            ...r,
            text: review.text,
            updated_at: review.updated_at,
          }
        : r
    );

    setCurrentReviewBeingCreated(0);

    setReviews(updatedReviews);
  };

  return (
    <div>
      {reviews.map((review: ReviewDataGet) => (
        <div className="pr-6">
          <div
            key={review.movie.id}
            className="flex flex-col lg:flex-row pt-5 pb-5 lg:gap-6"
          >
            <div className="lg:w-1/3 flex-shrink-0">
              <div className="pt-7 flex justify-center">
                <MovieCard
                  movie={review.movie}
                  styles={{
                    show_rate_this_movie: true,
                    card_width: 400,
                    card_height: 500,
                  }}
                  accessToken={String(accessToken)}
                />
              </div>
            </div>

            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-purple-500/40 to-transparent self-stretch min-h-[400px]"></div>

            <div className="lg:w-2/3 flex-1">
              <div className="pb-5">
                <MovieHeaderData movie={review.movie} />
              </div>

              {review.text ? (
                <ReviewInput
                  accessToken={String(accessToken)}
                  movieId={Number(review.movie.id)}
                  title={String(review.movie.title)}
                  userReview={review}
                  onChangeReview={(updatedReview) => {
                    handleReviewChange(updatedReview || null);
                  }}
                />
              ) : review.watch_date ? (
                /* New conditional logic for when there's watch_date but no review text */
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/10 backdrop-blur-sm rounded-2xl border border-gray-600/20 p-8 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-10 h-10 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-white/90 mb-3">
                      ¡Viste la película!
                    </h4>
                    <p className="text-gray-400 text-lg mb-2">
                      ¿Por qué no darle una review?
                    </p>
                    <p className="text-gray-500 text-sm">
                      Visto el{" "}
                      {new Date(review.watch_date).toLocaleDateString()}
                    </p>
                  </div>

                  {currentReviewBeingCreated != review.id ? (
                    <button
                      onClick={() => setCurrentReviewBeingCreated(review.id)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                    >
                      Escribir Review
                    </button>
                  ) : (
                    <div className="text-start">
                      <ReviewInput
                        accessToken={String(accessToken)}
                        movieId={Number(review.movie.id)}
                        title={String(review.movie.title)}
                        userReview={review}
                        onChangeReview={(updatedReview) => {
                          handleReviewChange(updatedReview || null);
                        }}
                      />
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-center space-x-4 text-gray-500 text-sm">
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Película vista</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Review pendiente</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Default state when no review and no watch_date */
                <div className="bg-gradient-to-br from-gray-800/20 to-gray-900/10 backdrop-blur-sm rounded-2xl border border-gray-600/10 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-400 mb-2">
                    Sin review aún
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Comparte tu opinión sobre esta película
                  </p>
                </div>
              )}
            </div>
          </div>
          <Separator className="bg-[#202135]" />
        </div>
      ))}
    </div>
  );
}
