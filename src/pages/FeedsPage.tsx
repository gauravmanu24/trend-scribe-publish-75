
import React from "react";
import { useAppStore } from "@/lib/store";
import FeedCard from "@/components/FeedCard";
import AddFeedDialog from "@/components/AddFeedDialog";
import { Feed } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const FeedsPage = () => {
  const feeds = useAppStore((state) => state.feeds);
  const [editFeed, setEditFeed] = React.useState<Feed | undefined>(undefined);
  
  const handleEdit = (feed: Feed) => {
    setEditFeed(feed);
  };
  
  const handleEditComplete = () => {
    setEditFeed(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">RSS Feeds</h1>
        <AddFeedDialog onComplete={handleEditComplete} editFeed={editFeed} />
      </div>
      
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
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeds.map((feed) => (
              <FeedCard 
                key={feed.id} 
                feed={feed} 
                onEdit={handleEdit} 
              />
            ))}
          </div>
        </>
      )}
      
      {/* Render dialog for editing if needed */}
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
