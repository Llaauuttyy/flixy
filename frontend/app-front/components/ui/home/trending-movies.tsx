import { Star, TrendingUp } from "lucide-react";
import { Badge } from "../badge";
import { Card } from "../card";

const trendingMovies = [
  {
    id: 1,
    title: "Oppenheimer",
    year: 2023,
    rating: 8.8,
    trend: "+12%",
    poster: "/images/posters/oppenheimer-poster.png",
    genres: ["Biography", "Drama", "History"],
  },
  {
    id: 2,
    title: "The Batman",
    year: 2022,
    rating: 8.2,
    trend: "+8%",
    poster: "/images/posters/the-batman-poster.png",
    genres: ["Action", "Crime", "Drama"],
  },
  {
    id: 3,
    title: "Everything Everywhere",
    year: 2022,
    rating: 8.4,
    trend: "+15%",
    poster: "/eeaao-poster.png",
    genres: ["Action", "Adventure", "Comedy"],
  },
  {
    id: 4,
    title: "Killers of the Flower Moon",
    year: 2023,
    rating: 8.1,
    trend: "+6%",
    poster: "/killers-of-the-flower-moon-poster.jpg",
    genres: ["Crime", "Drama", "History"],
  },
  {
    id: 5,
    title: "Poor Things",
    year: 2023,
    rating: 8.3,
    trend: "+10%",
    poster: "/poor-things-movie-poster.png",
    genres: ["Comedy", "Drama", "Romance"],
  },
];

export function TrendingMovies() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {trendingMovies.map((movie) => (
        <Card
          key={movie.id}
          className="group relative overflow-hidden border-slate-700 bg-slate-800 hover:border-pink-500/50 transition-all cursor-pointer"
        >
          <div className="aspect-[2/3] relative overflow-hidden">
            <img
              src={movie.poster || "/placeholder.svg"}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-pink-500" />
              <span className="text-xs font-semibold text-pink-500">
                {movie.trend}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                <div className="flex gap-1 flex-wrap">
                  {movie.genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="text-xs bg-slate-700 text-slate-200"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-1">
            <h3 className="font-semibold text-white truncate">{movie.title}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{movie.year}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-white font-semibold">{movie.rating}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
