import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { Pencil, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { handleLikeComment } from "services/api/flixy/client/comment";
import type { CommentDataGet } from "services/api/flixy/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Card, CardContent } from "./card";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface CommentCardProps {
  accessToken: string;
  comment: CommentDataGet;
}

export function CommentCard({ accessToken, comment }: CommentCardProps) {
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [currentComment, setCurrentComment] = useState(comment);

  const handleLike = async () => {
    setLikeDisabled(true);

    try {
      const comment = await handleLikeComment(accessToken, currentComment.id);
      setCurrentComment(comment);
    } catch (err: Error | any) {
      console.log("API POST /review/:reviewId/like ", err.message);
    }

    setLikeDisabled(false);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="flex flex-col p-6 space-y-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={"/placeholder.svg?height=32&width=32"} />
            <AvatarFallback className="bg-slate-700 text-white">
              {currentComment.user_name[0]?.toUpperCase() || "NN"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-medium">{currentComment.user_name}</span>
              <div className="flex space-between items-center text-slate-400">
                <Pencil size={13}></Pencil>
                <span className="text-sm ml-1">
                  {dayjs.utc(currentComment.created_at).fromNow()}
                </span>
              </div>
              {/* <Badge
                    variant="secondary"
                    className="bg-gray-700 text-gray-300"
                >
                    <MonitorPlay className="pr-2" size={24} />{" "}
                    {new Date(
                    String(currentComment.watch_date)
                    ).toLocaleDateString()}
                </Badge>
                {currentComment.achievements.length > 0 &&
                    currentComment.achievements.map((achievement) => (
                    <SingularBadge badge={achievement} />
                    ))} */}
            </div>
            <p className="text-slate-300 mb-3">{currentComment.text}</p>
            <div className="flex items-center gap-4">
              <button
                disabled={likeDisabled}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                onClick={handleLike}
              >
                <ThumbsUp
                  className="w-4 h-4"
                  fill={
                    currentComment.liked_by_user
                      ? "var(--color-purple-400)"
                      : "none"
                  }
                />
                <span
                  className={`text-sm ${
                    currentComment.liked_by_user
                      ? "text-purple-400 font-bold"
                      : ""
                  }`}
                >
                  {currentComment.likes}
                </span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
