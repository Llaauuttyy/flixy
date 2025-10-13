import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { Star } from "lucide-react";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import { Avatar } from "../avatar";
import { Badge } from "../badge";
import { Card } from "../card";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface RatingCardProps {
  review: ReviewDataGet;
}

export const RatingCard = ({ review }: RatingCardProps) => {
  return (
    <Card key={review.id} className="bg-slate-800/50 border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Avatar className="h-8 w-8 bg-slate-700 flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {review.name[0].toUpperCase()}
          </span>
        </Avatar>
        <span className="text-slate-300 text-sm font-medium">
          {review.name}
        </span>
      </div>

      <h3 className="text-white font-medium mb-2">{review.movie.title}</h3>
      <div className="flex flex-wrap gap-1 mb-3">
        {review.movie.genres?.split(",").map((genre) => (
          <Badge
            key={genre}
            variant="secondary"
            className="bg-slate-700 text-slate-300 text-xs"
          >
            {genre}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5">
          {Array.from({
            length: Number(review.rating),
          }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-purple-500 text-purple-500" />
          ))}
        </div>
        <span className="text-slate-500 text-xs">
          {dayjs.utc(review.updated_at).fromNow()}
        </span>
      </div>
    </Card>
  );
};
