import { HeaderFull } from "components/ui/header-full";
import { Pagination } from "components/ui/pagination";
import { ReviewDetailHandler } from "components/ui/review/review-detail-handler";
import { SidebarNav } from "components/ui/sidebar-nav";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData } from "react-router-dom";
import { getAllUserReviewsData } from "services/api/flixy/server/reviews";
import type {
  ReviewDataGet,
  ReviewsData,
} from "services/api/flixy/types/review";
import { getAccessToken } from "services/api/utils";
import type { ApiResponse, Page } from "../../services/api/flixy/types/overall";
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
  } catch (err: Error | any) {
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
  const fetcher = useFetcher();

  const [reviews, setReviews] = useState<Page<ReviewDataGet>>(
    apiResponse.data.reviews ?? {
      items: [],
      total: 0,
      page: 1,
      size: 0,
      pages: 0,
    }
  );

  useEffect(() => {
    if (fetcher.data?.data.reviews) {
      setReviews(fetcher.data.data.reviews);
    }
  }, [fetcher.data]);

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
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {t("reviews.title")}
            </h1>
            <p className="text-gray-300">{t("reviews.subtitle")}</p>
          </div>
          <div>
            {reviews.items && reviews.items.length !== 0 && (
              <Pagination
                itemsPage={reviews}
                onPageChange={(page: number) => {
                  fetcher.load(`/reviews?page=${page}`);
                }}
              >
                <ReviewDetailHandler
                  key={reviews.page} // To re-render on change
                  reviewsPage={reviews}
                  accessToken={String(apiResponse.accessToken)}
                />
              </Pagination>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
