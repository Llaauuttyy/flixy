import { HeaderFull } from "components/ui/header-full";
import { MovieCard } from "components/ui/movie-card";
import { Pagination } from "components/ui/pagination";
import { SidebarNav } from "components/ui/sidebar-nav";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData } from "react-router-dom";
import { getMovies } from "services/api/flixy/server/movies";
import { getAccessToken } from "services/api/utils";
import type { ApiResponse, Page } from "../../services/api/flixy/types/overall";
import type { Route } from "./+types/movies";

interface MoviesData {
  movies: Page<Movie>;
}

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

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 40;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? `${DEFAULT_PAGE}`, 10);

  let apiResponse: ApiResponse = {};

  let moviesData: MoviesData = {} as MoviesData;

  try {
    moviesData.movies = await getMovies(page, DEFAULT_PAGE_SIZE, request);

    apiResponse.accessToken = await getAccessToken(request);

    apiResponse.data = moviesData;
    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /movies said: ", err.message);

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

  const moviesData: MoviesData = fetcher.data?.data ?? apiResponse.data;
  console.log("Movies data:", moviesData);

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
    <html lang="es">
      <body>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
          <SidebarNav />

          <div className="flex-1 overflow-y-auto">
            <HeaderFull />
            {/* Movies Section */}
            <main className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {t("movies.title")}
                </h1>
                <p className="text-gray-300">{t("movies.subtitle")}</p>
              </div>
              <Pagination
                itemsPage={moviesData.movies}
                onPageChange={(page: number) => {
                  fetcher.load(`/movies?page=${page}`);
                }}
              >
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
                  {moviesData.movies.items.map((movie) => (
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
