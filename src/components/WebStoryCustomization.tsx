
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Eye, Plus, X, ImageIcon, MoveUp, MoveDown } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface WebStoryCustomizationProps {
  storyTitle: string;
  setStoryTitle: (title: string) => void;
  storyFrames: {
    image: string;
    text: string;
    animation: string;
    backgroundColor: string;
  }[];
  setStoryFrames: (frames: any[]) => void;
  animationOptions: string[];
  backgroundColors: string[];
  showPreview: () => void;
  onPublish: () => void;
  loading: boolean;
  setCurrentFrameIndex: (index: number) => void;
  setShowImageGenerator: (show: boolean) => void;
  currentFrameIndex: number;
}

const WebStoryCustomization: React.FC<WebStoryCustomizationProps> = ({
  storyTitle,
  setStoryTitle,
  storyFrames,
  setStoryFrames,
  animationOptions,
  backgroundColors,
  showPreview,
  onPublish,
  loading,
  setCurrentFrameIndex,
  setShowImageGenerator,
  currentFrameIndex
}) => {
  const handleTextChange = (index: number, text: string) => {
    const updatedFrames = [...storyFrames];
    updatedFrames[index] = {
      ...updatedFrames[index],
      text: text
    };
    setStoryFrames(updatedFrames);
  };

  const handleAnimationChange = (index: number, animation: string) => {
    const updatedFrames = [...storyFrames];
    updatedFrames[index] = {
      ...updatedFrames[index],
      animation: animation
    };
    setStoryFrames(updatedFrames);
  };

  const handleBackgroundChange = (index: number, backgroundColor: string) => {
    const updatedFrames = [...storyFrames];
    updatedFrames[index] = {
      ...updatedFrames[index],
      backgroundColor: backgroundColor
    };
    setStoryFrames(updatedFrames);
  };

  const handleAddFrame = () => {
    const newFrame = {
      image: "https://picsum.photos/seed/new/800/600",
      text: "New frame text goes here",
      animation: "fade-in",
      backgroundColor: "#FFFFFF"
    };
    setStoryFrames([...storyFrames, newFrame]);
  };

  const handleRemoveFrame = (index: number) => {
    if (storyFrames.length <= 1) {
      return;
    }
    
    const updatedFrames = storyFrames.filter((_, i) => i !== index);
    setStoryFrames(updatedFrames);
  };

  const handleMoveFrame = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === storyFrames.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedFrames = [...storyFrames];
    const frameToMove = updatedFrames[index];
    
    updatedFrames.splice(index, 1);
    updatedFrames.splice(newIndex, 0, frameToMove);
    
    setStoryFrames(updatedFrames);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div className="lg:col-span-2">
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
              onClick={handleAddFrame}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Frame
            </Button>
            
            <Button 
              variant="outline" 
              onClick={showPreview}
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
              disabled={loading || storyFrames.length === 0}
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
      </div>
      
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Story Frames</CardTitle>
            <CardDescription>Customize each frame of your web story</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {storyFrames.map((frame, index) => (
              <div 
                key={index} 
                className="border rounded-md p-4 space-y-3"
                style={{ backgroundColor: frame.backgroundColor }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Frame {index + 1}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleMoveFrame(index, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleMoveFrame(index, 'down')}
                      disabled={index === storyFrames.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setCurrentFrameIndex(index);
                        setShowImageGenerator(true);
                      }}
                    >
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Change Image
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveFrame(index)}
                      disabled={storyFrames.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="aspect-[9/16] relative rounded-md overflow-hidden bg-muted">
                  <img 
                    src={frame.image} 
                    alt={`Frame ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <Textarea 
                  value={frame.text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  placeholder="Frame text"
                  className="resize-none"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`animation-${index}`}>Animation</Label>
                    <Select 
                      value={frame.animation} 
                      onValueChange={(value) => handleAnimationChange(index, value)}
                    >
                      <SelectTrigger id={`animation-${index}`}>
                        <SelectValue placeholder="Select animation" />
                      </SelectTrigger>
                      <SelectContent>
                        {animationOptions.map((animation) => (
                          <SelectItem key={animation} value={animation}>
                            {animation.charAt(0).toUpperCase() + animation.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`background-${index}`}>Background Color</Label>
                    <Select 
                      value={frame.backgroundColor} 
                      onValueChange={(value) => handleBackgroundChange(index, value)}
                    >
                      <SelectTrigger id={`background-${index}`}>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundColors.map((color) => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-2" 
                                style={{ backgroundColor: color }}
                              />
                              {color}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebStoryCustomization;
