
import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import FeedCard from "@/components/FeedCard";
import AddFeedDialog from "@/components/AddFeedDialog";
import { Feed, Article } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { processFeed } from "@/lib/feedProcessor";

const FeedsPage = () => {
  const feeds = useAppStore((state) => state.feeds);
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const lastManualRun = useAppStore((state) => state.lastManualRun);
  const setLastManualRun = useAppStore((state) => state.setLastManualRun);
  const [editFeed, setEditFeed] = useState<Feed | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();
  
  const handleEdit = (feed: Feed) => {
    setEditFeed(feed);
  };
  
  const handleEditComplete = () => {
    setEditFeed(undefined);
  };
  
  const handleManualRun = async () => {
    if (isRunning) return;
    
    const activeFeeds = feeds.filter(feed => feed.status === "active");
    if (activeFeeds.length === 0) {
      toast({
        title: "No active feeds",
        description: "You need at least one active feed to run this process.",
        variant: "destructive",
      });
      return;
    }
    
    if (!openRouterConfig.apiKey) {
      toast({
        title: "OpenRouter API key missing",
        description: "Please configure your OpenRouter API key in settings.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunning(true);
    
    try {
      let totalProcessed = 0;
      
      for (const feed of activeFeeds) {
        toast({
          title: `Processing feed: ${feed.name}`,
          description: "Fetching and analyzing content...",
        });
        
        try {
          const result = await processFeed(feed, openRouterConfig, wordPressConfig);
          if (result.success) {
            totalProcessed++;
          }
        } catch (feedError) {
          console.error(`Error processing feed ${feed.name}:`, feedError);
          toast({
            title: `Error processing feed: ${feed.name}`,
            description: feedError instanceof Error ? feedError.message : "Unknown error occurred",
            variant: "destructive",
          });
        }
      }
      
      setLastManualRun(new Date().toISOString());
      
      toast({
        title: "Processing complete",
        description: `Generated ${totalProcessed} article${totalProcessed !== 1 ? 's' : ''} from ${activeFeeds.length} feed${activeFeeds.length !== 1 ? 's' : ''}.`,
      });
      
    } catch (error) {
      console.error("Manual run error:", error);
      toast({
        title: "Process failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">RSS Feeds</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            onClick={handleManualRun}
            disabled={isRunning || feeds.filter(f => f.status === "active").length === 0}
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Now
              </>
            )}
          </Button>
          <AddFeedDialog onComplete={handleEditComplete} editFeed={editFeed} />
        </div>
      </div>
      
      {lastManualRun && (
        <div className="text-sm text-muted-foreground">
          Last manual run: {format(new Date(lastManualRun), "MMM d, yyyy h:mm a")}
        </div>
      )}
      
      {!openRouterConfig.apiKey && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            OpenRouter API key is not configured. Please add it in settings to use the manual run feature.
          </AlertDescription>
        </Alert>
      )}
      
      {feeds.length === 0 ? (
        <div className="py-8 text-center">
          <h2 className="text-xl font-medium text-gray-500">No feeds configured</h2>
          <p className="text-gray-400 mt-2 mb-6">Add RSS feeds to start monitoring trends and generating content.</p>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">
            Tip: You can use Google Trends RSS feeds like:
            <br />
            <code className="text-xs bg-gray-100 p-1 rounded">
              https://trends.google.com/trends/trendingsearches/daily/rss?geo=US
            </code>
          </p>
          <AddFeedDialog />
        </div>
      ) : (
        <>
          <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              Active feeds are polled hourly to find trending topics for content generation.
              Use the "Run Now" button to manually process feeds and generate content.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeds.map((feed) => (
              <FeedCard 
                key={feed.id} 
                feed={feed} 
                onEdit={handleEdit} 
                isRunning={isRunning}
              />
            ))}
          </div>
        </>
      )}
      
      {editFeed && (
        <AddFeedDialog 
          editFeed={editFeed} 
          onComplete={handleEditComplete} 
        />
      )}
    </div>
  );
};

export default FeedsPage;
