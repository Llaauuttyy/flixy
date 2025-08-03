import { Award, type LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "../badge";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

interface BadgeGalleryProps {
  badges: {
    name: string;
    description: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    earned: boolean;
    color: string;
  }[];
}

export function BadgeGallery({ badges }: BadgeGalleryProps) {
  const { t } = useTranslation();
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-400" />
          {t("profile.insights.badge_gallery.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={badge.name}
                className={`relative p-4 rounded-lg border transition-all duration-300 ${
                  badge.earned
                    ? "bg-slate-700/50 border-slate-600 hover:scale-105"
                    : "bg-slate-800/30 border-slate-700 opacity-60"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      badge.earned ? badge.color : "bg-slate-700"
                    }`}
                  >
                    <IconComponent
                      className={`h-6 w-6 ${
                        badge.earned ? "text-white" : "text-slate-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        badge.earned ? "text-white" : "text-slate-500"
                      }`}
                    >
                      {badge.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        badge.earned ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {badge.description}
                    </p>
                  </div>
                  {badge.earned && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Unlocked
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
