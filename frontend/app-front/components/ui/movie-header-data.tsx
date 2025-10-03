import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import { Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { MovieDataGet } from "services/api/flixy/types/movie";

type Props = {
  movie: MovieDataGet;
  showPlot?: boolean;
};

export default function MovieHeaderData({ movie, showPlot = false }: Props) {
  const { t } = useTranslation();
  const [showFullPlot, setShowFullPlot] = useState(false);

  const getDurationFromMovie = (minutes_str: string): string => {
    let minutes = parseInt(minutes_str, 10);

    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;

    let duration: string = ``;

    if (hours) {
      duration += `${hours}h`;
    }

    if (remainingMinutes) {
      duration += ` ${remainingMinutes}m`;
    }

    return duration;
  };

  const renderPlot = (plot: string) => {
    if (!plot) return null;

    const truncated = plot.length > 200 ? plot.slice(0, 200) + "... " : plot;

    return (
      <div className="text-[#E0E0E0] leading-relaxed space-y-2">
        {showFullPlot ? (
          <div className="max-h-[100px] overflow-y-auto pr-2">{plot}</div>
        ) : (
          <span>{truncated}</span>
        )}

        {plot.length > 200 && (
          <button
            onClick={() => setShowFullPlot((prev) => !prev)}
            className="text-pink-400 hover:underline text-sm font-medium"
          >
            {showFullPlot ? "See less" : " See all"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="md:col-span-2 space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        {movie.title}
      </h1>
      <div className="flex items-center gap-4 text-[#A0A0A0]">
        <span className="text-lg"> {movie.year} </span>
        <Separator orientation="vertical" className="h-6 bg-[#202135]" />
        <span className="text-lg">
          {getDurationFromMovie(String(movie.duration))}
        </span>
        <Separator orientation="vertical" className="h-6 bg-[#202135]" />
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
          <span className="text-lg font-semibold">{movie.imdb_rating}</span>
          <span className="text-sm">/10</span>{" "}
          <Badge className="ml-2 bg-yellow-400 text-black font-bold rounded-sm px-1.5 py-0.5">
            IMDb
          </Badge>
        </div>
        <Separator orientation="vertical" className="h-6 bg-[#202135]" />
        <div className="flex items-center gap-1">
          <span className="text-lg">
            {String(movie.countries).split(",")[0]}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {String(movie.genres)
          .split(",")
          .map((genre: string, index: number) => (
            <Badge
              key={index}
              className="bg-[#202135] text-[#E0E0E0] hover:bg-[#202135]/80"
            >
              {genre.trim()}
            </Badge>
          ))}
      </div>
      {showPlot !== false && renderPlot(movie.plot as string)}
    </div>
  );
}
