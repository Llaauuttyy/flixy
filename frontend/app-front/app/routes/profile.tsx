import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import {
  Award,
  BookOpen,
  Clock,
  Eye,
  Film,
  List,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function MovieInsights() {
  const userStats = {
    totalReviews: 247,
    moviesWatched: 1834,
    moviesRated: 1456,
    totalWatchTime: 3847,
    averageRating: 3.7,
  };

  const genreStats = [
    {
      genre: "Drama",
      avgRating: 5.6,
      moviesWatched: 312,
      color: "bg-purple-500",
    },
    {
      genre: "Thriller",
      avgRating: 8.0,
      moviesWatched: 198,
      color: "bg-pink-500",
    },
    {
      genre: "Sci-Fi",
      avgRating: 3.9,
      moviesWatched: 156,
      color: "bg-blue-500",
    },
    {
      genre: "Comedy",
      avgRating: 3.5,
      moviesWatched: 234,
      color: "bg-yellow-500",
    },
    { genre: "Horror", avgRating: 3.3, moviesWatched: 89, color: "bg-red-500" },
    {
      genre: "Action",
      avgRating: 3.8,
      moviesWatched: 267,
      color: "bg-orange-500",
    },
  ];

  const badges = [
    {
      name: "Prolific Critic",
      description: "More than 200 reviews written",
      icon: BookOpen,
      earned: true,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      name: "Movie Marathon",
      description: "More than 1000 movies watched",
      icon: Eye,
      earned: true,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      name: "Expert Curator",
      description: "More than 50 lists created",
      icon: List,
      earned: false,
      color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
    {
      name: "Dedicated Cinephile",
      description: "More than 3000 hours watched",
      icon: Clock,
      earned: true,
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
  ];

  const bestGenre = genreStats.reduce((prev, current) =>
    prev.avgRating > current.avgRating ? prev : current
  );

  const worstGenre = genreStats.reduce((prev, current) =>
    prev.avgRating < current.avgRating ? prev : current
  );

  const mostWatchedGenre = genreStats.reduce((prev, current) =>
    prev.moviesWatched > current.moviesWatched ? prev : current
  );

  const leastWatchedGenre = genreStats.reduce((prev, current) =>
    prev.moviesWatched < current.moviesWatched ? prev : current
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="sticky top-0 z-50 bg-gray-900">
          <HeaderFull />
        </div>
        {/* Header */}
        <div className="p-6 pb-0">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Flixy
            </span>{" "}
            Insights
          </h1>
          <p className="text-gray-300">
            Discover your patterns and achievements as a cinephile
          </p>
        </div>

        {/* Stats Overview */}
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

        {/* Genre Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pb-0">
          {/* Average Rating by Genre */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Average by Genre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {genreStats.map((genre) => (
                <div key={genre.genre} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">
                      {genre.genre}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-bold">
                        {genre.avgRating}
                      </span>
                    </div>
                  </div>
                  <progress
                    value={genre.avgRating}
                    max={10}
                    className="w-full h-2 appearance-none rounded-full overflow-hidden bg-slate-700 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-blue-900 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-blue-900"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Genres */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Featured Genres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                  Best Rated
                </h4>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">
                      {bestGenre.genre}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {bestGenre.avgRating} ⭐ average
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                  Worst Rated
                </h4>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">
                      {worstGenre.genre}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {worstGenre.avgRating} ⭐ average
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                  Most Watched
                </h4>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">
                      {mostWatchedGenre.genre}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {mostWatchedGenre.moviesWatched} movies
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                  Least Watched
                </h4>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">
                      {leastWatchedGenre.genre}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {leastWatchedGenre.moviesWatched} movies
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges/Achievements */}
        <div className="p-6 pb-0">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge) => {
                  const IconComponent = badge.icon;
                  return (
                    <div
                      key={badge.name}
                      className={`relative p-4 rounded-lg border transition-all duration-300 ${
                        badge.earned
                          ? "bg-slate-700/50 border-slate-600 hover:scale-105"
                          : "bg-slate-800/30 border-slate-700 opacity-60"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            badge.earned ? badge.color : "bg-slate-700"
                          }`}
                        >
                          <IconComponent
                            className={`h-6 w-6 ${
                              badge.earned ? "text-white" : "text-slate-500"
                            }`}
                          />
                        </div>
                        <div>
                          <h3
                            className={`font-semibold ${
                              badge.earned ? "text-white" : "text-slate-500"
                            }`}
                          >
                            {badge.name}
                          </h3>
                          <p
                            className={`text-xs mt-1 ${
                              badge.earned ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            {badge.description}
                          </p>
                        </div>
                        {badge.earned && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
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
      </div>
    </div>
  );
}
