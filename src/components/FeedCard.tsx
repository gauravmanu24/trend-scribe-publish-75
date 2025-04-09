
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pause, Play, Trash2 } from "lucide-react";
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

interface FeedCardProps {
  feed: Feed;
  onEdit: (feed: Feed) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ feed, onEdit }) => {
  const updateFeed = useAppStore((state) => state.updateFeed);
  const removeFeed = useAppStore((state) => state.removeFeed);
  
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{feed.name}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">{feed.url}</div>
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
      </CardFooter>
    </Card>
  );
};

export default FeedCard;
