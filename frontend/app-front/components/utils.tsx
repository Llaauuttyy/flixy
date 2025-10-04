import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

interface BadgeIconProps {
  iconName: IconName;
  size?: number;
  color?: string;
}

export function BadgeIcon({
  iconName,
  size = 24,
  color = "white",
}: BadgeIconProps) {
  const LucideIcon = Icons[iconName] as React.ComponentType<{
    size?: number;
    color?: string;
    className?: string;
  }>;

  return LucideIcon ? <LucideIcon size={size} color={color} /> : null;
}
export function getBadgeColor(color: string) {
  switch (color) {
    case "red":
      return "bg-red-600";
    case "blue":
      return "bg-blue-600";
    case "green":
      return "bg-green-600";
    case "yellow":
      return "bg-yellow-600";
    case "purple":
      return "bg-purple-600";
    case "pink":
      return "bg-pink-600";
    case "indigo":
      return "bg-indigo-600";
    case "teal":
      return "bg-teal-600";
    case "orange":
      return "bg-orange-600";
    default:
      return "bg-gray-600";
  }
}

export function getBadgeColorRGB(color: string) {
  switch (color) {
    case "red":
      return "rgb(220, 38, 38)";
    case "blue":
      return "rgb(37, 99, 235)";
    case "green":
      return "rgb(22, 163, 74)";
    case "yellow":
      return "rgb(202, 138, 4)";
    case "purple":
      return "rgb(147, 51, 234)";
    case "pink":
      return "rgb(219, 39, 119)";
    case "indigo":
      return "rgb(79, 70, 229)";
    case "teal":
      return "rgb(13, 148, 136)";
    case "orange":
      return "rgb(234, 88, 12)";
    default:
      return "rgb(75, 85, 99)";
  }
}
