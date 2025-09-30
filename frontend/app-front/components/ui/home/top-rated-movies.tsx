import { Star } from "lucide-react";
import { Badge } from "../badge";
import { Card } from "../card";

const topRatedMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    votes: "2.8M",
    poster: "/shawshank-redemption-poster.png",
    genres: ["Drama"],
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    rating: 9.2,
    votes: "2.1M",
    poster: "/the-godfather-poster.jpg",
    genres: ["Crime", "Drama"],
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    votes: "2.9M",
    poster: "/dark-knight-inspired-poster.png",
    genres: ["Action", "Crime", "Drama"],
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    rating: 8.9,
    votes: "2.3M",
    poster: "/generic-movie-poster.png",
    genres: ["Crime", "Drama"],
  },
  {
    id: 5,
    title: "Schindler's List",
    year: 1993,
    rating: 9.0,
    votes: "1.5M",
    poster: "/schindlers-list-poster.jpg",
    genres: ["Biography", "Drama", "History"],
  },
];

export function TopRatedMovies() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {topRatedMovies.map((movie, index) => (
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
            <div className="absolute top-2 left-2 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              {index + 1}
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
            <div className="text-xs text-slate-400">{movie.votes} votes</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
