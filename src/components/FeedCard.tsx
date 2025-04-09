
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pause, Play, Trash2, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { Feed } from "@/types";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { processFeed } from "@/lib/feedProcessor";

interface FeedCardProps {
  feed: Feed;
  onEdit: (feed: Feed) => void;
  isRunning?: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({ feed, onEdit, isRunning: globalIsRunning = false }) => {
  const updateFeed = useAppStore((state) => state.updateFeed);
  const removeFeed = useAppStore((state) => state.removeFeed);
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const [checking, setChecking] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  
  const toggleStatus = () => {
    updateFeed(feed.id, { 
      status: feed.status === "active" ? "paused" : "active" 
    });
  };

  const getStatusColor = (status: Feed["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to check if feed URL is valid
  const checkFeed = async () => {
    setChecking(true);
    
    try {
      // Use a CORS proxy to fetch the RSS feed
      const proxyUrl = "https://api.allorigins.win/raw?url=";
      const encodedFeedUrl = encodeURIComponent(feed.url);
      const response = await fetch(`${proxyUrl}${encodedFeedUrl}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.statusText}`);
      }
      
      // Check if the response is valid
      const contentType = response.headers.get('content-type');
      let isValidFeed = false;
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        isValidFeed = data.items && data.items.length > 0;
      } else {
        // Parse as XML
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Check if XML has items
        isValidFeed = xmlDoc.querySelectorAll("item").length > 0;
      }
      
      if (isValidFeed) {
        toast({
          title: "Valid RSS feed",
          description: "The feed URL is valid and contains content.",
        });
        
        // Update feed status if it was in error state
        if (feed.status === "error") {
          updateFeed(feed.id, { status: "active" });
        }
      } else {
        throw new Error("Feed contains no items");
      }
    } catch (error) {
      console.error("Feed check error:", error);
      toast({
        title: "Invalid feed",
        description: error instanceof Error ? error.message : "Could not validate the feed URL",
        variant: "destructive",
      });
      
      // Update feed status to error
      updateFeed(feed.id, { status: "error" });
    } finally {
      setChecking(false);
    }
  };

  const runFeedNow = async () => {
    if (processing || globalIsRunning) return;
    
    if (!openRouterConfig.apiKey) {
      toast({
        title: "OpenRouter API key missing",
        description: "Please configure your OpenRouter API key in settings.",
        variant: "destructive",
      });
      return;
    }
    
    setProcessing(true);
    
    toast({
      title: `Processing feed: ${feed.name}`,
      description: "Fetching and analyzing content...",
    });
    
    try {
      const result = await processFeed(feed, openRouterConfig, wordPressConfig);
      
      if (result.success) {
        toast({
          title: "Processing complete",
          description: "Successfully generated article from feed.",
        });
      } else {
        toast({
          title: "Processing failed",
          description: result.error || "Failed to process feed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Feed processing error:", error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="overflow-hidden">
            <CardTitle className="text-lg font-medium truncate">{feed.name}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1 break-all">
              <div className="flex items-center gap-1">
                <span className="truncate max-w-[180px] md:max-w-[220px] inline-block">{feed.url}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => window.open(feed.url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(feed)}>Edit Feed</DropdownMenuItem>
              <DropdownMenuItem onClick={toggleStatus}>
                {feed.status === "active" ? "Pause Feed" : "Activate Feed"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={checkFeed}>
                Check Feed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={runFeedNow}
                disabled={processing || globalIsRunning || feed.status !== "active"}
              >
                Run Now
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => removeFeed(feed.id)}
                className="text-destructive"
              >
                Delete Feed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs">{feed.category}</Badge>
          <Badge 
            variant="outline" 
            className={`text-xs ${getStatusColor(feed.status)}`}
          >
            {feed.status}
          </Badge>
        </div>
        {feed.lastFetched && (
          <div className="text-xs text-muted-foreground mt-2">
            Last fetched: {format(new Date(feed.lastFetched), "MMM d, yyyy h:mm a")}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removeFeed(feed.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={checkFeed}
              disabled={checking}
            >
              {checking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-1 hidden sm:inline">Check</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="bg-blue-100 text-blue-700 hover:bg-blue-200"
              onClick={runFeedNow}
              disabled={processing || globalIsRunning || feed.status !== "active"}
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Run Now
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={feed.status === "active" 
                ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50" 
                : "text-green-600 hover:text-green-700 hover:bg-green-50"}
              onClick={toggleStatus}
            >
              {feed.status === "active" ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FeedCard;
