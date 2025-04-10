
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Quote, Heading1, Heading2, Heading3, Image, Link, Undo, Redo 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageRequest: () => void;
  className?: string; // Added className as optional prop
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, onImageRequest, className }) => {
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  
  const handleButtonClick = (action: string, tag: string = "") => {
    const textarea = document.getElementById("rich-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = value;
    let newCursorPosition = end;
    
    switch (action) {
      case "format":
        // Wrap selected text with HTML tag (without XML declaration)
        newText = value.substring(0, start) + 
                  `<${tag}>${selectedText}</${tag}>` + 
                  value.substring(end);
        newCursorPosition = end + tag.length * 2 + 5;
        break;
        
      case "list":
        // Create list with items (without XML declaration)
        const items = selectedText.split('\n').filter(Boolean);
        let listHtml = `<${tag}>\n`;
        items.forEach(item => {
          listHtml += `  <li>${item}</li>\n`;
        });
        listHtml += `</${tag}>`;
        
        newText = value.substring(0, start) + listHtml + value.substring(end);
        newCursorPosition = end + listHtml.length;
        break;
        
      case "heading":
        // Create heading (without XML declaration)
        newText = value.substring(0, start) + 
                  `<h${tag}>${selectedText}</h${tag}>` + 
                  value.substring(end);
        newCursorPosition = end + 7 + tag.length;
        break;
        
      case "quote":
        // Create blockquote (without XML declaration)
        newText = value.substring(0, start) + 
                  `<blockquote>${selectedText}</blockquote>` + 
                  value.substring(end);
        newCursorPosition = end + 23;
        break;
        
      case "image":
        onImageRequest();
        return;
        
      case "link":
        const url = prompt("Enter URL:", "https://");
        if (!url) return;
        
        // Create link (without XML declaration)
        newText = value.substring(0, start) + 
                  `<a href="${url}" target="_blank">${selectedText || url}</a>` + 
                  value.substring(end);
        newCursorPosition = end + url.length + selectedText.length + 32;
        break;
    }
    
    onChange(newText);
    
    // Restore focus and update cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };
  
  const handleUndo = () => {
    document.execCommand('undo');
  };
  
  const handleRedo = () => {
    document.execCommand('redo');
  };
  
  const renderPreview = () => {
    // Ensure we don't have any XML declarations in the HTML content
    let cleanContent = value;
    if (cleanContent.includes('<?xml')) {
      cleanContent = cleanContent.replace(/<\?xml[^>]*\?>/g, '');
    }
    
    return { __html: cleanContent };
  };
  
  return (
    <div className={cn("border rounded-md", className)}>
      <div className="bg-muted/50 p-2 border-b flex flex-wrap gap-1">
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("format", "b")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("format", "i")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("format", "u")}>
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("heading", "1")}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("heading", "2")}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("heading", "3")}>
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("list", "ul")}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("list", "ol")}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("quote")}>
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("link")}>
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleButtonClick("image")}>
          <Image className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        <Button variant="ghost" size="icon" onClick={handleUndo}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleRedo}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      <textarea
        id="rich-editor"
        className="w-full min-h-[300px] p-4 font-mono text-sm focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      <div className="border-t p-2 text-sm text-muted-foreground">
        HTML Mode - Preview shown below
      </div>
      
      <div 
        className="rich-editor p-4 border-t"
        dangerouslySetInnerHTML={renderPreview()}
      />
    </div>
  );
};

export default RichTextEditor;
