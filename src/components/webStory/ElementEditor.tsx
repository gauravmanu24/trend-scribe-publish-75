
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

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

interface ElementEditorProps {
  frameIndex: number;
  selectedElementId: string | null;
  getSelectedElement: (frameIndex: number, elementId: string | null) => { 
    type: 'shape' | 'text'; 
    element: ShapeElement | TextElement 
  } | null;
  updateShapeProperties: (frameIndex: number, shapeId: string, updates: Partial<ShapeElement>) => void;
  updateTextProperties: (frameIndex: number, textId: string, updates: Partial<TextElement>) => void;
  deleteElement: (frameIndex: number, elementId: string) => void;
  colorPalette: string[];
}

const ElementEditor: React.FC<ElementEditorProps> = ({
  frameIndex,
  selectedElementId,
  getSelectedElement,
  updateShapeProperties,
  updateTextProperties,
  deleteElement,
  colorPalette
}) => {
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

export default ElementEditor;
