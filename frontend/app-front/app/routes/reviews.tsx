import { HeaderFull } from "components/ui/header-full";
import { MovieCard } from "components/ui/movie-card";
import MovieHeaderData from "components/ui/movie-header-data";
import { ReviewCard } from "components/ui/review-card";
import { ReviewInput } from "components/ui/review-input";
import { SidebarNav } from "components/ui/sidebar-nav";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router";
import { getAllUserReviewsData } from "services/api/flixy/server/reviews";
import type {
  ReviewDataGet,
  ReviewsData,
} from "services/api/flixy/types/review";
import { getAccessToken } from "services/api/utils";
import type { ApiResponse } from "../../services/api/flixy/types/overall";
import type { Route } from "./+types/reviews";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 4;

export async function loader({ request }: Route.LoaderArgs) {
  let reviewsData: ReviewsData = {} as ReviewsData;

  const apiResponse: ApiResponse = {};

  const url = new URL(request.url);
  const page = Number.parseInt(
    url.searchParams.get("page") ?? `${DEFAULT_PAGE}`,
    10
  );

  try {
    reviewsData = await getAllUserReviewsData(page, DEFAULT_PAGE_SIZE, request);

    apiResponse.accessToken = await getAccessToken(request);

    apiResponse.data = reviewsData;

    return apiResponse;
  } catch (err) {
    console.log("API GET /review said: ", err.message);

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function ReviewsPage() {
  const apiResponse: ApiResponse = useLoaderData();
  const { t } = useTranslation();
  const [isReviewCreation, setIsReviewCreation] = useState(false);

  const handleReviewCreation = () => {
    setIsReviewCreation(true);
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
      <div className="flex-1 overflow-y-auto">
        <HeaderFull />
        {/* Movies Section */}
        <main className="p-6 space-y-12">
          <div className="space-y-12">
            {apiResponse.data.reviews.items.map((review: ReviewDataGet) => (
              <div
                key={review.movie.id}
                className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start"
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
                      accessToken={String(apiResponse.accessToken)}
                    />
                  </div>
                </div>

                <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-purple-500/40 to-transparent self-stretch min-h-[400px]"></div>

                <div className="lg:w-2/3 flex-1">
                  <div className="pb-5">
                    <MovieHeaderData movie={review.movie} />
                  </div>

                  {review.text ? (
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-8 shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                      {/* Review Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white/90 tracking-wide">
                          Tu Review
                        </h3>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-purple-300 text-sm font-medium">
                            Publicada
                          </span>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="mb-6">
                        <ReviewCard
                          userReview={review}
                          accessToken={String(apiResponse.accessToken)}
                        />
                      </div>

                      {/* Review Footer */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-600/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                              ★
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-300 text-sm font-medium">
                              Review verificada
                            </p>
                            <p className="text-gray-500 text-xs">
                              Visible para la comunidad
                            </p>
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
                            Hace{" "}
                            {review.created_at
                              ? new Date(review.created_at).toLocaleDateString()
                              : "poco tiempo"}
                          </span>
                        </div>
                      </div>
                    </div>
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

                      {/* <Link
                        to={`/movies/${review.movie.id}`}
                        state={{ fromReviewButton: true }}
                      >
                        <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                          Escribir Review
                        </button>
                      </Link> */}

                      {!isReviewCreation ? (
                        <button
                          onClick={handleReviewCreation}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                        >
                          Escribir Review
                        </button>
                      ) : (
                        <ReviewInput
                          accessToken={String(apiResponse.accessToken)}
                          movieId={Number(review.movie.id)}
                          title={String(review.movie.title)}
                          userReview={review}
                        />
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
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
