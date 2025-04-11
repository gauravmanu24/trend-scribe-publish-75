
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, Send, Eye, Plus, X, ImageIcon, MoveUp, MoveDown, 
  Square, Circle, Triangle, Type, Palette
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface ShapeElement {
  type: 'rect' | 'circle' | 'triangle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
  rotation?: number;
  id: string;
}

interface TextElement {
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  rotation?: number;
  id: string;
}

interface WebStoryFrame {
  image: string;
  text: string;
  animation: string;
  backgroundColor: string;
  shapes?: ShapeElement[];
  textElements?: TextElement[];
}

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
  const [activeTab, setActiveTab] = useState<"text" | "elements">("text");
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

  const renderElementEditor = (frameIndex: number) => {
    const selected = getSelectedElement(frameIndex, selectedElementId);
    
    if (!selected) {
      return (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">Select an element to edit its properties</p>
        </div>
      );
    }
    
    if (selected.type === 'shape') {
      const shape = selected.element as ShapeElement;
      return (
        <div className="space-y-4 p-4 border rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Edit Shape</h3>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => deleteElement(frameIndex, shape.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Position X (%)</Label>
              <Slider 
                value={[shape.x]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updateShapeProperties(frameIndex, shape.id, { x: values[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Position Y (%)</Label>
              <Slider 
                value={[shape.y]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updateShapeProperties(frameIndex, shape.id, { y: values[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Width (px)</Label>
              <Slider 
                value={[shape.width]} 
                min={20} 
                max={300} 
                step={1}
                onValueChange={(values) => updateShapeProperties(frameIndex, shape.id, { width: values[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Height (px)</Label>
              <Slider 
                value={[shape.height]} 
                min={20} 
                max={300} 
                step={1}
                onValueChange={(values) => updateShapeProperties(frameIndex, shape.id, { height: values[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorPalette.map(color => (
                  <div 
                    key={color} 
                    className="color-swatch border"
                    style={{ backgroundColor: color }}
                    onClick={() => updateShapeProperties(frameIndex, shape.id, { color })}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Rotation (deg)</Label>
              <Slider 
                value={[shape.rotation || 0]} 
                min={0} 
                max={360} 
                step={1}
                onValueChange={(values) => updateShapeProperties(frameIndex, shape.id, { rotation: values[0] })}
              />
            </div>
          </div>
        </div>
      );
    } else if (selected.type === 'text') {
      const textElement = selected.element as TextElement;
      return (
        <div className="space-y-4 p-4 border rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Edit Text</h3>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => deleteElement(frameIndex, textElement.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Textarea 
              value={textElement.text} 
              onChange={(e) => updateTextProperties(frameIndex, textElement.id, { text: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Position X (%)</Label>
              <Slider 
                value={[textElement.x]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updateTextProperties(frameIndex, textElement.id, { x: values[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Position Y (%)</Label>
              <Slider 
                value={[textElement.y]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updateTextProperties(frameIndex, textElement.id, { y: values[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Font Size (px)</Label>
              <Slider 
                value={[textElement.fontSize]} 
                min={12} 
                max={72} 
                step={1}
                onValueChange={(values) => updateTextProperties(frameIndex, textElement.id, { fontSize: values[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorPalette.map(color => (
                  <div 
                    key={color} 
                    className="color-swatch border"
                    style={{ backgroundColor: color }}
                    onClick={() => updateTextProperties(frameIndex, textElement.id, { color })}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Rotation (deg)</Label>
              <Slider 
                value={[textElement.rotation || 0]} 
                min={0} 
                max={360} 
                step={1}
                onValueChange={(values) => updateTextProperties(frameIndex, textElement.id, { rotation: values[0] })}
              />
            </div>
          </div>
        </div>
      );
    }
    
    return null;
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
                
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "text" | "elements")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Basic Text</TabsTrigger>
                    <TabsTrigger value="elements">Elements & Shapes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
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
                  </TabsContent>
                  
                  <TabsContent value="elements" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => addShape(index, 'rect')}>
                          <Square className="h-4 w-4 mr-2" />
                          Rectangle
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addShape(index, 'circle')}>
                          <Circle className="h-4 w-4 mr-2" />
                          Circle
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addShape(index, 'triangle')}>
                          <Triangle className="h-4 w-4 mr-2" />
                          Triangle
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addTextElement(index)}>
                          <Type className="h-4 w-4 mr-2" />
                          Text
                        </Button>
                      </div>
                    </div>
                    
                    {renderElementEditor(index)}
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Elements</h4>
                      <div className="space-y-2">
                        {frame.shapes?.map((shape) => (
                          <div 
                            key={shape.id}
                            className={`p-2 rounded border flex items-center cursor-pointer ${
                              selectedElementId === shape.id ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => setSelectedElementId(shape.id)}
                          >
                            {shape.type === 'rect' && <Square className="h-4 w-4 mr-2" />}
                            {shape.type === 'circle' && <Circle className="h-4 w-4 mr-2" />}
                            {shape.type === 'triangle' && <Triangle className="h-4 w-4 mr-2" />}
                            <span>{shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}</span>
                          </div>
                        ))}
                        
                        {frame.textElements?.map((textElement) => (
                          <div 
                            key={textElement.id}
                            className={`p-2 rounded border flex items-center cursor-pointer ${
                              selectedElementId === textElement.id ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => setSelectedElementId(textElement.id)}
                          >
                            <Type className="h-4 w-4 mr-2" />
                            <span>{textElement.text.substring(0, 20)}{textElement.text.length > 20 ? '...' : ''}</span>
                          </div>
                        ))}
                        
                        {(!frame.shapes || frame.shapes.length === 0) && 
                         (!frame.textElements || frame.textElements.length === 0) && (
                          <p className="text-sm text-muted-foreground">No elements added yet. Use the buttons above to add shapes or text.</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebStoryCustomization;
