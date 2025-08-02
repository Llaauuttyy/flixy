import { BookOpen, Clock, Eye, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

interface OverallStatsProps {
  userStats: {
    totalReviews: number;
    moviesWatched: number;
    moviesRated: number;
    totalWatchTime: number;
    averageRating: number;
  };
}

export function OverallStats({ userStats }: OverallStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 pb-0">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Total Reviews
          </CardTitle>
          <BookOpen className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {userStats.totalReviews.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Opinions shared</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Movies Watched
          </CardTitle>
          <Eye className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {userStats.moviesWatched.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Stories experienced</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Movies Rated
          </CardTitle>
          <Star className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {userStats.moviesRated.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Opinions recorded</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Total Time
          </CardTitle>
          <Clock className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {userStats.totalWatchTime.toLocaleString()}h
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {Math.round(userStats.totalWatchTime / 24)} days of cinema
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
