
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface WebStoryPreviewProps {
  title: string;
  frames: {
    image: string;
    text: string;
    animation: string;
    backgroundColor: string;
  }[];
  onClose: () => void;
}

const WebStoryPreview: React.FC<WebStoryPreviewProps> = ({ title, frames, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleNext = () => {
    if (currentIndex < frames.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const getAnimationClass = (animation: string): string => {
    switch (animation) {
      case "fade-in":
        return "animate-fade-in";
      case "slide-in":
        return "animate-slide-in-right";
      case "zoom-in":
        return "animate-scale-in";
      case "bounce":
        return "animate-bounce";
      case "rotate":
        return "animate-spin duration-[3s]";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <div 
            className="aspect-[9/16] mb-2 rounded-md overflow-hidden relative" 
            style={{ backgroundColor: frames[currentIndex].backgroundColor }}
          >
            <img 
              src={frames[currentIndex].image} 
              alt={`Story frame ${currentIndex + 1}`}
              className={`w-full h-full object-cover ${getAnimationClass(frames[currentIndex].animation)}`}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white font-medium text-lg">
                {frames[currentIndex].text}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              Frame {currentIndex + 1} of {frames.length}
            </span>
            <div className="flex space-x-1">
              {frames.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 w-8 rounded-full ${
                    index === currentIndex ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === frames.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WebStoryPreview;
