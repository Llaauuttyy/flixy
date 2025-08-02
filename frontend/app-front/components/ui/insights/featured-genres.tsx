import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

interface FeaturedGenresProps {
  genreStats: {
    genre: string;
    avgRating: number;
    moviesWatched: number;
    color: string;
  }[];
}

export function FeaturedGenres({ genreStats }: FeaturedGenresProps) {
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
              <div className="text-white font-semibold">{bestGenre.genre}</div>
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
              <div className="text-white font-semibold">{worstGenre.genre}</div>
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
  );
}
