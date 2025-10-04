import * as Icons from "lucide-react";
import type { UserAchievement } from "services/api/flixy/types/user";
import { BadgeIcon, getBadgeColor, getBadgeColorRGB } from "../../utils";
import { Card, CardContent } from "../card";

type IconName = keyof typeof Icons;

interface BadgeProps {
  badge: UserAchievement;
}

export function SingularBadge({ badge }: BadgeProps) {
  return (
    <div key={badge.name} className="relative group inline-block">
      <div className={`rounded-full`}>
        <BadgeIcon
          iconName={badge.icon_name as IconName}
          color={getBadgeColorRGB(badge.color)}
          size={20}
        />
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
        <div className="w-max">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-0">
              <div
                key={badge.name}
                className={`relative p-4 rounded-lg border transition-all duration-300 ${
                  badge.unlocked
                    ? "bg-slate-700/50 border-slate-600"
                    : "bg-slate-800/30 border-slate-700 opacity-60"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      badge.unlocked
                        ? `${getBadgeColor(badge.color)}`
                        : "bg-slate-700"
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
