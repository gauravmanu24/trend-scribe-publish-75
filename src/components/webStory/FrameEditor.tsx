import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Square, Circle, Triangle, Type, MoveUp, MoveDown, X, ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ElementEditor from "./ElementEditor";
import ElementsList from "./ElementsList";
import { ShapeElement, TextElement, WebStoryFrame, ElementSelection } from "./types";

interface FrameEditorProps {
  frame: WebStoryFrame;
  index: number;
  animationOptions: string[];
  backgroundColors: string[];
  colorPalette: string[];
  onTextChange: (index: number, text: string) => void;
  onAnimationChange: (index: number, animation: string) => void;
  onBackgroundChange: (index: number, backgroundColor: string) => void;
  onRemoveFrame: (index: number) => void;
  onMoveFrame: (index: number, direction: 'up' | 'down') => void;
  onShowImageGenerator: (index: number) => void;
  onAddShape: (index: number, type: 'rect' | 'circle' | 'triangle') => void;
  onAddTextElement: (index: number) => void;
  updateShapeProperties: (frameIndex: number, shapeId: string, updates: Partial<ShapeElement>) => void;
  updateTextProperties: (frameIndex: number, textId: string, updates: Partial<TextElement>) => void;
  deleteElement: (frameIndex: number, elementId: string) => void;
  getSelectedElement: (frameIndex: number, elementId: string | null) => ElementSelection | null;
  totalFrames: number;
}

const FrameEditor: React.FC<FrameEditorProps> = ({
  frame,
  index,
  animationOptions,
  backgroundColors,
  colorPalette,
  onTextChange,
  onAnimationChange,
  onBackgroundChange,
  onRemoveFrame,
  onMoveFrame,
  onShowImageGenerator,
  onAddShape,
  onAddTextElement,
  updateShapeProperties,
  updateTextProperties,
  deleteElement,
  getSelectedElement,
  totalFrames
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "elements">("text");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  return (
    <div 
      className="border rounded-md p-4 space-y-3"
      style={{ backgroundColor: frame.backgroundColor }}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Frame {index + 1}</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onMoveFrame(index, 'up')}
            disabled={index === 0}
          >
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onMoveFrame(index, 'down')}
            disabled={index === totalFrames - 1}
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onShowImageGenerator(index)}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            Change Image
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemoveFrame(index)}
            disabled={totalFrames <= 1}
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
            onChange={(e) => onTextChange(index, e.target.value)}
            placeholder="Frame text"
            className="resize-none"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`animation-${index}`}>Animation</Label>
              <Select 
                value={frame.animation} 
                onValueChange={(value) => onAnimationChange(index, value)}
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
                onValueChange={(value) => onBackgroundChange(index, value)}
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
              <Button variant="outline" size="sm" onClick={() => onAddShape(index, 'rect')}>
                <Square className="h-4 w-4 mr-2" />
                Rectangle
              </Button>
              <Button variant="outline" size="sm" onClick={() => onAddShape(index, 'circle')}>
                <Circle className="h-4 w-4 mr-2" />
                Circle
              </Button>
              <Button variant="outline" size="sm" onClick={() => onAddShape(index, 'triangle')}>
                <Triangle className="h-4 w-4 mr-2" />
                Triangle
              </Button>
              <Button variant="outline" size="sm" onClick={() => onAddTextElement(index)}>
                <Type className="h-4 w-4 mr-2" />
                Text
              </Button>
            </div>
          </div>
          
          <ElementEditor
            frameIndex={index}
            selectedElementId={selectedElementId}
            getSelectedElement={getSelectedElement}
            updateShapeProperties={updateShapeProperties}
            updateTextProperties={updateTextProperties}
            deleteElement={deleteElement}
            colorPalette={colorPalette}
          />
          
          <ElementsList
            frame={frame}
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FrameEditor;
