import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

export function BadgeIcon({ iconName }: { iconName: IconName }) {
  const LucideIcon = Icons[iconName] as React.ComponentType<{
    size?: number;
    color?: string;
    className?: string;
  }>;
  return LucideIcon ? <LucideIcon size={24} /> : null;
}
