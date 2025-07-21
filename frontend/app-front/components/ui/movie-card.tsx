import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "./card";
import { StarRating } from "./star-rating";

interface MovieCardProps {
  movie: {
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
  };
  accessToken: string | undefined;
}

export function MovieCard({ movie, accessToken }: MovieCardProps) {
  const userRating = movie.user_rating || 0;
  const [showRating, setShowRating] = useState(false);

  return (
    <Card
      className="relative w-64 h-80 bg-slate-800 border-slate-700 flex flex-col items-center justify-center p-4 overflow-hidden group transition transform border border-gray-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:border-purple-600"
      onMouseEnter={() => setShowRating(true)}
      onMouseLeave={() => setShowRating(false)}
    >
      <CardContent>
        <img
          src={movie.logo_url}
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = "./poster-not-found.jpg";
          }}
          width={150}
          height={150}
          className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:opacity-100"
        />
        {/* Rating overlay */}
        <div
          className={`absolute inset-0 flex flex-col gap-2 items-center justify-center bg-slate-800/90 transition-opacity duration-300 ${
            showRating ? "opacity-90" : "opacity-0 pointer-events-none"
          }`}
        >
          <CardTitle className="text-white text-lg p-5">
            {movie.title}
          </CardTitle>
          <div>Rate this movie</div>

          <div>
            <StarRating
              initialRating={userRating}
              movieId={movie.id}
              accessToken={accessToken}
              size={32}
            />
          </div>

          <Link to={`/movies/${movie.id}`} state={movie}>
            <p className="p-5 hover:cursor-pointer hover:underline">
              Show movie details...
            </p>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
