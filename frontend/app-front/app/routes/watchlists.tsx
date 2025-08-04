import { HeaderFull } from "components/ui/header-full";
import { MovieCard } from "components/ui/movie-card";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Clock, Film, Pencil, Plus, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Movie {
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
}

interface Watchlist {
  id: number;
  title: string;
  movies: Movie[];
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export default function MovieInsights() {
  const [watchlists] = useState<Watchlist[]>([
    {
      id: 1,
      title: "Action & Adventure",
      icon: "⚡",
      createdAt: "2 days ago",
      updatedAt: "2 days ago",
      movies: [
        {
          id: 1,
          title: "Theater",
          year: 2020,
          imdb_rating: 6.6,
          genres: "Drama, Romance",
          countries: "Japan",
          duration: 136,
          cast: "Kento Yamazaki, Mayu Matsuoka, Kan'ichirô Satô...",
          directors: "Isao Yukisada",
          writers: "Ryûta Hôrai, Naoki Matayoshi...",
          plot: "The director of a...",
          logo_url:
            "https://m.media-amazon.com/images/M/MV5BZDcyMjhiYTUtMGEyZC00YWM2LWJmMWQtYjBiNWIzNzdhZjg3XkEyXkFqcGdeQXVyNjc3MjQzNTI@.jpg",
          user_rating: null,
        },
        {
          id: 2,
          title: "The Way of the Gun",
          year: 2000,
          imdb_rating: 6.6,
          genres: "Action, Crime, Drama...",
          countries: "United States",
          duration: 119,
          cast: "Ryan Phillippe, Benicio Del Toro, Juliette Lewis...",
          directors: "Christopher McQuarrie",
          writers: "Christopher McQuarrie",
          plot: "Two petty, violent criminals...",
          logo_url:
            "https://m.media-amazon.com/images/M/MV5BMTAyNjEyMDEwMzBeQTJeQWpwZ15BbWU4MDczMjY1NDEy.jpg",
          user_rating: null,
        },
        {
          id: 3,
          title: "Bad Company",
          year: 1972,
          imdb_rating: 6.9,
          genres: "Adventure, Drama, Western",
          countries: "United States",
          duration: 93,
          cast: "Jeff Bridges, Barry Brown, Jim Davis...",
          directors: "Robert Benton",
          writers: "David Newman, Robert Benton",
          plot: "A group of naive boys...",
          logo_url:
            "https://m.media-amazon.com/images/M/MV5BNjIzMGU1ZTQtNDRmOC00OWUzLWFlNGUtYzRhYTM0YWRmNDNjXkEyXkFqcGdeQXVyMTUzMDUzNTI3.jpg",
          user_rating: null,
        },
        {
          id: 4,
          title: "Mimic",
          year: 1997,
          imdb_rating: 6.0,
          genres: "Horror, Sci-Fi",
          countries: "United States",
          duration: 105,
          cast: "Mira Sorvino, Jeremy Northam, Alexander Goodwin...",
          directors: "Guillermo del Toro",
          writers: "Donald A. Wollheim, Matthew Robbins...",
          plot: "A disease carried by...",
          logo_url:
            "https://m.media-amazon.com/images/M/MV5BODk4MjRkODctOTVjNS00MmI2LTg0Y2ItMWQyMzdkZDU3MzMyXkEyXkFqcGdeQXVyNTAyODkwOQ@@.jpg",
          user_rating: null,
        },
        {
          id: 5,
          title: "Dave Made a Maze",
          year: 2017,
          imdb_rating: 6.3,
          genres: "Adventure, Comedy, Fantasy...",
          countries: "United States",
          duration: 80,
          cast: "Meera Rohit Kumbhani, Nick Thune, Adam Busch...",
          directors: "Bill Watterson",
          writers: "Steven Sears, Bill Watterson...",
          plot: "'Dave Made A Maze' re-imagines...",
          logo_url:
            "https://m.media-amazon.com/images/M/MV5BZWYwOTgyYzQtYjdjZC00ZGE4LWExM2ItZTczZGEzMDY4OTU0XkEyXkFqcGdeQXVyMTY2NTQ3ODc@.jpg",
          user_rating: null,
        },
      ],
    },
    {
      id: 2,
      title: "Sci-Fi Favorites",
      icon: "🚀",
      createdAt: "1 week ago",
      updatedAt: "2 days ago",
      movies: [
        {
          id: 1,
          title: "Theater",
          year: 2020,
          imdb_rating: 6.6,
          genres: "Drama, Romance",
          countries: "Japan",
          duration: 136,
          cast: "Kento Yamazaki, Mayu Matsuoka, Kan'ichirô Satô...",
          directors: "Isao Yukisada",
          writers: "Ryûta Hôrai, Naoki Matayoshi...",
          plot: "The director of a...",
          logo_url:
            "https://m.media-amazon.com/images/M/MV5BZDcyMjhiYTUtMGEyZC00YWM2LWJmMWQtYjBiNWIzNzdhZjg3XkEyXkFqcGdeQXVyNjc3MjQzNTI@.jpg",
          user_rating: null,
        },
        {
          id: 2,
          title: "The Way of the Gun",
          year: 2000,
          imdb_rating: 6.6,
          genres: "Action, Crime, Drama...",
          countries: "United States",
          duration: 119,
          cast: "Ryan Phillippe, Benicio Del Toro, Juliette Lewis...",
          directors: "Christopher McQuarrie",
          writers: "Christopher McQuarrie",
          plot: "Two petty, violent criminals...",
          logo_url:
            "https://m.media-amazon.com/images/M/MV5BMTAyNjEyMDEwMzBeQTJeQWpwZ15BbWU4MDczMjY1NDEy.jpg",
          user_rating: null,
        },
        {
          id: 3,
          title: "Bad Company",
          year: 1972,
          imdb_rating: 6.9,
          genres: "Adventure, Drama, Western",
          countries: "United States",
          duration: 93,
          cast: "Jeff Bridges, Barry Brown, Jim Davis...",
          directors: "Robert Benton",
          writers: "David Newman, Robert Benton",
          plot: "A group of naive boys...",
          logo_url:
            "https://m.media-amazon.com/images/M/MV5BNjIzMGU1ZTQtNDRmOC00OWUzLWFlNGUtYzRhYTM0YWRmNDNjXkEyXkFqcGdeQXVyMTUzMDUzNTI3.jpg",
          user_rating: null,
        },
        {
          id: 4,
          title: "Mimic",
          year: 1997,
          imdb_rating: 6.0,
          genres: "Horror, Sci-Fi",
          countries: "United States",
          duration: 105,
          cast: "Mira Sorvino, Jeremy Northam, Alexander Goodwin...",
          directors: "Guillermo del Toro",
          writers: "Donald A. Wollheim, Matthew Robbins...",
          plot: "A disease carried by...",
          logo_url:
            "https://m.media-amazon.com/images/M/MV5BODk4MjRkODctOTVjNS00MmI2LTg0Y2ItMWQyMzdkZDU3MzMyXkEyXkFqcGdeQXVyNTAyODkwOQ@@.jpg",
          user_rating: null,
        },
        {
          id: 5,
          title: "Dave Made a Maze",
          year: 2017,
          imdb_rating: 6.3,
          genres: "Adventure, Comedy, Fantasy...",
          countries: "United States",
          duration: 80,
          cast: "Meera Rohit Kumbhani, Nick Thune, Adam Busch...",
          directors: "Bill Watterson",
          writers: "Steven Sears, Bill Watterson...",
          plot: "'Dave Made A Maze' re-imagines...",
          logo_url:
            "https://m.media-amazon.com/images/M/MV5BZWYwOTgyYzQtYjdjZC00ZGE4LWExM2ItZTczZGEzMDY4OTU0XkEyXkFqcGdeQXVyMTY2NTQ3ODc@.jpg",
          user_rating: null,
        },
      ],
    },
  ]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="sticky top-0 z-50 bg-gray-900">
          <HeaderFull />
        </div>
        {/* Header */}
        <div className="p-6 pb-3">
          <h1 className="text-3xl font-bold text-white mb-2">Watchlists</h1>
          <p className="text-gray-300">
            Manage your favorite genres and never miss a must-watch again
          </p>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Film className="w-4 h-4 text-violet-400" />
              <span>5 movies</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Star className="w-4 h-4 text-violet-400" />
              <span>2 watchlists</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <span>Updated recently</span>
            </div>
          </div>
          <div className="mt-3 h-px bg-gray-600 mb-6" />
        </div>

        {/* Watchlists Content */}

        <div className="p-6 pt-0">
          {watchlists.map((watchlist) => (
            <div key={watchlist.id} className="mb-12">
              {/* Watchlist Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{watchlist.icon}</span>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {watchlist.title}
                    </h2>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-400">
                        {watchlist.movies.length} movies
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{watchlist.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Pencil className="w-3 h-3" />
                        <span>{watchlist.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {}}
                  className="bg-transparent border-none text-violet-400 text-sm font-medium cursor-pointer px-4 py-2 rounded-md transition-all duration-200 hover:bg-slate-800"
                >
                  See All
                </button>
              </div>

              {/* Divider Line */}
              <div className="h-px bg-gray-600 mb-6" />

              {/* Movie Posters Grid */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {watchlist.movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    styles={{
                      card_width: 32,
                      card_height: 40,
                      title_size: "sm",
                      title_padding: 1,
                      show_rate_this_movie: false,
                      star_component_multiplier: 0.5,
                      show_details_size: "xs",
                      show_details_padding: 1,
                    }}
                    accessToken={undefined}
                  />
                  //   <div
                  //     key={movie.id}
                  //     className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105"
                  //   >
                  //     <img
                  //       src={movie.poster || "/placeholder.svg"}
                  //       alt={movie.title}
                  //       className="w-20 h-30 object-cover rounded-lg border-2 border-gray-600 transition-colors duration-200 hover:border-violet-400"
                  //     />
                  //   </div>
                ))}
              </div>
            </div>
          ))}

          {/* Create New Watchlist Card */}
          <div className="mb-12">
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-violet-400 transition-colors duration-200 cursor-pointer"
              onClick={() => {}}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    Create New Watchlist
                  </h3>
                  <p className="text-sm text-gray-400">
                    Organize your movies by genre, mood, or any theme you like
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State Message */}
          {watchlists.length === 0 && (
            <div className="text-center py-16 px-8 text-gray-400">
              <p className="text-lg mb-2">No watchlists yet</p>
              <p className="text-sm">
                Create your first watchlist to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
