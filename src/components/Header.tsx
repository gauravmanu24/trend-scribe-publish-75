
import React from "react";
import { Newspaper, User, ChevronDown, LogIn, UserPlus, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user, signOut } = useAuth();
  
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Tools & Features", href: "/features" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <Newspaper className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-blue-600">TrendScribe</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button 
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{user.email?.split('@')[0] || "Account"}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/auth")}
                  className="rounded-sm border-gray-300 text-gray-700"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate("/auth?tab=signup")} 
                  className="bg-blue-600 hover:bg-blue-700 rounded-sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
            
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
                  {!user ? (
                    <>
                      <SheetClose asChild>
                        <Button variant="outline" onClick={() => navigate("/auth")}>
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button className="bg-blue-600" onClick={() => navigate("/auth?tab=signup")}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Button variant="destructive" className="justify-start" onClick={handleLogout}>
                        Logout
                      </Button>
                    </SheetClose>
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
