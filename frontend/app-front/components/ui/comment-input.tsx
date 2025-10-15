import { Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { handleCommentCreation } from "services/api/flixy/client/comment";
import type {
  CommentCreation,
  CommentDataGet,
} from "services/api/flixy/types/comment";
import type { ApiResponse } from "services/api/flixy/types/overall";
import { Button } from "./button";
import { Textarea } from "./textarea";

interface CommentInputProps {
  accessToken: string;
  reviewId: number;
  onComment?: (comment: CommentDataGet) => void;
  onCancel?: () => void;
}

export function CommentInput({
  accessToken,
  reviewId,
  onComment,
  onCancel,
}: CommentInputProps) {
  const { t } = useTranslation();
  const commentLimit = 1000;
  const [comment, setComment] = useState("");
  const [caracters, setCaracters] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>();

  const handleSubmitComment = async () => {
    setIsLoading(true);

    const commentData: CommentCreation = {
      review_id: reviewId,
      text: comment,
    };

    let apiResponse: ApiResponse = {};

    try {
      let newUserComment: CommentDataGet = await handleCommentCreation(
        accessToken,
        commentData
      );

      if (onComment) {
        onComment(newUserComment);
      }
    } catch (err: Error | any) {
      console.log("API POST /review: ", err.message);

      if (err instanceof TypeError) {
        apiResponse.error = t("exceptions.service_error");
        setApiResponse(apiResponse);
      }

      apiResponse.error = err.message;
      setApiResponse(apiResponse);
    }

    setIsLoading(false);
  };

  const getCaractersColor = (): string => {
    if (caracters == 0) {
      return "text-red-300";
    } else if (caracters >= 800 && caracters < 900) {
      return "text-red-400";
    } else if (caracters >= 900 && caracters <= commentLimit) {
      return "text-red-500";
    } else if (caracters > commentLimit) {
      return "text-red-600";
    }

    return "text-slate-300";
  };

  return (
    <div className="mt-4 space-y-3 animate-in slide-in-from-top-2">
      <Textarea
        placeholder={t("comment.input.placeholder")}
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          const caracters = e.target.value.length;
          setCaracters(caracters);
          setHasReachedLimit(caracters > commentLimit);
        }}
        className="bg-slate-800 border-slate-700 min-h-[100px]"
      />
      <div className="flex justify-between items-center">
        <p className="text-slate-300">
          {" "}
          <span className={`${getCaractersColor()}`}>{caracters}</span> /
          {commentLimit}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {t("comment.input.cancel")}
          </Button>
          <Button
            size="sm"
            onClick={handleSubmitComment}
            disabled={hasReachedLimit || caracters <= 0 || isLoading}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {t("comment.input.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
