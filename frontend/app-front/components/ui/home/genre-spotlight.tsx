import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Dictionary } from "services/api/flixy/types/overall";
import { Card } from "../card";

const static_genres = [
  {
    id: 1,
    name: "Action",
    image: "./../../images/action-movie-poster.jpg",
    color: "from-red-500/20 to-orange-500/20",
  },
  {
    id: 2,
    name: "Drama",
    image: "./../../images/drama-movie-poster.jpg",
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 3,
    name: "Comedy",
    image: "./../../images/comedy-movie-poster.jpg",
    color: "from-yellow-500/20 to-pink-500/20",
  },
  {
    id: 4,
    name: "Sci-Fi",
    image: "./../../images/scifi-movie-poster.jpg",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: 5,
    name: "Horror",
    image: "./../../images/horror-movie-poster.jpg",
    color: "from-purple-500/20 to-red-500/20",
  },
  {
    id: 6,
    name: "Romance",
    image: "./../../images/romance-movie-poster.jpg",
    color: "from-pink-500/20 to-rose-500/20",
  },
];

interface GenreSpotlightProps {
  genres: Dictionary<string>;
}

export function GenreSpotlight({ genres }: GenreSpotlightProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {static_genres.map((genre) => (
        <Link to={`/movies?genres=${genre.name}`}>
          <Card
            key={genre.id}
            className="group relative overflow-hidden border-slate-700 bg-slate-800 hover:border-pink-500/50 transition-all cursor-pointer h-32"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${genre.image}')` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${genre.color}`}
              />
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            </div>

            <div className="relative h-full flex items-center justify-between p-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {genre.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {genres[genre.name]} movies
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-pink-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
