
import React, { useState, useEffect } from "react";
import { Newspaper, User, ChevronDown, LogIn, UserPlus, Menu, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const navigate = useNavigate();
  const isPolling = useAppStore((state) => state.isPolling);
  const setPolling = useAppStore((state) => state.setPolling);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name?: string; email?: string } | null>(null);
  
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Tools & Features", href: "/features" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];
  
  // Simulate checking for user authentication on component mount
  useEffect(() => {
    // This would be replaced with actual authentication check
    const checkAuthState = () => {
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          if (authData.isLoggedIn) {
            setIsLoggedIn(true);
            setUserProfile(authData.profile || { name: 'User', email: 'user@example.com' });
          }
        } catch (e) {
          console.error('Error parsing auth data:', e);
          localStorage.removeItem('auth');
        }
      }
    };
    
    checkAuthState();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate('/');
    
    // Show success message via toast (if available)
    if (window.showToast) {
      window.showToast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account.'
      });
    }
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header className="bg-white dark:bg-news-950 text-foreground shadow-md z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <Newspaper className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TrendScribe</h1>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button 
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <div className={`hidden md:flex items-center ${isPolling ? "text-green-400" : "text-gray-400"}`}>
                <div className={`h-2 w-2 rounded-full mr-2 ${isPolling ? "bg-green-400 animate-pulse-slow" : "bg-gray-400"}`}></div>
                <span className="text-sm">{isPolling ? "Active" : "Paused"}</span>
              </div>
            )}
            
            {isLoggedIn && (
              <Button
                variant={isPolling ? "destructive" : "default"}
                size="sm"
                className="hidden md:flex"
                onClick={() => setPolling(!isPolling)}
              >
                {isPolling ? "Pause Service" : "Start Service"}
              </Button>
            )}
            
            {/* User menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{userProfile?.name || "Account"}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button variant="default" size="sm" onClick={() => navigate("/signup")} className="btn-gradient-primary">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
            
            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {menuItems.map((item) => (
                    <SheetClose key={item.label} asChild>
                      <Button 
                        variant="ghost" 
                        className="justify-start"
                        onClick={() => handleNavigation(item.href)}
                      >
                        {item.label}
                      </Button>
                    </SheetClose>
                  ))}
                  {!isLoggedIn ? (
                    <>
                      <SheetClose asChild>
                        <Button variant="outline" onClick={() => navigate("/login")}>
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button className="btn-gradient-primary" onClick={() => navigate("/signup")}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant={isPolling ? "destructive" : "default"}
                        onClick={() => setPolling(!isPolling)}
                      >
                        {isPolling ? "Pause Service" : "Start Service"}
                      </Button>
                      <SheetClose asChild>
                        <Button variant="ghost" className="justify-start" onClick={() => navigate("/dashboard")}>
                          Dashboard
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="ghost" className="justify-start" onClick={() => navigate("/settings")}>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="ghost" className="justify-start text-destructive" onClick={handleLogout}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
