import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Film,
  Home,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react";
// import Link from "next/link";
import { Link, useLocation } from "react-router-dom";

// import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const navigationItems = [
  {
    title: "sidebar_nav.home",
    href: "/",
    icon: Home,
  },
  {
    title: "sidebar_nav.movies",
    href: "/movies",
    icon: Film,
  },
  {
    title: "sidebar_nav.watchlists",
    href: "/watchlists",
    icon: Eye,
  },
  {
    title: "sidebar_nav.social",
    href: "/social",
    icon: Users,
  },
  {
    title: "sidebar_nav.reviews",
    href: "/reviews",
    icon: BookOpen,
  },
  {
    title: "sidebar_nav.explore",
    href: "/recommendations",
    icon: Sparkles,
  },
  {
    title: "sidebar_nav.profile",
    href: "/profile",
    icon: User,
  },
];

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false);
  // const pathname = usePathname();
  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col",
        collapsed ? "w-18" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <img
                className="h-8 w-8 text-purple-500"
                src={"/flixy-logo.png"}
              />
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Flixy
              </h1>
            </div>
          )}
          {collapsed && <Film className="h-8 w-8 text-purple-500 mx-auto" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800",
                    collapsed && "justify-center px-2",
                    isActive &&
                      "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  )}
                >
                  <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                  {!collapsed && t(item.title)}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-800">
        <Link to="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800",
              collapsed && "justify-center px-2"
            )}
          >
            <Settings className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && t("sidebar_nav.settings")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
