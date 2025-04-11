
import React, { useState, useRef, useEffect } from "react";
import { ShapeElement, TextElement } from "./types";

interface FramePreviewProps {
  frameImage: string;
  backgroundColor: string;
  shapes?: ShapeElement[];
  textElements?: TextElement[];
  selectedElementId: string | null;
  setSelectedElementId: (id: string) => void;
  updateShapeProperties: (frameIndex: number, shapeId: string, updates: Partial<ShapeElement>) => void;
  updateTextProperties: (frameIndex: number, textId: string, updates: Partial<TextElement>) => void;
  frameIndex: number;
}

const FramePreview: React.FC<FramePreviewProps> = ({
  frameImage,
  backgroundColor,
  shapes = [],
  textElements = [],
  selectedElementId,
  setSelectedElementId,
  updateShapeProperties,
  updateTextProperties,
  frameIndex
}) => {
  const [dragging, setDragging] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Handle drag start
  const handleDragStart = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(id);
    setSelectedElementId(id);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle mouse movement during dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !previewRef.current) return;
    
    const previewRect = previewRef.current.getBoundingClientRect();
    
    // Calculate position as percentage of frame dimensions
    const x = ((e.clientX - previewRect.left) / previewRect.width) * 100;
    const y = ((e.clientY - previewRect.top) / previewRect.height) * 100;
    
    // Limit values to stay within the frame (0-100%)
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));
    
    // Update the element position based on type
    const isShape = dragging.startsWith('shape-');
    
    if (isShape) {
      updateShapeProperties(frameIndex, dragging, { x: boundedX, y: boundedY });
    } else {
      updateTextProperties(frameIndex, dragging, { x: boundedX, y: boundedY });
    }
  };
  
  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setDragging(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  // Render a shape element
  const renderShape = (shape: ShapeElement) => {
    const isSelected = selectedElementId === shape.id;
    const style = {
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: `${shape.width}px`,
      height: `${shape.height}px`,
      backgroundColor: shape.type !== 'triangle' ? shape.color : 'transparent',
      color: shape.type === 'triangle' ? shape.color : undefined,
      transform: shape.rotation ? `rotate(${shape.rotation}deg)` : undefined,
      border: isSelected ? '2px dashed #32CD32' : 'none',
      cursor: 'move',
      position: 'absolute' as 'absolute',
      zIndex: isSelected ? 10 : 1,
    };
    
    let shapeClass = "story-shape";
    if (shape.type === 'rect') shapeClass += " shape-rect";
    if (shape.type === 'circle') shapeClass += " shape-circle";
    if (shape.type === 'triangle') shapeClass += " shape-triangle";
    
    return (
      <div 
        key={shape.id}
        className={shapeClass}
        style={style}
        onMouseDown={(e) => handleDragStart(shape.id, e)}
      >
        {shape.text && <span>{shape.text}</span>}
      </div>
    );
  };
  
  // Render a text element
  const renderTextElement = (textElement: TextElement) => {
    const isSelected = selectedElementId === textElement.id;
    const style = {
      left: `${textElement.x}%`,
      top: `${textElement.y}%`,
      color: textElement.color,
      fontSize: `${textElement.fontSize}px`,
      transform: textElement.rotation ? `rotate(${textElement.rotation}deg)` : undefined,
      border: isSelected ? '2px dashed #32CD32' : 'none',
      cursor: 'move',
      position: 'absolute' as 'absolute',
      zIndex: isSelected ? 10 : 1,
      backgroundColor: isSelected ? 'rgba(50, 205, 50, 0.1)' : 'transparent',
      padding: '4px',
      maxWidth: '90%',
      wordBreak: 'break-word' as 'break-word',
    };
    
    return (
      <div 
        key={textElement.id}
        className="story-text-element"
        style={style}
        onMouseDown={(e) => handleDragStart(textElement.id, e)}
      >
        {textElement.text}
      </div>
    );
  };
  
  return (
    <div 
      ref={previewRef}
      className="aspect-[9/16] relative rounded-md overflow-hidden" 
      style={{ backgroundColor }}
    >
      <img 
        src={frameImage} 
        alt="Frame preview"
        className="w-full h-full object-cover"
      />
      
      {/* Render shapes */}
      {shapes.map(renderShape)}
      
      {/* Render text elements */}
      {textElements.map(renderTextElement)}
    </div>
  );
};

export default FramePreview;
