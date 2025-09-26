"use client";

import { Avatar, AvatarFallback } from "components/ui/avatar";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import {
  BookOpen,
  Calendar,
  Film,
  Heart,
  MapPin,
  Settings,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import { Suspense, useState } from "react";

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState("reviews");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
          <SidebarNav />
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Header */}
            <HeaderFull />
            <main className="flex-1 overflow-auto">
              <Suspense></Suspense>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-start space-x-6 mb-6">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-bold">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-white">
                          John Doe
                        </h1>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                      <p className="text-gray-300 mb-3">
                        Passionate cinephile and film critic. Love exploring
                        indie films and classic cinema. Always looking for
                        hidden gems and thought-provoking stories.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>Los Angeles, CA</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined March 2022</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card
                    className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
                    onClick={() => {
                      setShowFollowing(true);
                      setShowFollowers(false);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Following</p>
                          <p className="text-2xl font-bold text-white">156</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
                    onClick={() => {
                      setShowFollowers(true);
                      setShowFollowing(false);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <UserPlus className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Followers</p>
                          <p className="text-2xl font-bold text-white">89</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Film className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">
                            Movies Watched
                          </p>
                          <p className="text-2xl font-bold text-white">1,234</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-5 w-5 text-red-400" />
                        <div>
                          <p className="text-sm text-gray-400">Reviews</p>
                          <p className="text-2xl font-bold text-white">342</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-3">
                    {showFollowers && (
                      <Card className="bg-gray-800 border-gray-700 mb-6">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white">
                              Followers
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowFollowers(false)}
                              className="text-gray-400 hover:text-white"
                            >
                              ✕
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              {
                                name: "Sarah Wilson",
                                username: "@sarahw",
                                movies: 456,
                                mutual: 12,
                              },
                              {
                                name: "Mike Chen",
                                username: "@mikechen",
                                movies: 234,
                                mutual: 8,
                              },
                              {
                                name: "Emma Rodriguez",
                                username: "@emmarodz",
                                movies: 678,
                                mutual: 15,
                              },
                              {
                                name: "David Kim",
                                username: "@davidk",
                                movies: 123,
                                mutual: 6,
                              },
                              {
                                name: "Lisa Thompson",
                                username: "@lisat",
                                movies: 345,
                                mutual: 9,
                              },
                            ].map((user, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800"
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback className="bg-gray-700 text-gray-300">
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-white">
                                      {user.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      {user.username} • {user.movies} movies •{" "}
                                      {user.mutual} mutual friends
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
                                >
                                  View Profile
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {showFollowing && (
                      <Card className="bg-gray-800 border-gray-700 mb-6">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white">
                              Following
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowFollowing(false)}
                              className="text-gray-400 hover:text-white"
                            >
                              ✕
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              {
                                name: "Christopher Nolan",
                                username: "@cnolan",
                                movies: 12,
                                verified: true,
                              },
                              {
                                name: "Film Critics United",
                                username: "@filmcritics",
                                movies: 2456,
                                verified: true,
                              },
                              {
                                name: "Alex Martinez",
                                username: "@alexm",
                                movies: 567,
                                mutual: 23,
                              },
                              {
                                name: "Cinema Paradiso",
                                username: "@cinemaparadiso",
                                movies: 1234,
                                verified: true,
                              },
                              {
                                name: "Rachel Green",
                                username: "@rachelg",
                                movies: 234,
                                mutual: 18,
                              },
                            ].map((user, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800"
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback className="bg-gray-700 text-gray-300">
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <p className="font-medium text-white">
                                        {user.name}
                                      </p>
                                      {user.verified && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs bg-blue-600 text-white"
                                        >
                                          ✓
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-400">
                                      {user.username} • {user.movies} movies
                                      {user.mutual &&
                                        ` • ${user.mutual} mutual friends`}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
                                >
                                  View Profile
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-6">
                      {/* Recent Reviews Section */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">
                            Recent Reviews
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            My latest thoughts on films I've watched
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              {
                                movie: "Oppenheimer",
                                rating: 9,
                                date: "2 days ago",
                                content:
                                  "A masterpiece of biographical filmmaking. Nolan's non-linear narrative perfectly captures the complexity of Oppenheimer's moral dilemma. The cinematography and sound design are exceptional.",
                                likes: 24,
                                comments: 8,
                              },
                              {
                                movie: "The Dark Knight",
                                rating: 10,
                                date: "1 week ago",
                                content:
                                  "Still the greatest superhero film ever made. Heath Ledger's Joker is unforgettable, and the moral complexity elevates it beyond typical comic book fare.",
                                likes: 45,
                                comments: 12,
                              },
                              {
                                movie: "Parasite",
                                rating: 9,
                                date: "2 weeks ago",
                                content:
                                  "Bong Joon-ho crafts a brilliant social thriller that works on multiple levels. The cinematography and production design are flawless.",
                                likes: 31,
                                comments: 15,
                              },
                            ].map((review, index) => (
                              <Card
                                key={index}
                                className="bg-gray-700 border-gray-600"
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-purple-400 text-lg">
                                        {review.movie}
                                      </span>
                                      <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="font-medium text-white">
                                          {review.rating}/10
                                        </span>
                                      </div>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-gray-600 text-gray-300"
                                    >
                                      {review.date}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-300 mb-3">
                                    {review.content}
                                  </p>
                                  <div className="flex items-center space-x-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-400 hover:text-red-400 hover:bg-gray-600"
                                    >
                                      <Heart className="h-4 w-4 mr-1" />
                                      {review.likes}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-400 hover:text-blue-400 hover:bg-gray-600"
                                    >
                                      <BookOpen className="h-4 w-4 mr-1" />
                                      {review.comments} comments
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Favorite Movies Section */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">
                            Favorite Movies
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            My all-time favorite films that shaped my love for
                            cinema
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              {
                                title: "The Godfather",
                                year: "1972",
                                rating: 10,
                                genre: "Crime Drama",
                              },
                              {
                                title: "2001: A Space Odyssey",
                                year: "1968",
                                rating: 10,
                                genre: "Sci-Fi",
                              },
                              {
                                title: "Pulp Fiction",
                                year: "1994",
                                rating: 9,
                                genre: "Crime",
                              },
                              {
                                title: "Seven Samurai",
                                year: "1954",
                                rating: 10,
                                genre: "Action Drama",
                              },
                              {
                                title: "Citizen Kane",
                                year: "1941",
                                rating: 9,
                                genre: "Drama",
                              },
                              {
                                title: "Vertigo",
                                year: "1958",
                                rating: 9,
                                genre: "Thriller",
                              },
                            ].map((movie, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border border-gray-600 bg-gray-700"
                              >
                                <div>
                                  <p className="font-medium text-white">
                                    {movie.title}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {movie.year} • {movie.genre}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="font-medium text-white">
                                    {movie.rating}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Watchlist Section */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">
                            Watchlist
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Films I'm excited to see soon
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              {
                                title: "Dune: Part Two",
                                year: "2024",
                                priority: "High",
                                addedDate: "3 days ago",
                              },
                              {
                                title: "The Zone of Interest",
                                year: "2023",
                                priority: "High",
                                addedDate: "1 week ago",
                              },
                              {
                                title: "Poor Things",
                                year: "2023",
                                priority: "Medium",
                                addedDate: "2 weeks ago",
                              },
                              {
                                title: "Killers of the Flower Moon",
                                year: "2023",
                                priority: "High",
                                addedDate: "3 weeks ago",
                              },
                              {
                                title: "The Holdovers",
                                year: "2023",
                                priority: "Medium",
                                addedDate: "1 month ago",
                              },
                            ].map((movie, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border border-gray-600 bg-gray-700"
                              >
                                <div>
                                  <p className="font-medium text-white">
                                    {movie.title}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {movie.year} • Added {movie.addedDate}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${
                                      movie.priority === "High"
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-600 text-gray-300"
                                    }`}
                                  >
                                    {movie.priority}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white bg-transparent"
                                  >
                                    Mark as Watched
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">
                          Movie Stats
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Your viewing habits at a glance
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Average Rating</span>
                          <span className="text-white font-medium">7.8/10</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Favorite Genre</span>
                          <span className="text-white font-medium">Drama</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">This Month</span>
                          <span className="text-white font-medium">
                            23 movies
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">
                            Favorite Director
                          </span>
                          <span className="text-white font-medium">
                            C. Nolan
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Popular Hashtags */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">
                          Favorite Genres
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "#Drama",
                            "#SciFi",
                            "#Thriller",
                            "#Crime",
                            "#Biography",
                            "#Mystery",
                            "#Horror",
                            "#Comedy",
                          ].map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-gray-600 bg-gray-700 text-gray-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">
                          Recent Activity
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          What you've been up to lately
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <p className="text-gray-300">
                            <span className="text-purple-400">Reviewed</span>{" "}
                            Oppenheimer
                          </p>
                          <p className="text-gray-500">2 days ago</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-300">
                            <span className="text-green-400">
                              Added to watchlist
                            </span>{" "}
                            Dune: Part Two
                          </p>
                          <p className="text-gray-500">3 days ago</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-300">
                            <span className="text-blue-400">Followed</span>{" "}
                            Christopher Nolan
                          </p>
                          <p className="text-gray-500">1 week ago</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
