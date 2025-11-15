import { Loader2 } from "lucide-react";
import { Button } from "../button";
import { Label } from "../label";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { handleWatchListCreation } from "services/api/flixy/client/watchlists";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";
import type { WatchListCreate } from "services/api/flixy/types/watchlist";
import { Checkbox } from "../checkbox";
import { MaxLengthInput } from "../max-length-input";
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

interface WatchListFace {
  id: number;
  name: string;
  description: string;
  private: boolean;
  movies: Page<MovieDataGet>;
  // icon: string;
  created_at: string;
  updated_at: string;
}

export default function WatchListCreator({
  accessToken,
  onCreation,
}: {
  accessToken: string;
  onCreation: (watchlist: WatchListFace) => void;
}) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState<String>("");
  const [privateWatchlist, setPrivateWatchlist] = useState<boolean>(false);

  const [nameLimitReached, setNameLimitReached] = useState(false);
  const [descriptionLimitReached, setDescriptionLimitReached] = useState(false);

  const [newWatchListMovies, setNewWatchListMovies] = useState<MovieDataGet[]>(
    []
  );
  const [apiResponse, setApiResponse] = useState<ApiResponse>({});

  function handleMovieAdition(movie: MovieDataGet) {
    setNewWatchListMovies((prevMovies) => [...prevMovies, movie]);
  }

  async function handleCreateWatchList() {
    setIsLoading(true);
    let apiResponse: ApiResponse = {};
    let movieIds: number[] = newWatchListMovies.map((movie) =>
      Number(movie.id)
    );

    let watchListData: WatchListCreate = {
      name: name,
      description: description ? description.trim() : null,
      private: privateWatchlist,
      movie_ids: movieIds,
    };

    try {
      apiResponse.data = await handleWatchListCreation(
        accessToken,
        watchListData
      );

      setApiResponse(apiResponse);

      let movies: Page<MovieDataGet> = {
        items: newWatchListMovies,
        total: newWatchListMovies.length,
        page: 1,
        size: newWatchListMovies.length,
        pages: 1,
      };
      let newWatchList: WatchListFace = {
        id: apiResponse.data.id,
        name: apiResponse.data.name,
        description: apiResponse.data.description,
        private: apiResponse.data.private,
        movies: movies,
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
                  {t("watchlist_creator.name")}
                </Label>
              </div>
              <MaxLengthInput
                id="name"
                name="name"
                placeholder={t("watchlist_creator.name_placeholder")}
                length={140}
                onChange={(value) => setName(value)}
                onLimitReached={(nameLimit) => setNameLimitReached(nameLimit)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
              />
            </div>

            <div className="space-y-2 max-w-3xl">
              <div>
                <Label
                  htmlFor="description"
                  className="text-foreground font-bold"
                >
                  {t("watchlist_creator.description")}
                </Label>
              </div>
              <MaxLengthInput
                id="description"
                name="description"
                placeholder={t("watchlist_creator.description_placeholder")}
                length={1000}
                onChange={(value) => setDescription(value)}
                onLimitReached={(descriptionLimit) =>
                  setDescriptionLimitReached(descriptionLimit)
                }
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <div>
                <Label htmlFor="private" className="text-foreground font-bold">
                  {t("watchlist_creator.private")}
                </Label>
              </div>
              <Checkbox
                id="private"
                name="private"
                checked={privateWatchlist}
                onCheckedChange={(c) => setPrivateWatchlist(Boolean(c))}
              />
            </div>

            <div className="space-y-2">
              <div>
                <Label htmlFor="movies" className="text-foreground font-bold">
                  {t("watchlist_creator.movies")}
                </Label>
                <WatchListCreatorMovies
                  showOnly={true}
                  accessToken={accessToken}
                  watchlist={{
                    movies: {
                      items: [],
                      total: 0,
                      page: 1,
                      size: 0,
                      pages: 1,
                    },
                  }}
                  onAddMovie={handleMovieAdition}
                />
              </div>
            </div>

            <Button
              disabled={
                isLoading ||
                !name ||
                nameLimitReached ||
                descriptionLimitReached
              }
              type="submit"
              className="max-w-3xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t("watchlist_creator.creating")}
                </>
              ) : (
                t("watchlist_creator.create")
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
