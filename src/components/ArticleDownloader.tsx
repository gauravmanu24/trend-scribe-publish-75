
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Clipboard, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ArticleDownloaderProps {
  articleTitle: string;
  articleContent: string;
  onUseForAutomation?: () => void;
}

const ArticleDownloader: React.FC<ArticleDownloaderProps> = ({
  articleTitle,
  articleContent,
  onUseForAutomation
}) => {
  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([articleContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${articleTitle.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Article downloaded",
      description: "Your article has been downloaded as a text file."
    });
  };

  const downloadAsHTML = () => {
    // Convert newlines to <br> tags for HTML
    const htmlContent = `<html>
      <head>
        <title>${articleTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          p { margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <h1>${articleTitle}</h1>
        ${articleContent.split('\n').map(line => `<p>${line}</p>`).join('')}
      </body>
    </html>`;
    
    const element = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${articleTitle.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Article downloaded",
      description: "Your article has been downloaded as an HTML file."
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(articleContent);
    toast({
      title: "Copied to clipboard",
      description: "The article content has been copied to your clipboard."
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={downloadAsText}
      >
        <Download className="h-4 w-4 mr-2" />
        Download as Text
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={downloadAsHTML}
      >
        <Download className="h-4 w-4 mr-2" />
        Download as HTML
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={copyToClipboard}
      >
        <Clipboard className="h-4 w-4 mr-2" />
        Copy to Clipboard
      </Button>
      
      {onUseForAutomation && (
        <Button 
          size="sm"
          onClick={onUseForAutomation}
          className="ml-auto"
        >
          <Send className="h-4 w-4 mr-2" />
          Use for Automation
        </Button>
      )}
    </div>
  );
};

export default ArticleDownloader;
