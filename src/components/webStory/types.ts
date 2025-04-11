
export interface ShapeElement {
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

export interface TextElement {
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  rotation?: number;
  id: string;
}

export interface WebStoryFrame {
  image: string;
  text: string;
  animation: string;
  backgroundColor: string;
  shapes?: ShapeElement[];
  textElements?: TextElement[];
}

export interface ElementSelection {
  type: 'shape' | 'text';
  element: ShapeElement | TextElement;
}

