// import Image from "next/image"
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { StarRating } from "./star-rating";

interface MovieCardProps {
  movie: {
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
  };
}

export function MovieCard({ movie }: MovieCardProps) {
  const [showRating, setShowRating] = useState(false);
  const [currentRating, setCurrentRating] = useState(movie.initialRating || 1);

  const handleRatingChange = (newRating: number) => {
    setCurrentRating(newRating);
    // In a real application, you would typically send this rating to a backend.
    console.log(`Movie "${movie.title}" rated: ${newRating} stars`);
  };

  return (
    <Card
      className="relative w-64 h-80 bg-slate-800 border-slate-700 flex flex-col items-center justify-center p-4 overflow-hidden group transition transform border border-gray-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:border-purple-600"
      onMouseEnter={() => setShowRating(true)}
      onMouseLeave={() => setShowRating(false)}
    >
      <CardHeader className="p-0 pb-4 text-center">
        <CardTitle className="text-white text-lg">{movie.title}</CardTitle>
      </CardHeader>
      <CardContent className="relative w-full h-full flex items-center justify-center p-0">
        <img
          src={movie.logoUrl || "/placeholder.svg"}
          alt={`${movie.title} logo`}
          width={150}
          height={150}
          className="object-contain transition-all duration-300 group-hover:blur-sm group-hover:opacity-100"
        />
        {/* Rating overlay */}
        <div
          className={`absolute inset-0 flex flex-col gap-2 items-center justify-center bg-slate-800/90 transition-opacity duration-300 ${
            showRating ? "opacity-90" : "opacity-0 pointer-events-none"
          }`}
        >
          <div>Rate this movie</div>
          <div>
            <StarRating
              initialRating={currentRating}
              onRatingChange={handleRatingChange}
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
