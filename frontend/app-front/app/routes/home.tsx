import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Input } from "components/ui/input";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Textarea } from "components/ui/textarea";
import {
  Activity,
  Bell,
  BookOpen,
  Film,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Share2,
  Sparkle,
  Sparkles,
  Star,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Suspense, useState } from "react";

import { useSubmit } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { Link, redirect } from "react-router";
import type { Route } from "./+types/login";
import { getSession, commitSession, destroySession } from "../session/sessions.server";
import { HeaderFull } from "../../components/ui/header-full";


export async function loader({request}: Route.LoaderArgs) {
  const session = await getSession(
      request.headers.get("Cookie")
  );

  if (session.has("accessToken")) {
      // Me quedo en /home
      return null;
  }

  return redirect("/login", {
      headers: {
          "Set-Cookie": await commitSession(session),
      },
  })
}

export async function action({request,}: Route.ActionArgs) {
  const session = await getSession(
      request.headers.get("Cookie")
  );

  return redirect("/login", {
      headers: {
          "Set-Cookie": await destroySession(session),
      },
  });
}

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <html lang="es">
      <body>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
          <SidebarNav />
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Header */}
            <HeaderFull />
            <main className="flex-1 overflow-auto">
              <Suspense></Suspense>
              <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Red Social
                  </h1>
                  <p className="text-gray-300">
                    Conecta con otros cinéfilos y comparte tu pasión por el cine
                  </p>
                </div>

                {/* Social Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Siguiendo</p>
                          <p className="text-2xl font-bold text-white">156</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <UserPlus className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Seguidores</p>
                          <p className="text-2xl font-bold text-white">89</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Posts</p>
                          <p className="text-2xl font-bold text-white">234</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-5 w-5 text-red-400" />
                        <div>
                          <p className="text-sm text-gray-400">Me gusta</p>
                          <p className="text-2xl font-bold text-white">1.2k</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                        <TabsTrigger
                          value="feed"
                          className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                        >
                          Feed de Actividad
                        </TabsTrigger>
                        <TabsTrigger
                          value="friends"
                          className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                        >
                          Amigos
                        </TabsTrigger>
                        <TabsTrigger
                          value="trending"
                          className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                        >
                          Tendencias
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="feed" className="space-y-4">
                        {/* Create Post */}
                        <Card className="bg-gray-800 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-lg text-white">
                              ¿Qué película has visto recientemente?
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Comparte tu opinión sobre una película..."
                                className="bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-500 focus:border-purple-500"
                              />
                              <div className="flex justify-between items-center">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                                  >
                                    <Film className="h-4 w-4 mr-2" />
                                    Agregar película
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                                  >
                                    <Star className="h-4 w-4 mr-2" />
                                    Calificar
                                  </Button>
                                </div>
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Publicar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Activity Feed */}
                        <div className="space-y-4">
                          {[
                            {
                              user: "María González",
                              avatar: "MG",
                              action: "ha calificado",
                              movie: "Oppenheimer",
                              rating: 9,
                              time: "hace 2 horas",
                              content:
                                "Una obra maestra cinematográfica. Nolan vuelve a sorprender con su narrativa no lineal y las actuaciones son excepcionales.",
                              likes: 24,
                              comments: 8,
                            },
                            {
                              user: "Carlos Ruiz",
                              avatar: "CR",
                              action: "ha agregado a favoritos",
                              movie: "The Dark Knight",
                              time: "hace 4 horas",
                              content:
                                "Después de verla por décima vez, sigue siendo perfecta. Heath Ledger es inolvidable como el Joker.",
                              likes: 18,
                              comments: 5,
                            },
                            {
                              user: "Ana Martín",
                              avatar: "AM",
                              action: "ha escrito una reseña de",
                              movie: "Barbie",
                              rating: 8,
                              time: "hace 6 horas",
                              content:
                                "Una película que va más allá de lo que esperaba. Divertida, inteligente y con un mensaje profundo sobre la identidad.",
                              likes: 31,
                              comments: 12,
                            },
                          ].map((post, index) => (
                            <Card
                              key={index}
                              className="bg-gray-800 border-gray-700"
                            >
                              <CardContent className="p-4">
                                <div className="flex space-x-3">
                                  <Avatar>
                                    <AvatarFallback className="bg-gray-700 text-gray-300">
                                      {post.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="font-medium text-white">
                                        {post.user}
                                      </span>
                                      <span className="text-gray-400">
                                        {post.action}
                                      </span>
                                      <span className="font-medium text-purple-400">
                                        {post.movie}
                                      </span>
                                      {post.rating && (
                                        <div className="flex items-center space-x-1">
                                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                          <span className="font-medium text-white">
                                            {post.rating}
                                          </span>
                                        </div>
                                      )}
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-gray-700 text-gray-300"
                                      >
                                        {post.time}
                                      </Badge>
                                    </div>
                                    <p className="text-gray-300 mb-3">
                                      {post.content}
                                    </p>
                                    <div className="flex items-center space-x-4">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                                      >
                                        <Heart className="h-4 w-4 mr-1" />
                                        {post.likes}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        {post.comments}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-green-400 hover:bg-gray-700"
                                      >
                                        <Share2 className="h-4 w-4 mr-1" />
                                        Compartir
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="friends" className="space-y-4">
                        <Card className="bg-gray-800 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white">
                              Tus Amigos Cinéfilos
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              Conecta con otros amantes del cine
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[
                                {
                                  name: "María González",
                                  movies: 234,
                                  reviews: 45,
                                  mutual: 12,
                                },
                                {
                                  name: "Carlos Ruiz",
                                  movies: 189,
                                  reviews: 32,
                                  mutual: 8,
                                },
                                {
                                  name: "Ana Martín",
                                  movies: 156,
                                  reviews: 28,
                                  mutual: 15,
                                },
                                {
                                  name: "Luis Torres",
                                  movies: 298,
                                  reviews: 67,
                                  mutual: 6,
                                },
                              ].map((friend, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Avatar>
                                      <AvatarFallback className="bg-gray-700 text-gray-300">
                                        {friend.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-white">
                                        {friend.name}
                                      </p>
                                      <p className="text-sm text-gray-400">
                                        {friend.movies} películas •{" "}
                                        {friend.reviews} reseñas •{" "}
                                        {friend.mutual} amigos en común
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                                  >
                                    Ver perfil
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="trending" className="space-y-4">
                        <Card className="bg-gray-800 border-gray-700">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-white">
                              <TrendingUp className="h-5 w-5 text-orange-400" />
                              <span>Tendencias de la Comunidad</span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              Lo más popular entre los usuarios
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[
                                {
                                  movie: "Oppenheimer",
                                  discussions: 156,
                                  avgRating: 8.9,
                                },
                                {
                                  movie: "Barbie",
                                  discussions: 134,
                                  avgRating: 7.8,
                                },
                                {
                                  movie: "Spider-Man: Across the Spider-Verse",
                                  discussions: 98,
                                  avgRating: 9.1,
                                },
                                {
                                  movie: "Guardians of the Galaxy Vol. 3",
                                  discussions: 87,
                                  avgRating: 8.2,
                                },
                              ].map((trend, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800"
                                >
                                  <div>
                                    <p className="font-medium text-white">
                                      {trend.movie}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      {trend.discussions} discusiones activas
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span className="font-medium text-white">
                                      {trend.avgRating}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                    {/* Suggested Friends */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">
                          Do not know what to watch?
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Get personalized movie suggestions based on your taste
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link to='/recommendations'>
                          <Button
                            variant="outline"
                            size="sm"
                            // className="borde r-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                            className="bg-gradient-to-r hover:border-transparent hover:from-purple-700 hover:to-pink-700 hover:text-white"
                          >
                            <Sparkles className="h-3 w-3" />
                            Give it a try!
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    {/* Popular Hashtags */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">
                          Hashtags Populares
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "#Oppenheimer",
                            "#Barbie",
                            "#Marvel",
                            "#DC",
                            "#Nolan",
                            "#SciFi",
                            "#Drama",
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

                    {/* Suggested Friends */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">
                        So, how was that last movie you watched?
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Tell the world about it!
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link to='/recommendations'>
                          <Button
                            variant="outline"
                            size="sm"
                            // className="borde r-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                            className="bg-gradient-to-r hover:border-transparent hover:from-purple-700 hover:to-pink-700 hover:text-white"
                          >
                            <BookOpen className="h-3 w-3" />
                            Write your thoughts!
                          </Button>
                        </Link>
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
