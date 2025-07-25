import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Textarea } from "./textarea";

interface ReviewCardProps {
  title: string;
}

export function ReviewCard({ title }: ReviewCardProps) {
  const [review, setReview] = useState("");
  const { t } = useTranslation();

  function handleSubmitReview(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        {/* Opinion Textarea */}
        <div className="mb-6">
          <p className="text-slate-300 mb-3">
            {t("review_card.have_watched")}{" "}
            <span className="text-purple-400 font-semibold">{title}</span>
            {"? "}
            {t("review_card.share_thoughts")}
          </p>
          <Textarea
            placeholder={t("review_card.review_placeholder")}
            onChange={(e) => setReview(e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-[120px]"
          />
        </div>

        <Button
          onClick={handleSubmitReview}
          // disabled={!userRating || !opinion.trim()}
          className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
        >
          {t("review_card.review_button")}
        </Button>
      </CardContent>
    </Card>
  );
}
