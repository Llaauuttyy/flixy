import { Play, Plus, Star } from "lucide-react";
import { Badge } from "../badge"; // Adjust the path as necessary
import { Button } from "../button";

export function FeaturedMovie() {
  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://m.media-amazon.com/images/M/MV5BMzc1NGQ1NzQtY2I2ZS00NzE4LWI4ZDQtNWRiNmIyMzUwZmFmXkEyXkFqcGdeQXVyMjI4MjA5MzA@.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent-80" />
      </div>

      <div className="relative h-full flex items-center px-8">
        <div className="max-w-2xl space-y-4">
          <Badge className="bg-pink-500 text-white">Featured</Badge>
          <h1 className="text-5xl font-bold text-white">Dune: Part Two</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>2024</span>
            <span>•</span>
            <span>2h 46m</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-white font-semibold">8.5</span>
              <span>/10</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-slate-700 text-slate-200">
              Sci-Fi
            </Badge>
            <Badge variant="secondary" className="bg-slate-700 text-slate-200">
              Adventure
            </Badge>
            <Badge variant="secondary" className="bg-slate-700 text-slate-200">
              Drama
            </Badge>
          </div>
          <p className="text-slate-200 text-lg leading-relaxed">
            Paul Atreides unites with Chani and the Fremen while seeking revenge
            against the conspirators who destroyed his family.
          </p>
          <div className="flex gap-3 pt-2">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              <Play className="w-4 h-4 mr-2" />
              Watch Trailer
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Watchlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
