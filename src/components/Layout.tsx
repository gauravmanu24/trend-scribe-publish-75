
import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Layout = () => {
  const location = useLocation();
  
  // Pages that should have full width layout (no sidebar)
  const fullWidthPages = [
    "/",
    "/login",
    "/signup",
    "/about",
    "/contact",
    "/features",
    "/privacy",
    "/terms",
  ];
  
  const isFullWidth = fullWidthPages.includes(location.pathname);
  const isHomepage = location.pathname === "/";
  const isAIWriter = location.pathname === "/ai-writer";
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        {!isFullWidth && (
          <div className="w-64 hidden md:block sticky top-0 h-screen">
            <Navigation />
          </div>
        )}
        <main className={cn(
          "flex-1",
          isHomepage ? "" : isFullWidth ? "" : "p-6"
        )}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
