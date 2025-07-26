import { Play, Plus, Star } from "lucide-react";
import { useLoaderData } from "react-router-dom";

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
import { ReviewCard } from "../../components/ui/review-card";
import { ReviewInput } from "../../components/ui/review-input";
import { Separator } from "../../components/ui/separator";
import type { Route } from "./+types/movie-detail";

import { StarRating } from "components/ui/star-rating";
import { getAccessToken } from "services/api/utils";
import { getMovieData } from "../../services/api/flixy/server/movies";
import type { MovieDataGet } from "../../services/api/flixy/types/movie";
import type { ApiResponse } from "../../services/api/flixy/types/overall";

import type { ReviewGetData } from "services/api/flixy/types/review";

export async function loader({ request, params }: Route.LoaderArgs) {
  let movieData: MovieDataGet = {} as MovieDataGet;

  const movieId = params.movieId;

  if (
    !movieId ||
    movieId.trim() === "" ||
    isNaN(Number(movieId)) ||
    Number(movieId) < 1
  ) {
    movieData.error = "Invalid movie ID";
    return movieData;
  }

  let apiResponse: ApiResponse = {};

  try {
    movieData = await getMovieData(request, movieId);
    apiResponse.accessToken = await getAccessToken(request);
    apiResponse.data = movieData;

    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /movie/:movieId said: ", err.message);

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function MovieDetail() {
  let apiResponse: ApiResponse = useLoaderData();
  let currentMovieData: MovieDataGet = apiResponse.data || {};

  // let currentReview: ReviewGetData = {
  //   movie_id: Number(currentMovieData.id),
  //   text: "Buena peli",
  //   watch_date: new Date(),
  //   user_name: "Usuario",
  // };
  let currentReview = null;

  const mockReviews: ReviewGetData[] = [
    {
      user_name: "Carla M.",
      movie_id: 1,
      text: "Una obra maestra visual. Me encantó la fotografía y cómo se construyó el suspenso.",
      watch_date: new Date("2024-12-18"),
    },
    {
      user_name: "Tomás R.",
      movie_id: 1,
      text: "Interesante propuesta, aunque sentí que el ritmo cayó en la mitad. Igual la volvería a ver.",
      watch_date: new Date("2025-01-04"),
    },
    {
      user_name: "Valen P.",
      movie_id: 1,
      text: "No me convenció tanto la historia, pero la banda sonora fue increíble.",
      watch_date: new Date("2025-03-22"),
    },
    {
      user_name: "Martina G.",
      movie_id: 1,
      text: "Me dejó pensando por días. Ese final fue completamente inesperado.",
      watch_date: new Date("2025-06-15"),
    },
    {
      user_name: "Ezequiel D.",
      movie_id: 1,
      text: "La actuación principal fue lo mejor. Muy recomendada para quienes disfrutan del drama psicológico.",
      watch_date: new Date("2025-07-01"),
    },
  ];

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

  if (apiResponse.error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <HeaderFull />

          <main className="overflow-auto mx-auto py-6 px-6 md:px-6">
            <p className="text-gray-400 mb-6">{apiResponse.error}</p>
          </main>
        </div>
      </div>
    );
  }

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
                src={currentMovieData.logo_url}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "../poster-not-found.jpg";
                }}
                className="sticky top-1 w-[400px] h-[600px] rounded-lg shadow-lg object-cover bg-black"
              />
            </div>

            {/* Movie Details */}
            <div className="md:col-span-2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {currentMovieData.title}
              </h1>

              <div className="flex items-center gap-4 text-[#A0A0A0]">
                <span className="text-lg"> {currentMovieData.year} </span>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-[#202135]"
                />
                <span className="text-lg">
                  {getDurationFromMovie(String(currentMovieData.duration))}
                </span>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-[#202135]"
                />
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                  <span className="text-lg font-semibold">
                    {currentMovieData.imdb_rating}
                  </span>
                  <span className="text-sm">/10</span>{" "}
                  <Badge className="ml-2 bg-yellow-400 text-black font-bold rounded-sm px-1.5 py-0.5">
                    IMDb
                  </Badge>
                </div>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-[#202135]"
                />
                <div className="flex items-center gap-1">
                  <span className="text-lg">
                    {String(currentMovieData.countries).split(",")[0]}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {String(currentMovieData.genres)
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

              <div>
                <StarRating
                  initialRating={Number(currentMovieData.user_rating) || 0}
                  movieId={Number(currentMovieData.id)}
                  accessToken={String(apiResponse.accessToken)}
                  size={24}
                />
              </div>

              <p className="text-lg leading-relaxed text-[#E0E0E0]">
                {currentMovieData.plot}
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
                      {currentMovieData.directors}
                      {/* {currentMovieData.directors} */}
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
                    <p className="text-lg text-[#A0A0A0]">
                      {currentMovieData.writers}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700 text-[#E0E0E0]">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Cast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-[#A0A0A0]">
                      {currentMovieData.cast}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator className="bg-[#202135]" />

              <ReviewInput
                accessToken={String(apiResponse.accessToken)}
                movieId={Number(currentMovieData.id)}
                title={String(currentMovieData.title)}
                userReview={currentReview}
              />

              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Reviews from flixies
                </h2>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <ReviewCard userReview={review} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
