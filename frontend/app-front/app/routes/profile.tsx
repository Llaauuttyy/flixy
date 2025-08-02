import { HeaderFull } from "components/ui/header-full";
import { BadgeGallery } from "components/ui/insights/badge-gallery";
import { FeaturedGenres } from "components/ui/insights/featured-genres";
import { GenreStatistics } from "components/ui/insights/genre-statistics";
import { OverallStats } from "components/ui/insights/overall-stats";
import { QuickStats } from "components/ui/insights/quick-stats";
import { SidebarNav } from "components/ui/sidebar-nav";
import { BookOpen, Clock, Eye, List } from "lucide-react";

export default function MovieInsights() {
  const userStats = {
    totalReviews: 247,
    moviesWatched: 1834,
    moviesRated: 1456,
    totalWatchTime: 3847,
    averageRating: 3.7,
  };

  const genreStats = [
    {
      genre: "Drama",
      avgRating: 5.6,
      moviesWatched: 312,
      color: "bg-purple-500",
    },
    {
      genre: "Thriller",
      avgRating: 8.0,
      moviesWatched: 198,
      color: "bg-pink-500",
    },
    {
      genre: "Sci-Fi",
      avgRating: 3.9,
      moviesWatched: 156,
      color: "bg-blue-500",
    },
    {
      genre: "Comedy",
      avgRating: 3.5,
      moviesWatched: 234,
      color: "bg-yellow-500",
    },
    { genre: "Horror", avgRating: 3.3, moviesWatched: 89, color: "bg-red-500" },
    {
      genre: "Action",
      avgRating: 3.8,
      moviesWatched: 267,
      color: "bg-orange-500",
    },
  ];

  const badges = [
    {
      name: "Prolific Critic",
      description: "More than 200 reviews written",
      icon: BookOpen,
      earned: true,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      name: "Movie Marathon",
      description: "More than 1000 movies watched",
      icon: Eye,
      earned: true,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      name: "Expert Curator",
      description: "More than 50 lists created",
      icon: List,
      earned: false,
      color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
    {
      name: "Dedicated Cinephile",
      description: "More than 3000 hours watched",
      icon: Clock,
      earned: true,
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="sticky top-0 z-50 bg-gray-900">
          <HeaderFull />
        </div>
        {/* Header */}
        <div className="p-6 pb-0">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Flixy
            </span>{" "}
            Insights
          </h1>
          <p className="text-gray-300">
            Discover your patterns and achievements as a cinephile
          </p>
        </div>

        {/* Stats Overview */}
        <OverallStats userStats={userStats} />

        {/* Genre Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pb-0">
          <GenreStatistics genreStats={genreStats} />
          <FeaturedGenres genreStats={genreStats} />
        </div>

        {/* Badges/Achievements */}
        <div className="p-6 pb-0">
          <BadgeGallery badges={badges} />
        </div>

        {/* Quick Stats */}
        <QuickStats userStats={userStats} />
      </div>
    </div>
  );
}
