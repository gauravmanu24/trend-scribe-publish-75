
import React from "react";
import { Square, Circle, Triangle, Type } from "lucide-react";

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

interface ElementsListProps {
  frame: WebStoryFrame;
  selectedElementId: string | null;
  setSelectedElementId: (id: string) => void;
}

const ElementsList: React.FC<ElementsListProps> = ({
  frame,
  selectedElementId,
  setSelectedElementId
}) => {
  return (
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
  );
};

export default ElementsList;
