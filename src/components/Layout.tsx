
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { 
  Newspaper, 
  BarChart2, 
  Rss, 
  PenTool, 
  Settings, 
  BookOpen, 
  LogOut, 
  Moon, 
  Sun, 
  Layers, 
  LayoutTemplate,
  Tag,
  FileText
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-base transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg ${
        isActive
          ? "bg-neutral-100 dark:bg-neutral-800 text-primary"
          : "text-neutral-600 dark:text-neutral-300"
      }`
    }
  >
    <Icon className="h-5 w-5 mr-3" />
    {label}
  </NavLink>
);

const Layout: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border dark:border-neutral-800 p-4 hidden md:block">
        <div className="flex items-center mb-6">
          <LayoutTemplate className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-lg font-bold">TrendScribe</h1>
        </div>

        <nav className="space-y-1">
          <NavItem to="/dashboard" icon={BarChart2} label="Dashboard" />
          <NavItem to="/feeds" icon={Rss} label="RSS Feeds" />
          <NavItem to="/title-generator" icon={Tag} label="Title Generator" />
          <NavItem to="/articles" icon={Newspaper} label="Articles" />
          <NavItem to="/ai-writer" icon={PenTool} label="AI Writer" />
          <NavItem to="/web-stories" icon={BookOpen} label="Web Stories" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="absolute bottom-4 space-y-2 w-56">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark Mode
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={() => {
              // For demo purposes - would integrate with auth
              window.location.href = "/";
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
