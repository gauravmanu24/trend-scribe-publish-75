
import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Layout = () => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        {!isHomepage && (
          <div className="w-64 hidden md:block">
            <Navigation />
          </div>
        )}
        <main className={cn(
          "flex-1",
          isHomepage ? "" : "p-6"
        )}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
