import { ArrowRight } from "lucide-react";
import { Card } from "../card";

const genres = [
  {
    id: 1,
    name: "Action",
    count: "1,234 movies",
    image: "/action-movie-explosion.jpg",
    color: "from-red-500/20 to-orange-500/20",
  },
  {
    id: 2,
    name: "Drama",
    count: "2,156 movies",
    image: "/dramatic-emotional-scene.png",
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 3,
    name: "Comedy",
    count: "987 movies",
    image: "/comedy-funny-scene.jpg",
    color: "from-yellow-500/20 to-pink-500/20",
  },
  {
    id: 4,
    name: "Sci-Fi",
    count: "756 movies",
    image: "/sci-fi-futuristic-scene.jpg",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: 5,
    name: "Horror",
    count: "543 movies",
    image: "/horror-dark-scary-scene.jpg",
    color: "from-purple-500/20 to-red-500/20",
  },
  {
    id: 6,
    name: "Romance",
    count: "892 movies",
    image: "/romantic-couple-scene.jpg",
    color: "from-pink-500/20 to-rose-500/20",
  },
];

export function GenreSpotlight() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {genres.map((genre) => (
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
              <p className="text-sm text-slate-400">{genre.count}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-pink-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>
      ))}
    </div>
  );
}
