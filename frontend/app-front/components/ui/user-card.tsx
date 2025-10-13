import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { handleUserFollow } from "services/api/flixy/client/user-data-client";
import { Button } from "./button";

interface UserCardProps {
  user: any;
  accessToken: string;
}

export function UserCard({ user, accessToken }: UserCardProps) {
  const { t } = useTranslation();
  const [followDisabled, setFollowDisabled] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const handleFollowUser = async (userId: number) => {
    setFollowDisabled(true);

    try {
      let user = currentUser;
      await handleUserFollow(accessToken, userId);
      user.followed_by_user = !currentUser.followed_by_user;
      setCurrentUser(user);
    } catch (err: Error | any) {
      console.log("API POST /user/:userId/follow ", err.message);
    }

    setFollowDisabled(false);
  };

  return (
    <div
      key={currentUser.id}
      className="bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-pink-500">
            {currentUser.name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{currentUser.name}</h3>
            {currentUser.verified && (
              <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <p className="text-sm text-slate-400">@{currentUser.username}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <span>
              {currentUser.followers.toLocaleString()}{" "}
              {t("search.user_followers")}
            </span>
            <span>
              {currentUser.reviews || 0} {t("search.user_reviews")}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          className={
            currentUser.followed_by_user
              ? "bg-gray-500 hover:bg-gray-600 text-white"
              : "bg-pink-500 hover:bg-pink-600 text-white"
          }
          onClick={() => handleFollowUser(currentUser.id)}
          disabled={followDisabled}
        >
          {currentUser.followed_by_user
            ? t("search.user_unfollow_button")
            : t("search.user_follow_button")}
        </Button>
      </div>
    </div>
  );
}
