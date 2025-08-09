import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { HeaderFull } from "components/ui/header-full";
import { MovieCard } from "components/ui/movie-card";
import { Pagination } from "components/ui/pagination";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useFetcher, useLoaderData } from "react-router-dom";
import { getRecommendations } from "services/api/flixy/server/movies";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";
import { getAccessToken } from "services/api/utils";
import type { Route } from "./+types/recommendations";

interface Movie {
  id: number;
  title: string;
  year: number;
  imdb_rating: number;
  genres: string;
  countries: string;
  duration: number;
  cast: string;
  directors: string;
  writers: string;
  plot: string;
  logo_url: string;
  user_rating: number | null;
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 16;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? `${DEFAULT_PAGE}`, 10);

  let apiResponse: ApiResponse = {};
  let recommendation: Page<Movie> = {} as Page<Movie>;

  try {
    recommendation = await getRecommendations(page, DEFAULT_PAGE_SIZE, request);

    apiResponse.accessToken = await getAccessToken(request);

    apiResponse.data = recommendation;
    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /recommendations said: ", err.message);

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function MoviesPage() {
  const apiResponse: ApiResponse = useLoaderData();
  const fetcher = useFetcher();
  const { t } = useTranslation();

  const recommendation: Page<Movie> = fetcher.data?.data ?? apiResponse.data;

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

  const getRandomMovie = () => {
    const randomIndex = getRandomInt(0, DEFAULT_PAGE_SIZE);
    return recommendation.items[randomIndex];
  };

  const randomMovie = getRandomMovie();

  return (
    <html lang="es">
      <body>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
          <SidebarNav />
          <div className="flex-1 overflow-y-auto">
            <HeaderFull />
            {/* Recommendation Section */}
            <main className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {t("recommendations.title")}
                </h1>
                <p className="text-gray-300">{t("recommendations.subtitle")}</p>
              </div>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {t("recommendations.random_movie.title")}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[360px] overflow-y-auto">
                  <div className="flex gap-2 text-center">
                    <Sparkles className="text-pink-400" />
                    {t("recommendations.random_movie.prefix")}
                    <Link to={`/movies/${randomMovie?.id}`} state={randomMovie}>
                      <p className="text-pink-400 hover:text-pink-300 hover:cursor-pointer hover:underline">
                        {t("recommendations.random_movie.random")}
                      </p>
                    </Link>
                    {t("recommendations.random_movie.sufix")}
                  </div>
                </CardContent>
              </Card>
              <Pagination itemsPage={recommendation}>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
                  {recommendation.items.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      accessToken={String(apiResponse.accessToken)}
                    />
                  ))}
                </div>
              </Pagination>
            </main>
          </div>
        </div>
      </body>

      {/* <Outlet /> */}
    </html>
  );
}
