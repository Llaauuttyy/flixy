import { HeaderFull } from "components/ui/header-full";
import { MovieCard } from "components/ui/movie-card";
import MovieFilters, {
  type OrderColumn,
  type OrderWay,
} from "components/ui/movie-filters";
import { Pagination } from "components/ui/pagination";
import { SidebarNav } from "components/ui/sidebar-nav";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData } from "react-router-dom";
import { getMovies } from "services/api/flixy/server/movies";
import type { UserDataGet } from "services/api/flixy/types/user";
import { getAccessToken, getCachedUserData } from "services/api/utils";
import type { ApiResponse, Page } from "../../services/api/flixy/types/overall";
import type { Route } from "./+types/movies";

interface Order {
  column: OrderColumn | null;
  way: OrderWay | null;
}

interface MoviesData {
  movies: Page<Movie>;
  order: Order;
  genres: string[] | null;
  user?: UserDataGet;
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
  const orderColumn = url.searchParams.get(
    "order_column"
  ) as OrderColumn | null;
  const orderWay = url.searchParams.get("order_way") as OrderWay | null;
  const genres = url.searchParams.getAll("genres") as string[] | null;

  let order: Order = {
    column: orderColumn,
    way: orderWay,
  };

  let apiResponse: ApiResponse = {};

  let moviesData: MoviesData = {} as MoviesData;

  try {
    moviesData.movies = await getMovies(
      page,
      DEFAULT_PAGE_SIZE,
      order,
      genres,
      request
    );
    moviesData.order = order;
    moviesData.genres = genres;
    moviesData.user = await getCachedUserData(request);

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
  const [orderColumn, setOrderColumn] = useState<OrderColumn>(
    moviesData.order?.column ?? "title"
  );
  const [orderWay, setOrderWay] = useState<OrderWay>(
    moviesData.order.way ?? "asc"
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    moviesData.genres ? moviesData.genres : []
  );

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

  const getGenresParams = (genres: string[]) =>
    genres.map((g) => `genres=${g}`).join("&");

  const handleOrderColumnChange = (column: OrderColumn) => {
    setOrderColumn(column);
    fetcher.load(
      `/movies?page=${DEFAULT_PAGE}&order_column=${column}&order_way=${orderWay}&${getGenresParams(
        selectedGenres
      )}`
    );
  };

  const handleOrderWayChange = (way: OrderWay) => {
    setOrderWay(way);
    fetcher.load(
      `/movies?page=${DEFAULT_PAGE}&order_column=${orderColumn}&order_way=${way}&${getGenresParams(
        selectedGenres
      )}`
    );
  };

  const handleGenresChange = (genres: string[]) => {
    setSelectedGenres(genres);
    fetcher.load(
      `/movies?page=${DEFAULT_PAGE}&order_column=${orderColumn}&order_way=${orderWay}&${getGenresParams(
        genres
      )}`
    );
  };

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    moviesData.movies.items.forEach((m) =>
      m.genres.split(",").forEach((g) => set.add(g.trim()))
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [moviesData.movies]);

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
              <MovieFilters
                genres={allGenres}
                selectedGenres={selectedGenres}
                onGenresChange={handleGenresChange}
                orderColumn={orderColumn}
                onOrderColumnChange={handleOrderColumnChange}
                orderWay={orderWay}
                onOrderWayChange={handleOrderWayChange}
                className="bg-slate-800/50 border-slate-700 rounded-lg mb-6"
              />
              <Pagination
                itemsPage={moviesData.movies}
                onPageChange={(page: number) => {
                  fetcher.load(
                    `/movies?page=${page}&order_column=${orderColumn}&order_way=${orderWay}&${getGenresParams(
                      selectedGenres
                    )}`
                  );
                }}
              >
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
                  {moviesData.movies.items.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      styles={{ show_rate_this_movie: true }}
                      accessToken={String(apiResponse.accessToken)}
                    />
                  ))}
                </div>
              </Pagination>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
