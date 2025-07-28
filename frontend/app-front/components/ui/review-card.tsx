import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Badge } from "components/ui/badge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { MessageCircle, MonitorPlay, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import { Card, CardContent } from "./card";

dayjs.extend(utc);

interface ReviewCardProps {
  userReview: ReviewDataGet;
}

export function ReviewCard({ userReview }: ReviewCardProps) {
  const [review, setReview] = useState("");
  const { t } = useTranslation();
  
  function getReviewTime(reviewDate: Date): string {
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - new Date(reviewDate).getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={"/placeholder.svg?height=32&width=32"} />
            <AvatarFallback className="bg-slate-700 text-white">
              {"JS"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-medium">{userReview.user_name}</span>
              <span className="text-sm text-slate-400">
                {getReviewTime(
                  dayjs.utc(userReview.updated_at).local().toDate()
                )}
              </span>
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                <MonitorPlay className="pr-2" size={24} />{" "}
                {getReviewTime(
                  dayjs.utc(userReview.watch_date).local().toDate()
                )}
              </Badge>
            </div>
            <p className="text-slate-300 mb-3">{userReview.text}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">{0}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Comment</span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
