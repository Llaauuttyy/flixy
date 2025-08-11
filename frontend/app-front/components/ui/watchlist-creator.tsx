import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

import { useState } from "react";
import { handleWatchListCreation } from "services/api/flixy/client/watchlists";
import type { ApiResponse } from "services/api/flixy/types/overall";
import type { WatchListCreate } from "services/api/flixy/types/watchlist";
import WatchListCreatorMovies from "./watchlist-creator-movies";

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

interface WatchList {
  id: number;
  name: string;
  description: string;
  movies: Movie[];
  // icon: string;
  created_at: string;
  updated_at: string;
}

export default function WatchListCreator({
  accessToken,
  onCreation,
}: {
  accessToken: string;
  onCreation: (watchlist: WatchList) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState<String>("");

  const [newWatchListMovies, setNewWatchListMovies] = useState<Movie[]>([]);
  const [apiResponse, setApiResponse] = useState<ApiResponse>({});

  function handleMovieAdition(movie: Movie) {
    setNewWatchListMovies((prevMovies) => [...prevMovies, movie]);
  }

  async function handleCreateWatchList() {
    setIsLoading(true);
    let apiResponse: ApiResponse = {};
    let movieIds: number[] = newWatchListMovies.map((movie) => movie.id);

    let watchListData: WatchListCreate = {
      name: name,
      description: description ? description.trim() : null,
      movie_ids: movieIds,
    };

    try {
      apiResponse.data = await handleWatchListCreation(
        accessToken,
        watchListData
      );

      setApiResponse(apiResponse);

      let newWatchList: WatchList = {
        id: apiResponse.data.id,
        name: apiResponse.data.name,
        description: apiResponse.data.description,
        movies: newWatchListMovies,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      onCreation(newWatchList);
    } catch (err: Error | any) {
      console.log("API GET /movie/:movieId said: ", err.message);

      if (err instanceof TypeError) {
        apiResponse.error =
          "Service's not working properly. Please try again later.";
        setApiResponse(apiResponse);
      }

      apiResponse.error = err.message;
      setApiResponse(apiResponse);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="pb-5 w-full flex mt-10">
        <div className="flex justify-center">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading) {
                handleCreateWatchList();
              }
            }}
          >
            <div className="space-y-2 max-w-3xl">
              <div>
                <Label htmlFor="name" className="text-foreground font-bold">
                  Name
                </Label>
              </div>
              <Input
                id="name"
                name="name"
                placeholder="watchlist name"
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
              />
            </div>

            <div className="space-y-2 max-w-3xl">
              <div>
                <Label
                  htmlFor="description"
                  className="text-foreground font-bold"
                >
                  Description
                </Label>
              </div>
              <Input
                id="description"
                name="description"
                placeholder="watchlist description"
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <div>
                <Label htmlFor="movies" className="text-foreground font-bold">
                  Movies
                </Label>
                <WatchListCreatorMovies
                  showOnly={true}
                  accessToken={accessToken}
                  watchlist={{ movies: [] }}
                  onAddMovie={handleMovieAdition}
                />
              </div>
            </div>

            <Button
              disabled={isLoading || !name}
              type="submit"
              className="max-w-3xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating
                </>
              ) : (
                "Create"
              )}
            </Button>
            {apiResponse.error && (
              <p className="px-4 py-2 text-red-400">{apiResponse.error}</p>
            )}
          </form>
        </div>
      </div>
      <div className="h-px bg-gray-600 mt-2 mb-4" />
    </>
  );
}
