import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { MessageCircle, ThumbsUp } from "lucide-react";
import type { ReviewDataGet } from "services/api/flixy/types/review";
import { Card, CardContent } from "./card";

interface ReviewCardProps {
  userReview: ReviewDataGet;
}

export function ReviewCard({ userReview }: ReviewCardProps) {
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
              <span className="text-sm text-slate-400">{"hace 1 hora"}</span>
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
