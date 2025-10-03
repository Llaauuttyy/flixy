import { ListCollapse } from "lucide-react";
import { Link } from "react-router-dom";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import { Badge } from "../badge"; // Adjust the path as necessary
import { Button } from "../button";
import MovieHeaderData from "../movie-header-data";

interface FeaturedMovieProps {
  movie: MovieDataGet;
}

export function FeaturedMovie({ movie }: FeaturedMovieProps) {
  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.logo_url})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent-80" />
      </div>

      <div className="relative h-full flex items-center px-8">
        <div className="max-w-2xl space-y-4">
          <Badge className="bg-pink-500 text-white">Featured</Badge>
          <MovieHeaderData movie={movie} showPlot={true} />
          <div className="flex gap-3 pt-2">
            <Link to={`/movies/${movie.id}`}>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                <ListCollapse className="w-4 h-4 mr-2" />
                Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
