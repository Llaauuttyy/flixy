import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Card } from "../card";

const recentReviews = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "/diverse-woman-avatar.png",
      username: "@sarahj",
    },
    movie: {
      title: "Oppenheimer",
      poster: "/oppenheimer-poster.jpg",
    },
    rating: 9,
    review:
      "A masterpiece of modern cinema. Nolan delivers a haunting and powerful portrayal of one of history's most complex figures. The cinematography is breathtaking.",
    date: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      avatar: "/man-avatar.png",
      username: "@mchen",
    },
    movie: {
      title: "The Batman",
      poster: "/batman-poster.jpg",
    },
    rating: 8,
    review:
      "Dark, gritty, and absolutely captivating. Pattinson brings a fresh take to the character. The detective noir atmosphere is perfectly executed.",
    date: "5 hours ago",
  },
  {
    id: 3,
    user: {
      name: "Emma Davis",
      avatar: "/woman-avatar-2.png",
      username: "@emmad",
    },
    movie: {
      title: "Everything Everywhere",
      poster: "/everything-everywhere-poster.jpg",
    },
    rating: 10,
    review:
      "Mind-bending, emotional, and utterly unique. This film is a wild ride that somehow manages to be both chaotic and deeply meaningful. A true original.",
    date: "1 day ago",
  },
];

export function RecentReviews() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recentReviews.map((review) => (
        <Card
          key={review.id}
          className="p-4 border-slate-700 bg-slate-800 hover:border-pink-500/50 transition-all cursor-pointer"
        >
          <div className="flex gap-3 mb-3">
            <img
              src={review.movie.poster || "/placeholder.svg"}
              alt={review.movie.title}
              className="w-16 h-24 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate mb-1">
                {review.movie.title}
              </h3>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < review.rating / 2
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-slate-600"
                    }`}
                  />
                ))}
                <span className="text-sm font-semibold text-white ml-1">
                  {review.rating}/10
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed mb-3 line-clamp-3">
            {review.review}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={review.user.avatar || "/placeholder.svg"}
                  alt={review.user.name}
                />
                <AvatarFallback>{review.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white">
                  {review.user.name}
                </span>
                <span className="text-xs text-slate-400">
                  {review.user.username}
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400">{review.date}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
