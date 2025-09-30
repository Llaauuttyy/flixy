import { Eye, Star } from "lucide-react";
import { Badge } from "../badge";
import { Card } from "../card";

const popularMovies = [
  {
    id: 1,
    title: "Barbie",
    year: 2023,
    rating: 7.8,
    views: "1.2M",
    poster: "/barbie-movie-poster.png",
    genres: ["Adventure", "Comedy", "Fantasy"],
  },
  {
    id: 2,
    title: "Spider-Man: Across",
    year: 2023,
    rating: 8.9,
    views: "980K",
    poster: "/spider-man-across-the-spider-verse-poster.jpg",
    genres: ["Animation", "Action", "Adventure"],
  },
  {
    id: 3,
    title: "Guardians of the Galaxy Vol. 3",
    year: 2023,
    rating: 8.1,
    views: "850K",
    poster: "/guardians-of-the-galaxy-vol-3-poster.jpg",
    genres: ["Action", "Adventure", "Comedy"],
  },
  {
    id: 4,
    title: "John Wick: Chapter 4",
    year: 2023,
    rating: 8.2,
    views: "790K",
    poster: "/john-wick-chapter-4-poster.jpg",
    genres: ["Action", "Crime", "Thriller"],
  },
  {
    id: 5,
    title: "The Super Mario Bros.",
    year: 2023,
    rating: 7.5,
    views: "720K",
    poster: "/generic-platformer-movie-poster.png",
    genres: ["Animation", "Adventure", "Comedy"],
  },
];

export function PopularThisWeek() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {popularMovies.map((movie) => (
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
              <Eye className="w-3 h-3 text-pink-500" />
              <span className="text-xs font-semibold text-white">
                {movie.views}
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
