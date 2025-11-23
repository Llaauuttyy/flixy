import i18n from "i18n/i18n";
import { Calendar, Settings, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useFetcher } from "react-router-dom";
import type { Page } from "services/api/flixy/types/overall";
import type { UserData, UserDataGet } from "services/api/flixy/types/user";
import { Avatar, AvatarFallback } from "../avatar";
import { Button } from "../button";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Pagination } from "../pagination";
import { UserCard } from "../user-card";

interface ProfileUserDataProps {
  user: UserDataGet;
  accessToken: string;
  followResults: FollowResults;
  canEditData?: boolean;
}

export interface FollowResults {
  followers: Page<UserData>;
  following: Page<UserData>;
}

export const ProfileUserData = ({
  user,
  followResults,
  accessToken,
  canEditData,
}: ProfileUserDataProps) => {
  const locale = i18n.language === "en" ? "en-US" : "es-ES";
  const { t } = useTranslation();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const fetcher = useFetcher();

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-start space-x-6 mb-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-bold">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              {canEditData && (
                <Link to={`/settings`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t("profile.edit_profile")}
                  </Button>
                </Link>
              )}
            </div>
            <p className="text-gray-500 mb-2">@{user.username}</p>
            <p className="text-gray-300 mb-3">{user.about_me}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {t("profile.joined")}{" "}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleString(locale, {
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </span>
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
                <p className="text-sm text-gray-400">
                  {t("profile.following")}
                </p>
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
                <p className="text-sm text-gray-400">
                  {t("profile.followers")}
                </p>
                <p className="text-2xl font-bold text-white">
                  {followResults.followers.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        {showFollowers && followResults.followers.items.length != 0 && (
          <Card className="bg-slate-800/50 border-gray-700 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  {t("profile.followers")}
                </CardTitle>
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
                      `/profile?followers=${page}&following=${followResults.following.page}`
                    );
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {followResults.followers.items.map((follower) => (
                      <UserCard
                        key={follower.id}
                        user={follower}
                        accessToken={accessToken}
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
                <CardTitle className="text-white">
                  {t("profile.following")}
                </CardTitle>
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
                      `/profile?followers=${followResults.followers.page}&following=${page}`
                    );
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {followResults.following.items.map((follow) => (
                      <UserCard
                        key={follow.id}
                        user={follow}
                        accessToken={accessToken}
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
  );
};
