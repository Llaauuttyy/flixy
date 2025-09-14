import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Badge } from "components/ui/badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { MessageCircle, MonitorPlay, Star, ThumbsUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import { Card, CardContent } from "./card";

import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

import { BadgeIcon } from "components/utils";
import "dayjs/locale/en";
import "dayjs/locale/es";
import i18n from "i18n/i18n";
import { useState } from "react";
import { handleLikeReview } from "services/api/flixy/client/reviews";
import { SingularBadge } from "./insights/singular-badge";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface ReviewCardProps {
  userReview: ReviewDataGet;
  accessToken: string;
}

export function ReviewCard({ userReview, accessToken }: ReviewCardProps) {
  const { t } = useTranslation();
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [currentReview, setCurrentReview] = useState(userReview);

  dayjs.locale(i18n.language || "en");

  const handleLike = async () => {
    setLikeDisabled(true);

    try {
      const review = await handleLikeReview(accessToken, currentReview.id);
      setCurrentReview(review);
    } catch (err: Error | any) {
      console.log("API POST /review/:reviewId/like ", err.message);
    }

    setLikeDisabled(false);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={"/placeholder.svg?height=32&width=32"} />
            <AvatarFallback className="bg-slate-700 text-white">
              {currentReview.user_name[0]?.toUpperCase() || "NN"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-medium">{currentReview.user_name}</span>
              <span className="text-sm text-slate-400">
                {dayjs.utc(currentReview.created_at).fromNow()}
              </span>
              {currentReview.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: Number(currentReview.rating) }).map(
                    (_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-purple-400 fill-purple-400"
                      />
                    )
                  )}
                </div>
              )}
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                <MonitorPlay className="pr-2" size={24} />{" "}
                {dayjs.utc(currentReview.watch_date).fromNow()}
              </Badge>
              {currentReview.achievements.length > 0 &&
                currentReview.achievements.map((achievement) => (
                  <div
                    key={achievement.name}
                    className="relative group inline-block"
                  >
                    <div>
                      <BadgeIcon iconName={achievement.icon_name as IconName} />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                      <div className="w-max">
                        <SingularBadge badge={achievement} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <p className="text-slate-300 mb-3">{currentReview.text}</p>
            <div className="flex items-center gap-4">
              <button
                disabled={likeDisabled}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                onClick={handleLike}
              >
                <ThumbsUp
                  className="w-4 h-4"
                  fill={
                    currentReview.liked_by_user
                      ? "var(--color-purple-400)"
                      : "none"
                  }
                />
                <span
                  className={`text-sm ${
                    currentReview.liked_by_user
                      ? "text-purple-400 font-bold"
                      : ""
                  }`}
                >
                  {currentReview.likes}
                </span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">
                  {t("review_card.comment_button")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
