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
import { Pagination } from "components/ui/pagination";
import { SidebarNav } from "components/ui/sidebar-nav";
import { UserCard } from "components/ui/user-card";
import {
  BookOpen,
  Calendar,
  Film,
  Heart,
  Settings,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import { Suspense, useState } from "react";
import { Link, useFetcher, useLoaderData } from "react-router-dom";
import {
  getUserFollowers,
  getUserFollowing,
} from "services/api/flixy/server/user-data";
import type { ApiResponse, Page } from "services/api/flixy/types/overall";
import type { UserData } from "services/api/flixy/types/user";
import { getAccessToken } from "services/api/utils";
import type { Route } from "./+types/social";

const DEFAULT_PAGE = 1;
const DEFAULT_FOLLOWERS_PAGE_SIZE = 1;
const DEFAULT_FOLLOWING_PAGE_SIZE = 1;

interface FollowResults {
  followers: Page<UserData>;
  following: Page<UserData>;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const followersPage = parseInt(
    url.searchParams.get("followers") ?? `${DEFAULT_PAGE}`,
    5
  );
  const followingPage = parseInt(
    url.searchParams.get("following") ?? `${DEFAULT_PAGE}`,
    5
  );

  let apiResponse: ApiResponse = {};
  let followResults = {} as FollowResults;

  try {
    followResults.followers = await getUserFollowers(
      followersPage,
      DEFAULT_FOLLOWERS_PAGE_SIZE,
      request
    );

    followResults.following = await getUserFollowing(
      followingPage,
      DEFAULT_FOLLOWING_PAGE_SIZE,
      request
    );

    console.log("Follow Results: ", followResults);

    apiResponse.accessToken = await getAccessToken(request);

    apiResponse.data = followResults;
    return apiResponse;
  } catch (err: Error | any) {
    console.log(
      "API GET /user/followers | GET /user/following said: ",
      err.message
    );

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function SocialPage() {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const apiResponse: ApiResponse = useLoaderData();
  const fetcher = useFetcher();
  const followResults: FollowResults = fetcher.data?.data ?? apiResponse.data;

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
                        <Link to={`/settings`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        </Link>
                      </div>
                      <p className="text-gray-300 mb-3">
                        Passionate cinephile and film critic. Love exploring
                        indie films and classic cinema. Always looking for
                        hidden gems and thought-provoking stories.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
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
                    className="bg-slate-800/50 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
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
                    className="bg-slate-800/50 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
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
                  <Card className="bg-slate-800/50 border-gray-700">
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
                  <Card className="bg-slate-800/50 border-gray-700">
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
                    {showFollowers &&
                      followResults.followers.items.length != 0 && (
                        <Card className="bg-slate-800/50 border-gray-700 mb-6">
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
                              <Pagination
                                itemsPage={followResults.followers}
                                onPageChange={(page: number) => {
                                  fetcher.load(
                                    `/social?followers=${page}&following=${followResults.following.page}`
                                  );
                                }}
                              >
                                <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
                                  {followResults.followers.items.map(
                                    (follower) => (
                                      <UserCard
                                        key={follower.id}
                                        user={follower}
                                        accessToken={String(
                                          apiResponse.accessToken
                                        )}
                                      />
                                    )
                                  )}
                                </div>
                              </Pagination>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                    {showFollowing &&
                      followResults.following.items.length != 0 && (
                        <Card className="bg-slate-800/50 border-gray-700 mb-6">
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
                              <Pagination
                                itemsPage={followResults.following}
                                onPageChange={(page: number) => {
                                  fetcher.load(
                                    `/social?followers=${followResults.followers.page}&following=${page}`
                                  );
                                }}
                              >
                                <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
                                  {followResults.following.items.map(
                                    (follow) => (
                                      <UserCard
                                        key={follow.id}
                                        user={follow}
                                        accessToken={String(
                                          apiResponse.accessToken
                                        )}
                                      />
                                    )
                                  )}
                                </div>
                              </Pagination>
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
