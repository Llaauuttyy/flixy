import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Badge } from "components/ui/badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { MessageCircle, MonitorPlay, Star, ThumbsUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import { Card, CardContent } from "./card";

import "dayjs/locale/en";
import "dayjs/locale/es";
import i18n from "i18n/i18n";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface ReviewCardProps {
  userReview: ReviewDataGet;
}

export function ReviewCard({ userReview }: ReviewCardProps) {
  const { t } = useTranslation();

  dayjs.locale(i18n.language || "en");

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={"/placeholder.svg?height=32&width=32"} />
            <AvatarFallback className="bg-slate-700 text-white">
              {userReview.user_name[0]?.toUpperCase() || "NN"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-medium">{userReview.user_name}</span>
              <span className="text-sm text-slate-400">
                {dayjs.utc(userReview.updated_at).fromNow()}
              </span>
              {userReview.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: Number(userReview.rating) }).map(
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
                {dayjs.utc(userReview.watch_date).fromNow()}
              </Badge>
            </div>
            <p className="text-slate-300 mb-3">{userReview.text}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">{0}</span>
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
