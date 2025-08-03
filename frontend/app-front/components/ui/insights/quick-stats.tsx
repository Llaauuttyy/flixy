import { BookOpen, Film, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { UserInsights } from "services/api/flixy/types/user";
import { Card, CardContent } from "../card";

interface UserStatsProps {
  userInsights: UserInsights;
}
export function QuickStats({ userInsights }: UserStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Star className="h-8 w-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {userInsights.total_average_rating}
          </div>
          <div className="text-sm text-slate-300">
            {t("profile.insights.quick_stats.average_rating")}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Film className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {userInsights.total_movies_watched !== 0
              ? Math.round(
                  (userInsights.total_ratings /
                    userInsights.total_movies_watched) *
                    100
                )
              : 0}
            %
          </div>
          <div className="text-sm text-slate-300">
            {t("profile.insights.quick_stats.watched_movies")}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {userInsights.total_movies_watched !== 0
              ? Math.round(
                  (userInsights.total_reviews /
                    userInsights.total_movies_watched) *
                    100
                )
              : 0}
            %
          </div>
          <div className="text-sm text-slate-300">
            {t("profile.insights.quick_stats.reviewed_movies")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
