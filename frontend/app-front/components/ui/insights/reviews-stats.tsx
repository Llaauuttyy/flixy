import { Heart, ThumbsUp, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { UserInsights } from "services/api/flixy/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

interface ReviewsStatsProps {
  userInsights: UserInsights;
}

export function ReviewsStats({ userInsights }: ReviewsStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pb-0">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            {t("profile.insights.overall_stats.total_likes.title")}
          </CardTitle>
          <Heart className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent className="flex flex-col justify-around h-[125px]">
          <div className="text-2xl font-bold text-white">
            {userInsights.total_likes}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t("profile.insights.overall_stats.total_likes.description")}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            {t("profile.insights.overall_stats.most_liked_review.title")}
          </CardTitle>
          <Trophy className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold text-yellow-400">
                {userInsights.most_liked_review?.movie?.title ?? "-"}
              </p>
              <p className="text-sm text-slate-400 line-clamp-2">
                {userInsights.most_liked_review?.text ?? "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
            <ThumbsUp className="h-4 w-4 text-purple-400 fill-current" />
            <span className="text-lg font-bold">
              {userInsights.most_liked_review?.likes ?? 0}
            </span>
            <span className="text-sm text-slate-400">likes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
