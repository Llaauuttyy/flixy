import { HeaderFull } from "components/ui/header-full";
import { MovieCard } from "components/ui/movie-card";
import { SidebarNav } from "components/ui/sidebar-nav";
import { useLoaderData } from "react-router-dom";
import { getMovies } from "services/api/flixy/server/movies";
import type { Route } from "./+types/movies";

interface Page<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface MoviesData {
  movies: Page<Movie>;
  error?: string | undefined;
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
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 40;

export async function loader({ request }: Route.LoaderArgs) {
  let moviesData: MoviesData = {} as MoviesData;
  try {
    moviesData.movies = await getMovies(
      DEFAULT_PAGE,
      DEFAULT_PAGE_SIZE,
      request
    );
    return moviesData;
  } catch (err: Error | any) {
    console.log("API GET /movies said: ", err.message);

    if (err instanceof TypeError) {
      moviesData.error =
        "Service's not working properly. Please try again later.";
      return moviesData;
    }

    moviesData.error = err.message;
    return moviesData;
  }
}

export default function MoviesPage() {
  const moviesData: MoviesData = useLoaderData();

  if (moviesData.error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <HeaderFull />

          <main className="overflow-auto mx-auto py-6 px-6 md:px-6">
            <p className="text-gray-400 mb-6">{moviesData.error}</p>
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
                <h1 className="text-3xl font-bold text-white mb-2">Movies</h1>
                <p className="text-gray-300">
                  Rate movies you've watched and share your thoughts
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
                {moviesData.movies.items.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </body>

      {/* <Outlet /> */}
    </html>
  );
}
