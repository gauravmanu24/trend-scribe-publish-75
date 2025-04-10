
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Download, Clipboard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TitleGeneratorOutputProps {
  generatedTitles: string[];
  selectedTitle: string | null;
  setSelectedTitle: (title: string) => void;
  isLoading: boolean;
  onUseForAutomation?: (title: string) => void;
}

const TitleGeneratorOutput: React.FC<TitleGeneratorOutputProps> = ({
  generatedTitles,
  selectedTitle,
  setSelectedTitle,
  isLoading,
  onUseForAutomation
}) => {
  const { toast } = useToast();
  const [copiedTitle, setCopiedTitle] = React.useState<string | null>(null);

  const handleCopy = (title: string) => {
    navigator.clipboard.writeText(title);
    setCopiedTitle(title);
    toast({
      title: "Title copied",
      description: "The title has been copied to your clipboard."
    });
    setTimeout(() => setCopiedTitle(null), 2000);
  };

  const downloadTitles = () => {
    const titlesText = generatedTitles.join('\n\n');
    const element = document.createElement('a');
    const file = new Blob([titlesText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'generated-titles.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Titles downloaded",
      description: "Generated titles have been downloaded as a text file."
    });
  };

  const handleSelect = (title: string) => {
    setSelectedTitle(title);
  };

  const handleUseForAutomation = () => {
    if (selectedTitle && onUseForAutomation) {
      onUseForAutomation(selectedTitle);
    } else {
      toast({
        title: "No title selected",
        description: "Please select a title before using for automation.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-600">Generated Titles</h2>
        {generatedTitles.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTitles}
            className="text-gray-700 flex gap-1 items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Download All
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : generatedTitles.length > 0 ? (
        <div className="space-y-3">
          {generatedTitles.map((title, index) => (
            <div 
              key={index}
              className={`bg-white p-4 rounded-md border ${selectedTitle === title ? 'border-blue-500' : 'border-gray-200'} hover:border-blue-300 transition-colors cursor-pointer`}
              onClick={() => handleSelect(title)}
            >
              <div className="flex justify-between items-center">
                <p className={`text-lg ${selectedTitle === title ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                  {title}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(title);
                  }}
                >
                  {copiedTitle === title ? 
                    <Check className="h-4 w-4 text-green-500" /> : 
                    <Clipboard className="h-4 w-4 text-gray-500" />}
                </Button>
              </div>
            </div>
          ))}
          
          {onUseForAutomation && selectedTitle && (
            <Button 
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleUseForAutomation}
            >
              <Send className="h-4 w-4 mr-2" />
              Use Title for Automated Publishing
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center p-10 border border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500">Generated titles will appear here</p>
        </div>
      )}
    </div>
  );
};

export default TitleGeneratorOutput;
