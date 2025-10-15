import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CommentDataGet } from "services/api/flixy/types/comment";
import { CommentCard } from "./comment-card";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface CommentCardProps {
  accessToken: string;
  comments: CommentDataGet[];
}

export function CommentList({ accessToken, comments }: CommentCardProps) {
  const { t } = useTranslation();
  const [showComments, setShowComments] = useState(false);

  if (comments.length === 0) {
    return null;
  } else if (showComments) {
    return (
      <div className="flex flex-col items-center">
        <button
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setShowComments(false)}
        >
          {t("comment.list.hide_comments")}
          <ChevronUp />
        </button>
        <div className="grid w-full gap-2 p-6">
          {comments.map((comment) => (
            <CommentCard comment={comment} accessToken={accessToken} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <button
        className="flex justify-center w-full gap-2 mb-4 text-slate-400 hover:text-white transition-colors"
        onClick={() => setShowComments(true)}
      >
        {t("comment.list.show_comments")}
        <ChevronDown />
      </button>
    );
  }
}
