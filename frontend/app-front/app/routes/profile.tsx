import { Avatar, AvatarFallback } from "components/ui/avatar";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { HeaderFull } from "components/ui/header-full";
import { BadgeGallery } from "components/ui/insights/badge-gallery";
import { FeaturedGenres } from "components/ui/insights/featured-genres";
import { GenreStatistics } from "components/ui/insights/genre-statistics";
import { OverallStats } from "components/ui/insights/overall-stats";
import { QuickStats } from "components/ui/insights/quick-stats";
import { ReviewsStats } from "components/ui/insights/reviews-stats";
import { Pagination } from "components/ui/pagination";
import { SidebarNav } from "components/ui/sidebar-nav";
import { UserCard } from "components/ui/user-card";
import { Calendar, Settings, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useFetcher, useLoaderData } from "react-router";
import {
  getUserFollowers,
  getUserFollowing,
  getUserInsights,
} from "services/api/flixy/server/user-data";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";
import type { UserData, UserInsights } from "services/api/flixy/types/user";
import type { Route } from "../+types/root";

const DEFAULT_PAGE = 1;
const DEFAULT_FOLLOWERS_PAGE_SIZE = 1;
const DEFAULT_FOLLOWING_PAGE_SIZE = 1;

interface FollowResults {
  followers: Page<UserData>;
  following: Page<UserData>;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

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

  try {
    followResults.followers = await getUserFollowers(
      followersPage,
      DEFAULT_FOLLOWERS_PAGE_SIZE,
      request
    );

    followResults.following = await getUserFollowing(
      followingPage,
      DEFAULT_FOLLOWING_PAGE_SIZE,
      request
    );
    userInsights = await getUserInsights(request);

    apiResponse.data = { followResults, userInsights };

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

export default function MovieInsights() {
  const { t } = useTranslation();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

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
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start space-x-6 mb-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-bold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-white">John Doe</h1>
                  <Link to={`/settings`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
                <p className="text-gray-300 mb-3">
                  Passionate cinephile and film critic. Love exploring indie
                  films and classic cinema. Always looking for hidden gems and
                  thought-provoking stories.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined March 2022</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card
              className="bg-slate-800/50 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
              onClick={() => {
                setShowFollowing(true);
                setShowFollowers(false);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Following</p>
                    <p className="text-2xl font-bold text-white">
                      {followResults.following.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card
              className="bg-slate-800/50 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
              onClick={() => {
                setShowFollowers(true);
                setShowFollowing(false);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Followers</p>
                    <p className="text-2xl font-bold text-white">
                      {followResults.followers.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-4">
              {showFollowers && followResults.followers.items.length != 0 && (
                <Card className="bg-slate-800/50 border-gray-700 mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Followers</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFollowers(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Pagination
                        itemsPage={followResults.followers}
                        onPageChange={(page: number) => {
                          fetcher.load(
                            `/social?followers=${page}&following=${followResults.following.page}`
                          );
                        }}
                      >
                        <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
                          {followResults.followers.items.map((follower) => (
                            <UserCard
                              key={follower.id}
                              user={follower}
                              accessToken={String(apiResponse.accessToken)}
                            />
                          ))}
                        </div>
                      </Pagination>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showFollowing && followResults.following.items.length != 0 && (
                <Card className="bg-slate-800/50 border-gray-700 mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Following</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFollowing(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Pagination
                        itemsPage={followResults.following}
                        onPageChange={(page: number) => {
                          fetcher.load(
                            `/social?followers=${followResults.followers.page}&following=${page}`
                          );
                        }}
                      >
                        <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
                          {followResults.following.items.map((follow) => (
                            <UserCard
                              key={follow.id}
                              user={follow}
                              accessToken={String(apiResponse.accessToken)}
                            />
                          ))}
                        </div>
                      </Pagination>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
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
