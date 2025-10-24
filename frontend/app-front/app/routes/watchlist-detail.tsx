import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import i18n from "i18n/i18n";

import { AddMovieWatchList } from "components/ui/add-movie-watchlist";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { ConfirmationBox } from "components/ui/confirmation-box";
import { MaxLengthInput } from "components/ui/max-length-input";
import WatchListMovies from "components/ui/watchlist/watchlist-movies";
import WatchListMoviesDisplay from "components/ui/watchlist/watchlist-movies-display";
import { Clock, Edit, Eye, Film, Loader2, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  handleWatchListDeletion,
  handleWatchListEdition,
} from "services/api/flixy/client/watchlists";
import { getWatchList } from "services/api/flixy/server/watchlists";
import type { MovieDataGet } from "services/api/flixy/types/movie";
import type {
  WatchListDelete,
  WatchListEdit,
  WatchListGet,
} from "services/api/flixy/types/watchlist";
import { getAccessToken, getCachedUserData } from "services/api/utils";
import type { ApiResponse } from "../../services/api/flixy/types/overall";
import type { Route } from "./+types/watchlist-detail";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export async function loader({ request, params }: Route.LoaderArgs) {
  let apiResponse: ApiResponse = {};

  const watchListId = params.watchListId;

  if (
    !watchListId ||
    watchListId.trim() === "" ||
    isNaN(Number(watchListId)) ||
    Number(watchListId) < 1
  ) {
    apiResponse.error = "Invalid watchlist ID";
    return apiResponse;
  }
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? `${DEFAULT_PAGE}`, 10);

  let watchlist: WatchListGet = {} as WatchListGet;

  try {
    watchlist = await getWatchList(
      watchListId,
      page,
      DEFAULT_PAGE_SIZE,
      request
    );

    console.log(`Watchlist ${watchListId}: `, watchlist);

    apiResponse.accessToken = await getAccessToken(request);

    apiResponse.data = { watchlist, user: await getCachedUserData(request) };
    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /watchlist/:watchListId said: ", err.message);

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function WatchListsPage() {
  const apiResponse: ApiResponse = useLoaderData();

  dayjs.locale(i18n.language || "en");

  const navigator = useNavigate();

  const { t } = useTranslation();

  const [apiDeleteResponse, setApiDeleteResponse] = useState<ApiResponse>({});
  const [apiEditResponse, setApiEditResponse] = useState<ApiResponse>({});

  const [watchlist, setWatchlist] = useState<WatchListGet>(
    apiResponse.data?.watchlist || {}
  );

  const [moviesToDelete, setMoviesToDelete] = useState<MovieDataGet[]>([]);
  const [moviesToAdd, setMoviesToAdd] = useState<MovieDataGet[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState(watchlist.name || "");
  const [description, setDescription] = useState(watchlist.description || "");

  const [isLoading, setIsLoading] = useState(false);

  const [nameLimitReached, setNameLimitReached] = useState(false);
  const [descriptionLimitReached, setDescriptionLimitReached] = useState(false);

  const cancelEditWatchList = async () => {
    setIsEditing(false);
    setName(watchlist.name || "");
    setDescription(watchlist.description || "");
    setMoviesToDelete([]);
    setMoviesToAdd([]);
  };

  const setEditWatchList = async () => {
    setIsEditing(true);
  };

  const handleEditWatchList = async () => {
    setIsLoading(true);
    let apiEditResponse: ApiResponse = {};
    let movieIdsToDelete: number[] = moviesToDelete.map((movie) =>
      Number(movie.id)
    );
    let movieIdsToAdd: number[] = moviesToAdd.map((movie) => Number(movie.id));

    let watchListData: WatchListEdit = {
      watchlist_id: watchlist.id,
      data: {
        name: name ? name.trim() : undefined,
        description: description ? description.trim() : undefined,
        movie_ids_to_delete:
          movieIdsToDelete.length > 0 ? movieIdsToDelete : undefined,
        movie_ids_to_add: movieIdsToAdd.length > 0 ? movieIdsToAdd : undefined,
      },
    };

    try {
      apiEditResponse.data = await handleWatchListEdition(
        String(apiResponse.accessToken),
        watchListData
      );

      navigator(0);
    } catch (err: Error | any) {
      console.log("API PATCH /watchlist said: ", err.message);

      if (err instanceof TypeError) {
        apiEditResponse.error = t("exceptions.service_error");
        setApiEditResponse(apiEditResponse);
      }

      apiEditResponse.error = err.message;
      setApiEditResponse(apiEditResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWatchListMovieDeletion = (movie: MovieDataGet) => {
    setMoviesToDelete((prevMovies) => {
      if (prevMovies.includes(movie)) {
        return prevMovies.filter((m) => m !== movie);
      } else {
        return [...prevMovies, movie];
      }
    });

    console.log(moviesToDelete);
  };

  const handleEditWatchListMovieAddition = (movie: MovieDataGet) => {
    setMoviesToAdd((prevMovies) => {
      if (prevMovies.includes(movie)) {
        return prevMovies.filter((m) => m !== movie);
      } else {
        return [...prevMovies, movie];
      }
    });
  };

  const handleConfirmationBox = (value: boolean) => {
    if (value) {
      handleDeleteWatchList();
    }
  };

  const handleDeleteWatchList = async () => {
    setIsDeleting(true);

    let apiDeleteResponse: ApiResponse = {};

    const watchListDelete: WatchListDelete = {
      watchlist_id: watchlist.id,
    };

    try {
      let response = await handleWatchListDeletion(
        String(apiResponse.accessToken),
        watchListDelete
      );

      console.log(response);

      navigator("/watchlists");
    } catch (err: Error | any) {
      console.log("API DELETE /watchlist/:watchListId ", err.message);

      if (err instanceof TypeError) {
        apiDeleteResponse.error = t("exceptions.service_error");
        setApiDeleteResponse(apiDeleteResponse);
      }

      apiDeleteResponse.error = err.message;
      setApiDeleteResponse(apiDeleteResponse);
    }

    setIsDeleting(false);
  };

  if (apiResponse.error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <HeaderFull />

          <main className="overflow-auto mx-auto py-6 px-6 md:px-6">
            <p className="text-gray-400 mb-6">{apiResponse.error}</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <SidebarNav />

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="sticky top-0 z-50 bg-gray-900 shadow-lg">
          <HeaderFull />
        </div>

        <main className="flex-1 p-6 space-y-8">
          <section>
            <div className="flex items-center justify-between">
              <div className="grid">
                {isEditing ? (
                  <div>
                    <h1 className="text-foreground font-bold">
                      {t("watchlist_detail.is_editing.name")}
                    </h1>
                    <MaxLengthInput
                      id="name"
                      name="name"
                      placeholder={t("watchlist_creator.name_placeholder")}
                      value={name}
                      length={140}
                      onChange={(value) => setName(value)}
                      onLimitReached={(nameLimit) =>
                        setNameLimitReached(nameLimit)
                      }
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {watchlist.name}
                  </h1>
                )}
                {isEditing ? (
                  <div>
                    <p className="text-foreground font-bold">
                      {t("watchlist_detail.is_editing.description")}
                    </p>
                    <MaxLengthInput
                      id="description"
                      name="description"
                      placeholder={t(
                        "watchlist_creator.description_placeholder"
                      )}
                      value={description}
                      length={1000}
                      onChange={(value) => setDescription(value)}
                      onLimitReached={(descriptionLimit) =>
                        setDescriptionLimitReached(descriptionLimit)
                      }
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                    />
                  </div>
                ) : watchlist.description ? (
                  <p className="text-gray-300 mb-4">{watchlist.description}</p>
                ) : (
                  <p className="italic text-gray-300 mb-4">
                    {t("watchlist_detail.no_description")}
                  </p>
                )}
                {apiDeleteResponse.error && (
                  <p className="text-red-400 mb-4">{apiResponse.error}</p>
                )}
              </div>
              <div className="flex item-center">
                {!isEditing && (
                  <Button
                    onClick={setEditWatchList}
                    className="mr-1 rounded-lg border bg-card text-card-foreground shadow-sm border-slate-700 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50"
                  >
                    <Edit size={30} />
                  </Button>
                )}
                {!isEditing && (
                  <ConfirmationBox
                    isAccepted={(value) => handleConfirmationBox(value)}
                    title={t("confirmation_box.watchlist.title")}
                    subtitle={t("confirmation_box.watchlist.subtitle")}
                    cancelText={t("confirmation_box.watchlist.cancel")}
                    acceptText={t("confirmation_box.watchlist.accept")}
                  >
                    <Button
                      disabled={isDeleting}
                      className="rounded-lg border bg-card text-card-foreground shadow-sm border-slate-700 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50"
                    >
                      <Trash size={30} color="red" />
                    </Button>
                  </ConfirmationBox>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="flex flex-wrap gap-6 text-sm bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">
                    {watchlist.insights.total_movies}{" "}
                    {t("watchlist_detail.details.movies")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">
                    {t("watchlist_detail.details.created")}{" "}
                    {dayjs.utc(watchlist.created_at).fromNow()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">
                    {t("watchlist_detail.details.updated")}{" "}
                    {dayjs.utc(watchlist.updated_at).fromNow()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">
                    {t("watchlist_detail.visibility_public")}
                  </span>
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {t("watchlist_detail.movies_display")}
            </h2>
            {watchlist.movies?.items ? (
              <WatchListMovies
                accessToken={String(apiResponse.accessToken)}
                isSeeWatchList={true}
                watchList={watchlist}
                isEditWatchList={isEditing}
                onMovieDeletion={handleEditWatchListMovieDeletion}
                highlightedMovies={moviesToDelete.map((movie) =>
                  Number(movie.id)
                )}
              />
            ) : (
              <p className="italic text-gray-300 mb-4">
                {t("watchlist_detail.no_movies")}
              </p>
            )}
          </section>

          {isEditing && (
            <section className="grid">
              <h2 className="text-xl font-semibold text-white mb-4">
                {t("watchlist_detail.is_editing.add_movies")}
              </h2>
              <div className="flex justify-center">
                <div className="pr-3">
                  <AddMovieWatchList
                    showEdit={true}
                    accessToken={String(apiResponse.accessToken)}
                    watchListId={watchlist.id}
                    onMovieSelect={handleEditWatchListMovieAddition}
                  />
                </div>
                <WatchListMoviesDisplay
                  accessToken={String(apiResponse.accessToken)}
                  watchlist_id={watchlist.id}
                  isSeeWatchList={true}
                  movies={{
                    items: moviesToAdd,
                    total: moviesToAdd.length,
                    page: 1,
                    size: moviesToAdd.length,
                    pages: 1,
                  }}
                  isEditWatchList={true}
                  onMovieDeletion={handleEditWatchListMovieAddition}
                />
              </div>
            </section>
          )}

          <section>
            {isEditing && (
              <>
                <Button
                  onClick={handleEditWatchList}
                  disabled={
                    isLoading || descriptionLimitReached || nameLimitReached
                  }
                  className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {t("watchlist_detail.is_editing.saving")}
                    </>
                  ) : (
                    <>{t("watchlist_detail.is_editing.save")}</>
                  )}
                </Button>
                <Button
                  onClick={cancelEditWatchList}
                  variant={"outline"}
                  className="ml-2 hover:bg-red-700 hover:text-white text-red-500 border-red-500 disabled:opacity-50"
                >
                  {t("review_input.cancel_button")}
                </Button>
              </>
            )}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-400" />
                {t("watchlist_detail.statistics.title")}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    {t("watchlist_detail.statistics.total_movies")}
                  </span>
                  <span className="text-white font-medium">
                    {watchlist.insights.total_movies}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    {t("watchlist_detail.statistics.watched")}
                  </span>
                  <span className="text-white font-medium">
                    {watchlist.insights.total_watched_movies}{" "}
                    <span className="text-slate-300 text-sm">
                      (of {watchlist.insights.total_movies})
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    <Badge className="bg-yellow-400 text-black font-bold rounded-sm px-1.5 py-0.5">
                      IMDb
                    </Badge>{" "}
                    Rating
                  </span>
                  <span className="text-white font-medium">
                    {watchlist.insights.average_rating_imdb.toFixed(1)}{" "}
                    <Badge
                      variant="secondary"
                      className="bg-gray-700 text-gray-300"
                    >
                      {(watchlist.insights.average_rating_imdb / 2).toFixed(1)}
                      <Badge className="m-0 text-purple-400 font-bold rounded-sm px-0.5">
                        Flixy
                      </Badge>
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    <Link to={`/profile`}>
                      <span className="text-purple-400 font-bold hover:underline">
                        {t("watchlist_detail.statistics.your")}
                      </span>{" "}
                    </Link>
                    Rating
                  </span>
                  <span className="text-white font-medium">
                    {watchlist.insights.average_rating_user.toFixed(1)}{" "}
                    <Badge
                      variant="secondary"
                      className="bg-gray-700 text-gray-300"
                    >
                      {(watchlist.insights.average_rating_user * 2).toFixed(1)}
                      <Badge className="text-yellow-400 font-bold rounded-sm px-0.5">
                        IMDb
                      </Badge>
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    {t("watchlist_detail.visibility")}
                  </span>
                  <span className="text-white font-medium">
                    {t("watchlist_detail.visibility_public")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                {t("watchlist_detail.activity.title")}
              </h3>
              <div className="space-y-3 text-sm">
                {watchlist.activity.length !== 0 ? (
                  watchlist.activity.map(
                    (activity: any, index: number) =>
                      activity.action === "Add" && (
                        <div className="flex items-center gap-3" key={index}>
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <Link to={`/movies/${activity.target.id}`}>
                            <span className="text-slate-300">
                              {t("watchlist_detail.activity.added")}{" "}
                              <span className="text-purple-400 font-bold hover:underline cursor-pointer">
                                {activity.target.title}
                              </span>{" "}
                              {dayjs.utc(activity.timestamp).fromNow()}.
                            </span>
                          </Link>
                        </div>
                      )
                  )
                ) : (
                  <p className="italic text-gray-300 mb-4">
                    {t("watchlist_detail.activity.no_activity")}
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
