
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StoryControls from "./webStory/StoryControls";
import FrameEditor from "./webStory/FrameEditor";
import { WebStoryFrame, ShapeElement, TextElement } from "./webStory/types";

interface WebStoryCustomizationProps {
  storyTitle: string;
  setStoryTitle: (title: string) => void;
  storyFrames: WebStoryFrame[];
  setStoryFrames: (frames: WebStoryFrame[]) => void;
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
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Color palette for shapes and text
  const colorPalette = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#F5FF33", 
    "#33FFF5", "#FFFFFF", "#000000", "#FF0000", "#00FF00", 
    "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"
  ];

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
      backgroundColor: "#FFFFFF",
      shapes: [],
      textElements: []
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

  const addShape = (index: number, type: 'rect' | 'circle' | 'triangle') => {
    const updatedFrames = [...storyFrames];
    
    if (!updatedFrames[index].shapes) {
      updatedFrames[index].shapes = [];
    }
    
    // Create a new shape with default properties
    const newShape: ShapeElement = {
      type,
      x: 50, // centered horizontally
      y: 50, // centered vertically
      width: 100,
      height: 100,
      color: "#FF5733", // default color
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    updatedFrames[index].shapes?.push(newShape);
    setStoryFrames(updatedFrames);
    setSelectedElementId(newShape.id);
  };

  const addTextElement = (index: number) => {
    const updatedFrames = [...storyFrames];
    
    if (!updatedFrames[index].textElements) {
      updatedFrames[index].textElements = [];
    }
    
    // Create a new text element with default properties
    const newText: TextElement = {
      text: "Add your text here",
      x: 50, // centered horizontally
      y: 50, // centered vertically
      color: "#FFFFFF", // default white
      fontSize: 24,
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    updatedFrames[index].textElements?.push(newText);
    setStoryFrames(updatedFrames);
    setSelectedElementId(newText.id);
  };

  const updateShapeProperties = (frameIndex: number, shapeId: string, updates: Partial<ShapeElement>) => {
    const updatedFrames = [...storyFrames];
    const shapeIndex = updatedFrames[frameIndex].shapes?.findIndex(s => s.id === shapeId) || -1;
    
    if (shapeIndex !== -1 && updatedFrames[frameIndex].shapes) {
      updatedFrames[frameIndex].shapes![shapeIndex] = {
        ...updatedFrames[frameIndex].shapes![shapeIndex],
        ...updates
      };
      setStoryFrames(updatedFrames);
    }
  };

  const updateTextProperties = (frameIndex: number, textId: string, updates: Partial<TextElement>) => {
    const updatedFrames = [...storyFrames];
    const textIndex = updatedFrames[frameIndex].textElements?.findIndex(t => t.id === textId) || -1;
    
    if (textIndex !== -1 && updatedFrames[frameIndex].textElements) {
      updatedFrames[frameIndex].textElements![textIndex] = {
        ...updatedFrames[frameIndex].textElements![textIndex],
        ...updates
      };
      setStoryFrames(updatedFrames);
    }
  };

  const deleteElement = (frameIndex: number, elementId: string) => {
    const updatedFrames = [...storyFrames];
    
    // Check if it's a shape
    if (updatedFrames[frameIndex].shapes) {
      updatedFrames[frameIndex].shapes = updatedFrames[frameIndex].shapes?.filter(s => s.id !== elementId);
    }
    
    // Check if it's a text element
    if (updatedFrames[frameIndex].textElements) {
      updatedFrames[frameIndex].textElements = updatedFrames[frameIndex].textElements?.filter(t => t.id !== elementId);
    }
    
    setStoryFrames(updatedFrames);
    setSelectedElementId(null);
  };

  const getSelectedElement = (frameIndex: number, elementId: string | null) => {
    if (!elementId) return null;
    
    const frame = storyFrames[frameIndex];
    
    // Check shapes
    if (frame.shapes) {
      const shape = frame.shapes.find(s => s.id === elementId);
      if (shape) return { type: 'shape', element: shape };
    }
    
    // Check text elements
    if (frame.textElements) {
      const text = frame.textElements.find(t => t.id === elementId);
      if (text) return { type: 'text', element: text };
    }
    
    return null;
  };

  const handleShowImageGenerator = (index: number) => {
    setCurrentFrameIndex(index);
    setShowImageGenerator(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div className="lg:col-span-2">
        <StoryControls
          storyTitle={storyTitle}
          setStoryTitle={setStoryTitle}
          onAddFrame={handleAddFrame}
          onPreview={showPreview}
          onPublish={onPublish}
          loading={loading}
        />
      </div>
      
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Story Frames</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {storyFrames.map((frame, index) => (
              <FrameEditor
                key={index}
                frame={frame}
                index={index}
                animationOptions={animationOptions}
                backgroundColors={backgroundColors}
                colorPalette={colorPalette}
                onTextChange={handleTextChange}
                onAnimationChange={handleAnimationChange}
                onBackgroundChange={handleBackgroundChange}
                onRemoveFrame={handleRemoveFrame}
                onMoveFrame={handleMoveFrame}
                onShowImageGenerator={handleShowImageGenerator}
                onAddShape={addShape}
                onAddTextElement={addTextElement}
                updateShapeProperties={updateShapeProperties}
                updateTextProperties={updateTextProperties}
                deleteElement={deleteElement}
                getSelectedElement={getSelectedElement}
                totalFrames={storyFrames.length}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebStoryCustomization;
