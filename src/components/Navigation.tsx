
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  RssIcon, 
  PencilIcon, 
  Settings, 
  BookOpenIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
    },
    {
      label: "RSS Feeds",
      icon: <RssIcon className="h-5 w-5" />,
      href: "/feeds",
    },
    {
      label: "Articles",
      icon: <BookOpenIcon className="h-5 w-5" />,
      href: "/articles",
    },
    {
      label: "AI Writer",
      icon: <PencilIcon className="h-5 w-5" />,
      href: "/ai-writer",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
    },
  ];

  return (
    <nav className="bg-news-900 text-white p-4 h-full">
      <div className="py-4 sticky top-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-news-800",
                    isActive
                      ? "bg-news-800 text-secondary"
                      : "text-gray-300",
                    item.href === "/ai-writer" && isActive
                      ? "bg-green-800 text-white"
                      : ""
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
