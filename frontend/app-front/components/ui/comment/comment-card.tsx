import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { Pencil, ThumbsUp, Trash } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  handleDeleteComment,
  handleLikeComment,
} from "services/api/flixy/client/comment";
import type { CommentDataGet } from "services/api/flixy/types/comment";
import { UserAvatar } from "../avatar";
import { Button } from "../button";
import { Card, CardContent } from "../card";
import { ConfirmationBox } from "../confirmation-box";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface CommentCardProps {
  accessToken: string;
  comment: CommentDataGet;
  onDeletion: (commentId: number) => void;
}

export function CommentCard({
  accessToken,
  comment,
  onDeletion,
}: CommentCardProps) {
  const { t } = useTranslation();

  const [likeDisabled, setLikeDisabled] = useState(false);
  const [currentComment, setCurrentComment] = useState(comment);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await handleDeleteComment(accessToken, currentComment.id);
      // Notify parent about deletion
      comment.is_deletable && comment.id && onDeletion(comment.id);
    } catch (err: Error | any) {
      console.log("API DELETE /comment/:commentId ", err.message);
    }

    setIsDeleting(false);
  };

  const handleConfirmationBox = (value: boolean) => {
    if (value) {
      handleDelete();
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="flex flex-col p-6 space-y-4">
        <div className="flex items-start gap-4">
          <UserAvatar
            userId={currentComment.user_id}
            userName={currentComment.user_name}
            className="bg-slate-700 text-white"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <span className="font-medium">{currentComment.user_name}</span>
                <div className="flex items-center text-slate-400">
                  <Pencil size={13} />
                  <span className="text-sm ml-1">
                    {dayjs.utc(currentComment.created_at).fromNow()}
                  </span>
                </div>
              </div>

              {comment.is_deletable && (
                <ConfirmationBox
                  isAccepted={(value) => handleConfirmationBox(value)}
                  title={t("confirmation_box.comment.title")}
                  subtitle={t("confirmation_box.comment.subtitle")}
                  cancelText={t("confirmation_box.comment.cancel")}
                  acceptText={t("confirmation_box.comment.accept")}
                >
                  <Button
                    disabled={isDeleting}
                    className="rounded-lg border bg-card text-card-foreground shadow-sm border-slate-700 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50 ml-2"
                  >
                    <Trash size={20} color="red" />
                  </Button>
                </ConfirmationBox>
              )}
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
