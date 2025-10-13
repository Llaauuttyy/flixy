import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "../button";

export function GetRecommendations() {
  const { t } = useTranslation();
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-pink-600/20 border border-pink-500/40 p-8 h-full hover:border-pink-500/60 transition-all duration-300">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-2xl opacity-15 group-hover:opacity-25 transition-opacity duration-500" />

      {/* Floating icons */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="w-16 h-16 text-pink-500" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Zap className="w-12 h-12 text-pink-500" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-semibold text-pink-500">
              {t("get_recommendations_component.ai_powered")}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
            {t("get_recommendations_component.discover_next_favorite")}
          </h2>

          <p className="text-slate-400 leading-relaxed">
            {t(
              "get_recommendations_component.discover_next_favorite_description"
            )}
          </p>
        </div>

        <Link to="/recommendations" className="w-full">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all hover:scale-[1.02] group-hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t("get_recommendations_component.get_recommendations_button")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
