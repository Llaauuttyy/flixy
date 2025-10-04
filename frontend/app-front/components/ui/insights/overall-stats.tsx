import { BookOpen, Clock, Eye, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { UserInsights } from "services/api/flixy/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

interface OverallStatsProps {
  userInsights: UserInsights;
}

export function OverallStats({ userInsights }: OverallStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 pb-0">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            {t("profile.insights.overall_stats.reviews.title")}
          </CardTitle>
          <BookOpen className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {userInsights.total_reviews.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t("profile.insights.overall_stats.reviews.description")}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            {t("profile.insights.overall_stats.movies_watched.title")}
          </CardTitle>
          <Eye className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {userInsights.total_movies_watched.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t("profile.insights.overall_stats.movies_watched.description")}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            {t("profile.insights.overall_stats.movies_rated.title")}
          </CardTitle>
          <Star className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {userInsights.total_ratings.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {" "}
            {t("profile.insights.overall_stats.movies_rated.description")}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            {t("profile.insights.overall_stats.time.title")}
          </CardTitle>
          <Clock className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {Math.round(userInsights.total_time_watched).toLocaleString()}h
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {(() => {
              const days = userInsights.total_time_watched / 24;
              if (days < 1)
                return t(
                  "profile.insights.overall_stats.time.description.less_than_a_day"
                );
              if (Math.round(days) === 1)
                return t(
                  "profile.insights.overall_stats.time.description.one_day"
                );
              return `${Math.round(days)} ${t(
                "profile.insights.overall_stats.time.description.days"
              )}`;
            })()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
