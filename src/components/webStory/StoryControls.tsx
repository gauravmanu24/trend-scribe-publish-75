
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Eye, Send, Loader2 } from "lucide-react";

interface StoryControlsProps {
  storyTitle: string;
  setStoryTitle: (title: string) => void;
  onAddFrame: () => void;
  onPreview: () => void;
  onPublish: () => void;
  loading: boolean;
}

const StoryControls: React.FC<StoryControlsProps> = ({
  storyTitle,
  setStoryTitle,
  onAddFrame,
  onPreview,
  onPublish,
  loading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Story Controls</CardTitle>
        <CardDescription>Add and arrange story frames</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="story-title">Story Title</Label>
          <Input 
            id="story-title"
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            placeholder="Enter your story title"
          />
        </div>
        
        <Button 
          onClick={onAddFrame}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Frame
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onPreview}
          className="w-full"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview Story
        </Button>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onPublish}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Publish to WordPress
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoryControls;
