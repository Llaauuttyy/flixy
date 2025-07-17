import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { Textarea } from "components/ui/textarea";
import {
  ArrowLeft,
  Award,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Star,
  ThumbsUp,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const mockReviews = [
  {
    id: 1,
    user: {
      name: "María González",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MG",
    },
    rating: 5,
    comment:
      "Una obra maestra cinematográfica. Nolan vuelve a sorprender con su narrativa no lineal y las actuaciones son excepcionales.",
    timeAgo: "hace 2 horas",
    likes: 24,
  },
  {
    id: 2,
    user: {
      name: "Carlos Ruiz",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CR",
    },
    rating: 4,
    comment:
      "Excelente película biográfica. Cillian Murphy está brillante como Oppenheimer.",
    timeAgo: "hace 1 día",
    likes: 15,
  },
];

interface Movie {
  id: string;
  title: string;
  year: string;
  duration: number;
  genre: string;
  certificate: string;
  description: string;
  actors: string;
  directors: string;
  logoUrl: string;
  initialRating: number;
  averageRating: number;
  totalRatings: number;
}

export default function MovieDetail() {
  const location = useLocation();
  const [movie, setMovie] = useState<Movie>({} as Movie);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [opinion, setOpinion] = useState("");
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (location.state.movie) {
      setMovie(location.state.movie);
    }
  }, [location.state]);

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitReview = () => {
    if (userRating > 0 && opinion.trim()) {
      // In a real app, this would submit to an API
      console.log("Submitting review:", { rating: userRating, opinion });
      setOpinion("");
      // Keep the rating for display
    }
  };

  // TODO: Pedir a través de endpoint o usarlo en un componente.
  // const location = useLocation();

  // Solo a modo de prueba -- TODO: Cambiar tipos de datos.
  const getDataFromMovie = (data: string): string => {
    if (data.length > 2) {
      return data.replace(/\[|\]|'/g, "");
    } else {
      return "No data available";
    }
  };

  const getDurationFromMovie = (minutes: number): string => {
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;

    let duration: string = ``;

    if (hours) {
      duration += `${hours}h`;
    }

    if (remainingMinutes) {
      duration += ` ${remainingMinutes}m`;
    }

    return duration;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/movies"
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a películas</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:text-white bg-transparent"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button
              variant={isInWatchlist ? "default" : "outline"}
              size="sm"
              onClick={() => setIsInWatchlist(!isInWatchlist)}
              className={
                isInWatchlist
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "border-slate-700 text-slate-300 hover:text-white"
              }
            >
              <Heart
                className={`w-4 h-4 mr-2 ${
                  isInWatchlist ? "fill-current" : ""
                }`}
              />
              {isInWatchlist ? "En lista" : "Agregar a lista"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src={movie.logoUrl || "/placeholder.svg"}
                alt={movie.title}
                width={400}
                height={600}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{getDurationFromMovie(movie.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{movie.certificate}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre?.split(",").map((g: any) => (
                  <Badge
                    variant="secondary"
                    className="bg-slate-800 text-slate-300"
                  >
                    {g}
                  </Badge>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-semibold">
                    {movie.averageRating}
                  </span>
                  <span className="text-slate-400">
                    ({movie.totalRatings} valoraciones)
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Sinopsis</h2>
              <p className="text-slate-300 leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Cast */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Reparto Principal</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* {movie.actors.map((actor, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
                  >
                    <Users className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="font-medium">{actor.name}</div>
                      <div className="text-sm text-slate-400">
                        {actor.character}
                      </div>
                    </div>
                  </div>
                ))} */}
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <Users className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-medium">{movie.actors}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Directors */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Dirección</h2>
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg w-fit">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="font-medium">{movie.directors}</div>
                  <div className="text-sm text-slate-400">Director</div>
                </div>
              </div>
            </div>

            {/* Rating and Opinion Section */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Tu Valoración</h2>

                {/* Star Rating */}
                <div className="mb-6">
                  <p className="text-slate-300 mb-3">Califica esta película:</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= (hoverRating || userRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-600 hover:text-slate-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <p className="text-sm text-slate-400 mt-2">
                      Tu calificación: {userRating}/5
                    </p>
                  )}
                </div>

                {/* Opinion Textarea */}
                <div className="mb-6">
                  <p className="text-slate-300 mb-3">Comparte tu opinión:</p>
                  <Textarea
                    placeholder="¿Qué te pareció esta película? Comparte tus pensamientos..."
                    value={opinion}
                    onChange={(e) => setOpinion(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-[120px]"
                  />
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={!userRating || !opinion.trim()}
                  className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
                >
                  Publicar Reseña
                </Button>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Reseñas de la Comunidad
              </h2>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <Card
                    key={review.id}
                    className="bg-slate-800/50 border-slate-700"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage
                            src={review.user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-slate-700 text-white">
                            {review.user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium">
                              {review.user.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {review.rating}
                              </span>
                            </div>
                            <span className="text-sm text-slate-400">
                              {review.timeAgo}
                            </span>
                          </div>
                          <p className="text-slate-300 mb-3">
                            {review.comment}
                          </p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm">{review.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">Responder</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
