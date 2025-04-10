
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, 
  Rss, 
  PenTool, 
  Settings, 
  BookOpen, 
  LogOut, 
  Moon, 
  Sun, 
  Tag
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg ${
        isActive
          ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600 pl-3"
          : "text-gray-700"
      }`
    }
  >
    <Icon className="h-5 w-5 mr-3" />
    {label}
  </NavLink>
);

const Layout: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar - Made sticky */}
        <aside className="w-64 border-r border-gray-200 hidden md:block bg-white">
          <div className="sticky top-0 h-[calc(100vh-64px)] overflow-y-auto p-4">
            <h2 className="text-lg font-bold px-4 mb-6 text-gray-800">Dashboard</h2>
            <nav className="space-y-1">
              <NavItem to="/dashboard" icon={BarChart2} label="Dashboard" />
              <NavItem to="/feeds" icon={Rss} label="RSS Feeds" />
              <NavItem to="/title-generator" icon={Tag} label="Title Generator" />
              <NavItem to="/articles" icon={BookOpen} label="Articles" />
              <NavItem to="/ai-writer" icon={PenTool} label="AI Writer" />
              <NavItem to="/web-stories" icon={BookOpen} label="Web Stories" />
              <NavItem to="/settings" icon={Settings} label="Settings" />
            </nav>

            <div className="absolute bottom-4 space-y-2 w-56 px-4">
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
                className="w-full justify-start text-gray-700"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
