import { HeaderFull } from "components/ui/header-full";
import { BadgeGallery } from "components/ui/insights/badge-gallery";
import { FeaturedGenres } from "components/ui/insights/featured-genres";
import { GenreStatistics } from "components/ui/insights/genre-statistics";
import { OverallStats } from "components/ui/insights/overall-stats";
import { QuickStats } from "components/ui/insights/quick-stats";
import { ReviewsStats } from "components/ui/insights/reviews-stats";
import {
  ProfileUserData,
  type FollowResults,
} from "components/ui/insights/user-data";
import { SidebarNav } from "components/ui/sidebar-nav";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData } from "react-router";
import {
  getUserFollowers,
  getUserFollowing,
  getUserInsights,
  handleUserDataGet,
} from "services/api/flixy/server/user-data";
import type { ApiResponse } from "services/api/flixy/types/overall";
import type { UserDataGet, UserInsights } from "services/api/flixy/types/user";
import { getAccessToken, getCachedUserData } from "services/api/utils";
import type { Route } from "../+types/root";

const DEFAULT_PAGE = 1;
const DEFAULT_FOLLOWERS_PAGE_SIZE = 10;
const DEFAULT_FOLLOWING_PAGE_SIZE = 10;

export async function loader({ request, params }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const userId: number = Number(params.userId);

  const followersPage = parseInt(
    url.searchParams.get("followers") ?? `${DEFAULT_PAGE}`,
    5
  );
  const followingPage = parseInt(
    url.searchParams.get("following") ?? `${DEFAULT_PAGE}`,
    5
  );

  let apiResponse: ApiResponse = {};
  let followResults = {} as FollowResults;
  let userInsights: UserInsights = {} as UserInsights;
  let userData: UserDataGet = {} as UserDataGet;
  let user: UserDataGet | undefined = {} as UserDataGet;

  try {
    userData = await handleUserDataGet({ request, userId });
    user = await getCachedUserData(request);

    followResults.followers = await getUserFollowers(
      followersPage,
      DEFAULT_FOLLOWERS_PAGE_SIZE,
      request,
      userId
    );

    followResults.following = await getUserFollowing(
      followingPage,
      DEFAULT_FOLLOWING_PAGE_SIZE,
      request,
      userId
    );
    userInsights = await getUserInsights(request, userId);

    apiResponse.data = { followResults, userInsights, user, userData };

    apiResponse.accessToken = await getAccessToken(request);

    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /user/insights said: ", err.message);

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function UserProfile() {
  const { t } = useTranslation();

  let apiResponse: ApiResponse = useLoaderData();
  const fetcher = useFetcher();
  const followResults: FollowResults =
    fetcher.data?.data.followResults ?? apiResponse.data?.followResults;
  let userInsights: UserInsights = apiResponse.data?.userInsights || null;

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
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="sticky top-0 z-50 bg-gray-900">
          <HeaderFull />
        </div>
        {/* User data */}
        <ProfileUserData
          user={apiResponse.data.userData}
          accessToken={String(apiResponse.accessToken)}
          followResults={followResults}
        />
        {/* Header */}
        <div className="p-6 pb-0">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t("profile.title.prefix")}{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Flixy
            </span>{" "}
            {t("profile.title.suffix")}
          </h1>
          <p className="text-gray-300">{t("profile.subtitle")}</p>
        </div>

        {/* Stats Overview */}
        <OverallStats userInsights={userInsights} />
        <ReviewsStats userInsights={userInsights} />

        {/* Genre Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pb-0">
          <GenreStatistics userInsights={userInsights} />
          <FeaturedGenres genreStats={userInsights.genres} />
        </div>

        {/* Badges/Achievements */}
        <div className="p-6 pb-0">
          <BadgeGallery achievementsInsights={userInsights.achievements} />
        </div>

        {/* Quick Stats */}
        <QuickStats userInsights={userInsights} />
      </div>
    </div>
  );
}
