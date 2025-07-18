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

interface Movie {
  id: string;
  title: string;
  year: string;
  duration: number;
  genre: string;
  certificate: string;
  description: string;
  actors: string;
  directors: string;
  logoUrl: string;
  initialRating: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 40;

export async function loader({ request }: Route.LoaderArgs) {
  const movies = await getMovies(DEFAULT_PAGE, DEFAULT_PAGE_SIZE, request);

  return movies;
}

export default function MoviesPage() {
  const moviesPage: Page<Movie> = useLoaderData();

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
                {moviesPage.items.map((movie) => (
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
