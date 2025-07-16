import { Play, Plus, Star } from "lucide-react";
import { useParams } from "react-router-dom";

import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

import { useLocation } from "react-router-dom";

export default function MovieDetail() {
  const { movieId } = useParams();

  // TODO: Pedir a través de endpoint o usarlo en un componente.
  const location = useLocation();
  const movie = location.state;

  // Solo a modo de prueba -- TODO: Cambiar tipos de datos.
  const getDataFromMovie = (data: string): string => {
    if (data.length > 2) {
      return data.replace(/\[|\]|'/g, "");
    } else {
      return "No data available";
    }
  };

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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderFull />
        {/* Main Content */}
        <main className="overflow-auto mx-auto py-6 px-6 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="md:col-span-1 flex justify-center">
              <img
                src=""
                alt="Movie Poster"
                className="w-[400px] h-[600px] rounded-lg shadow-lg object-cover bg-black"
              />
            </div>

            {/* Movie Details */}
            <div className="md:col-span-2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {movie.title}
              </h1>

              <div className="flex items-center gap-4 text-[#A0A0A0]">
                <span className="text-lg"> {movie.year} </span>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-[#202135]"
                />
                <span className="text-lg">
                  {getDurationFromMovie(movie.duration)}
                </span>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-[#202135]"
                />
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                  <span className="text-lg font-semibold">0.0</span>
                  <span className="text-sm">/10</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genre.split(",").map((genre: string, index: number) => (
                  <Badge
                    key={index}
                    className="bg-[#202135] text-[#E0E0E0] hover:bg-[#202135]/80"
                  >
                    {genre.trim()}
                  </Badge>
                ))}
              </div>

              <p className="text-lg leading-relaxed text-[#E0E0E0]">
                {movie.description}
              </p>

              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#8B5CF6]/90 hover:to-[#EC4899]/90 text-white px-6 py-3 rounded-md text-lg font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Trailer
                </Button>
                <Button
                  variant="outline"
                  className="border-[#202135] text-[#E0E0E0] hover:bg-[#202135]/50 px-6 py-3 rounded-md text-lg font-semibold bg-transparent"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Watchlist
                </Button>
              </div>

              <Separator className="bg-[#202135]" />

              {/* Cast & Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700 text-[#E0E0E0]">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Director
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-[#A0A0A0]">
                      {getDataFromMovie(movie.directors)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700 text-[#E0E0E0]">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Writers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-[#A0A0A0]">No data available</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700 text-[#E0E0E0]">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Stars
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-[#A0A0A0]">
                      {getDataFromMovie(movie.actors)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
