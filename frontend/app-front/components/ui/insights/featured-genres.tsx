import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MovieGenre } from "services/api/flixy/types/movie";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

interface FeaturedGenresProps {
  genreStats: MovieGenre[];
}

export function FeaturedGenres({ genreStats }: FeaturedGenresProps) {
  const { t } = useTranslation();

  const bestGenres = (() =>
    genreStats.filter(
      (g) =>
        g.average_rating ===
        Math.max(...genreStats.map((g) => g.average_rating))
    ))();

  const worstGenres = (() =>
    genreStats.filter(
      (g) =>
        g.average_rating ===
        Math.min(...genreStats.map((g) => g.average_rating))
    ))();

  const mostWatchedGenres = (() =>
    genreStats.filter(
      (g) =>
        g.movies_watched ===
        Math.max(...genreStats.map((g) => g.movies_watched))
    ))();

  const leastWatchedGenres = (() =>
    genreStats.filter(
      (g) =>
        g.movies_watched ===
        Math.min(...genreStats.map((g) => g.movies_watched))
    ))();

  function getAmountText(genre: MovieGenre) {
    if (genre.movies_watched > 1)
      return t("profile.insights.featured_genres.movies");
    else return t("profile.insights.featured_genres.one_movie");
  }

  function renderGenreCardContent(
    sectionName: string,
    relatedText: string,
    relatedField: string,
    genres: MovieGenre[],
    fromColor: string,
    toColor: string
  ) {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
          {sectionName}
        </h4>
        {genres.map((genre) => (
          <div
            className={`flex items-center gap-3 p-3 bg-gradient-to-r from-${fromColor}-500/20 to-${toColor}-500/20 rounded-lg border border-${fromColor}-500/30`}
          >
            <div className={`w-3 h-3 bg-${fromColor}-500 rounded-full`}></div>
            <div className="flex-1">
              <div className="text-white font-semibold">{genre.name}</div>
              <div className="text-slate-400 text-sm">
                {relatedField === "Rating" ? (
                  <>{genre.average_rating}</>
                ) : (
                  <>{genre.movies_watched}</>
                )}{" "}
                {relatedField === "Rating" ? relatedText : getAmountText(genre)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          {t("profile.insights.featured_genres.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[360px] overflow-y-auto">
        {genreStats.length === 0 ? (
          <p key={"no-activity"} className="text-slate-400 italic">
            {t("profile.insights.no_activity")}
          </p>
        ) : (
          <>
            {renderGenreCardContent(
              t("profile.insights.featured_genres.best_rated"),
              `⭐ ${t("profile.insights.featured_genres.average")}`,
              "Rating",
              bestGenres,
              "purple",
              "pink"
            )}

            {renderGenreCardContent(
              t("profile.insights.featured_genres.worst_rated"),
              `⭐ ${t("profile.insights.featured_genres.average")}`,
              "Rating",
              worstGenres,
              "purple",
              "pink"
            )}

            {renderGenreCardContent(
              t("profile.insights.featured_genres.most_watched"),
              "movies",
              "Movies",
              mostWatchedGenres,
              "blue",
              "cyan"
            )}

            {renderGenreCardContent(
              t("profile.insights.featured_genres.least_watched"),
              "movies",
              "Movies",
              leastWatchedGenres,
              "blue",
              "cyan"
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
