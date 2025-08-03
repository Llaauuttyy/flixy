import {
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  Star,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { UserInsights } from "services/api/flixy/types/user";
import { Button } from "../button";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

interface GenreStatisticsProps {
  userInsights: UserInsights;
}

export function GenreStatistics({ userInsights }: GenreStatisticsProps) {
  const [genres, setGenresOrder] = useState(userInsights.genres);
  const [isDescending, setIsDescending] = useState(false);
  const hasGenres = genres.length !== 0 ? true : false;

  const handleSortAscending = () => {
    const sortedGenres = [...genres].sort(
      (a, b) => a.average_rating - b.average_rating
    );
    setGenresOrder(sortedGenres);
    setIsDescending(false);
  };

  const handleSortDescending = () => {
    const sortedGenres = [...genres].sort(
      (a, b) => b.average_rating - a.average_rating
    );
    setGenresOrder(sortedGenres);
    setIsDescending(true);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            Average by Genre
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSortDescending}
              disabled={isDescending || !hasGenres}
              className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm border-slate-700 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50"
            >
              <ArrowUpWideNarrow className="text-blue-400" />
            </Button>
            <Button
              onClick={handleSortAscending}
              disabled={!isDescending || !hasGenres}
              className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm border-slate-700 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50"
            >
              <ArrowDownNarrowWide className="text-blue-400" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[360px] overflow-y-auto">
        {genres.length === 0 ? (
          <p key={"no-activity"} className="text-slate-400 italic">
            No activity found in any genre yet.
          </p>
        ) : (
          genres.map((genre) => (
            <div key={genre.genre} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">{genre.name}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white font-bold">
                    {genre.average_rating}
                  </span>
                </div>
              </div>
              <progress
                value={genre.average_rating}
                max={10}
                className="w-full h-2 appearance-none rounded-full overflow-hidden bg-slate-700 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-blue-900 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-blue-900"
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
