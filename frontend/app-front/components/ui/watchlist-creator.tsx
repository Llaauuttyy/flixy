import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

import { useState } from "react";
import WatchListMovies from "./watchlist-movies";

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

export default function WatchListCreator({
  accessToken,
}: {
  accessToken: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="pb-5 w-full flex mt-10">
        <div className="flex justify-center">
          <form method="post" className="space-y-4">
            <div className="space-y-2 max-w-3xl">
              <div>
                <Label htmlFor="name" className="text-foreground font-bold">
                  Name
                </Label>
              </div>
              <Input
                id="name"
                name="name"
                defaultValue={"a"}
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
                defaultValue={"a"}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <div>
                <Label htmlFor="movies" className="text-foreground font-bold">
                  Movies
                </Label>
                <WatchListMovies
                  showOnly={true}
                  accessToken={accessToken}
                  watchlist={{ movies: [] }}
                />
              </div>
            </div>

            <Button
              disabled={isLoading}
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
          </form>
        </div>
      </div>
      <div className="h-px bg-gray-600 mt-2 mb-4" />
    </>
  );
}
