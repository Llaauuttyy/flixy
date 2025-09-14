import * as Icons from "lucide-react";
import { Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { UserAchievement } from "services/api/flixy/types/user";
import { Badge } from "../badge";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
type IconName = keyof typeof Icons;

interface BadgeGalleryProps {
  achievementsInsights: UserAchievement[];
}

export function BadgeGallery({ achievementsInsights }: BadgeGalleryProps) {
  const { t } = useTranslation();

  function BadgeIcon({ iconName }: { iconName: IconName }) {
    const LucideIcon = Icons[iconName] as React.ComponentType<{
      size?: number;
    }>;
    return LucideIcon ? <LucideIcon size={24} /> : null;
  }

  function getBadgeLockedColor(unlocked: boolean) {
    if (unlocked) {
      return "bg-green-500/20 text-green-400 border-green-500/30";
    }
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }

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
          {achievementsInsights.map((badge) => {
            return (
              <div
                key={badge.name}
                className={`relative p-4 rounded-lg border transition-all duration-300 ${
                  badge.unlocked
                    ? "bg-slate-700/50 border-slate-600 hover:scale-105"
                    : "bg-slate-800/30 border-slate-700 opacity-60"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      badge.unlocked ? `bg-${badge.color}-600` : "bg-slate-700"
                    }`}
                  >
                    {BadgeIcon({ iconName: badge.icon_name as IconName })}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        badge.unlocked ? "text-white" : "text-slate-500"
                      }`}
                    >
                      {badge.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        badge.unlocked ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {badge.description}
                    </p>
                  </div>
                  <Badge className={getBadgeLockedColor(badge.unlocked)}>
                    {badge.unlocked ? "Unlocked" : "Locked"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
