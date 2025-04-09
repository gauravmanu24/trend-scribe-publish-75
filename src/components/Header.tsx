
import React from "react";
import { Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

const Header = () => {
  const navigate = useNavigate();
  const isPolling = useAppStore((state) => state.isPolling);
  const setPolling = useAppStore((state) => state.setPolling);
  
  return (
    <header className="bg-news-950 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <Newspaper className="h-6 w-6 text-secondary" />
          <h1 className="text-xl font-bold">TrendScribe</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${isPolling ? "text-green-400" : "text-gray-400"}`}>
            <div className={`h-2 w-2 rounded-full mr-2 ${isPolling ? "bg-green-400 animate-pulse-slow" : "bg-gray-400"}`}></div>
            <span className="text-sm">{isPolling ? "Active" : "Paused"}</span>
          </div>
          <Button
            variant={isPolling ? "destructive" : "default"}
            size="sm"
            onClick={() => setPolling(!isPolling)}
          >
            {isPolling ? "Pause Service" : "Start Service"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
