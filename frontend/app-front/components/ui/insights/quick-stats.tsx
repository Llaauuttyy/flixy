import { BookOpen, Film, Star } from "lucide-react";
import { Card, CardContent } from "../card";

interface UserStatsProps {
  userStats: {
    totalReviews: number;
    moviesWatched: number;
    moviesRated: number;
    totalWatchTime: number;
    averageRating: number;
  };
}

export function QuickStats({ userStats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Star className="h-8 w-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {userStats.averageRating}
          </div>
          <div className="text-sm text-slate-300">Average Rating</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Film className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(
              (userStats.moviesRated / userStats.moviesWatched) * 100
            )}
            %
          </div>
          <div className="text-sm text-slate-300">
            Watched Movies (from your Lists)
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(
              (userStats.totalReviews / userStats.moviesWatched) * 100
            )}
            %
          </div>
          <div className="text-sm text-slate-300">
            Reviewed Movies (of Watched)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
