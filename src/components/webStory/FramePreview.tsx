
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
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [initialMouse, setInitialMouse] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  // Handle element selection
  const handleElementClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementId(id);
  };
  
  // Handle background click to deselect
  const handleBackgroundClick = () => {
    setSelectedElementId("");
  };
  
  // Handle drag start
  const handleDragStart = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!previewRef.current) return;
    
    setDragging(id);
    setSelectedElementId(id);
    
    const previewRect = previewRef.current.getBoundingClientRect();
    
    const isShape = id.startsWith('shape-');
    
    // Find the element's current position
    let element;
    if (isShape) {
      element = shapes.find(s => s.id === id);
    } else {
      element = textElements.find(t => t.id === id);
    }
    
    if (!element) return;
    
    // Save initial positions for relative movement calculation
    setInitialPos({ x: element.x, y: element.y });
    setInitialMouse({ x: e.clientX, y: e.clientY });
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle mouse movement during dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !previewRef.current) return;
    
    const previewRect = previewRef.current.getBoundingClientRect();
    
    // Calculate the delta movement as percentage of frame dimensions
    const deltaX = ((e.clientX - initialMouse.x) / previewRect.width) * 100;
    const deltaY = ((e.clientY - initialMouse.y) / previewRect.height) * 100;
    
    // Add delta to the initial position
    const newX = Math.max(0, Math.min(100, initialPos.x + deltaX));
    const newY = Math.max(0, Math.min(100, initialPos.y + deltaY));
    
    // Update the element position based on type
    const isShape = dragging.startsWith('shape-');
    
    if (isShape) {
      updateShapeProperties(frameIndex, dragging, { x: newX, y: newY });
    } else {
      updateTextProperties(frameIndex, dragging, { x: newX, y: newY });
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
      cursor: dragging === shape.id ? 'grabbing' : 'grab',
      position: 'absolute' as 'absolute',
      zIndex: isSelected ? 10 : 1,
      pointerEvents: 'all' as 'all',
      userSelect: 'none' as 'none',
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
        onClick={(e) => handleElementClick(shape.id, e)}
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
      cursor: dragging === textElement.id ? 'grabbing' : 'grab',
      position: 'absolute' as 'absolute',
      zIndex: isSelected ? 10 : 1,
      backgroundColor: isSelected ? 'rgba(50, 205, 50, 0.1)' : 'transparent',
      padding: '4px',
      maxWidth: '90%',
      wordBreak: 'break-word' as 'break-word',
      pointerEvents: 'all' as 'all',
      userSelect: 'none' as 'none',
    };
    
    return (
      <div 
        key={textElement.id}
        className="story-text-element"
        style={style}
        onClick={(e) => handleElementClick(textElement.id, e)}
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
      onClick={handleBackgroundClick}
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
