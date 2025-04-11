
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, FileSpreadsheet, Upload } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { AutomationSource } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface AutomationSourceFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sources: AutomationSource[];
  setSources: (sources: AutomationSource[]) => void;
  isEditingSource: boolean;
  setIsEditingSource: (isEditing: boolean) => void;
  editSourceId: string | null;
  setEditSourceId: (id: string | null) => void;
}

const AutomationSourceForm: React.FC<AutomationSourceFormProps> = ({
  isOpen,
  onOpenChange,
  sources,
  setSources,
  isEditingSource,
  setIsEditingSource,
  editSourceId,
  setEditSourceId,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState<"rss" | "sheets" | "manual" | "file">("manual");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceTitles, setNewSourceTitles] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [category, setCategory] = useState("general");
  const [fileType, setFileType] = useState<"txt" | "excel" | "csv">("txt");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState(
    "Write a comprehensive, well-researched article with the following title: '{TITLE}'. Format your response with proper HTML tags including h2, h3 for headings, <ul> and <li> for lists, and <p> tags for paragraphs. The article should be informative, factual, and engaging for readers."
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadedFile(file);
    
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully`,
    });
    
    if (fileType === "txt") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          const lines = content.split('\n').filter(line => line.trim().length > 0);
          setNewSourceTitles(lines.join('\n'));
          toast({
            title: "Titles extracted",
            description: `${lines.length} titles extracted from file`,
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAddSource = async () => {
    if (!newSourceName) {
      toast({
        title: "Source name required",
        description: "Please provide a name for this source",
        variant: "destructive",
      });
      return;
    }

    if (isEditingSource && editSourceId) {
      const sourceToUpdate = sources.find((s) => s.id === editSourceId);
      if (sourceToUpdate) {
        const updatedSources = sources.map((s) => 
          s.id === editSourceId 
            ? {
                ...s,
                name: newSourceName,
                type: newSourceType,
                url: newSourceType === "rss" ? newSourceUrl : s.url,
                titles: newSourceType === "manual" 
                  ? newSourceTitles.split("\n").filter((t) => t.trim().length > 0)
                  : s.titles,
              }
            : s
        );
        
        setSources(updatedSources);
        
        toast({
          title: "Source updated",
          description: `${newSourceName} has been updated successfully`,
        });
      }
    } else {
      setIsAddingSource(true);
      
      try {
        let titles: string[] = [];
        
        if (newSourceType === "manual") {
          titles = newSourceTitles
            .split("\n")
            .filter((title) => title.trim().length > 0);
        }
        
        const newSource: AutomationSource = {
          id: uuidv4(),
          name: newSourceName,
          type: newSourceType,
          url: newSourceType === "rss" ? newSourceUrl : undefined,
          titles: newSourceType === "manual" ? titles : [],
          createdAt: new Date().toISOString(),
          lastProcessed: null,
          isActive: true,
        };
        
        setSources([...sources, newSource]);
        
        toast({
          title: "Source created",
          description: `${newSourceName} has been added successfully`,
        });
      } catch (error) {
        toast({
          title: "Failed to add source",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setIsAddingSource(false);
      }
    }
    
    setIsEditingSource(false);
    setEditSourceId(null);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setNewSourceName("");
    setNewSourceUrl("");
    setNewSourceType("manual");
    setNewSourceTitles("");
    setUploadedFile(null);
  };

  const handleSheetOpenChange = (open: boolean) => {
    onOpenChange(open);
    
    if (!open && !isAddingSource) {
      setIsEditingSource(false);
      setEditSourceId(null);
      resetForm();
    }
  };

  React.useEffect(() => {
    if (isEditingSource && editSourceId) {
      const sourceToEdit = sources.find((s) => s.id === editSourceId);
      if (sourceToEdit) {
        setNewSourceName(sourceToEdit.name);
        setNewSourceType(sourceToEdit.type);
        if (sourceToEdit.url) setNewSourceUrl(sourceToEdit.url);
        if (sourceToEdit.titles) setNewSourceTitles(sourceToEdit.titles.join("\n"));
      }
    }
  }, [isEditingSource, editSourceId, sources]);

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditingSource ? "Edit Source" : "Add New Source"}
          </SheetTitle>
          <SheetDescription>
            {isEditingSource 
              ? "Update your automated content source" 
              : "Create a new automated content source"}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sourceName">Source Name</Label>
            <Input 
              id="sourceName" 
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              placeholder="My Content Source"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sourceType">Source Type</Label>
            <Select 
              value={newSourceType} 
              onValueChange={(value: "rss" | "sheets" | "manual" | "file") => setNewSourceType(value)}
            >
              <SelectTrigger id="sourceType">
                <SelectValue placeholder="Select source type" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-50">
                <SelectItem value="manual">Manual Titles</SelectItem>
                <SelectItem value="rss">RSS Feed</SelectItem>
                <SelectItem value="file">Upload File</SelectItem>
                <SelectItem value="sheets">Google Sheets</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {newSourceType === "rss" && (
            <div className="space-y-2">
              <Label htmlFor="sourceUrl">RSS Feed URL</Label>
              <Input 
                id="sourceUrl" 
                value={newSourceUrl}
                onChange={(e) => setNewSourceUrl(e.target.value)}
                placeholder="https://example.com/feed.xml"
              />
            </div>
          )}
          
          {newSourceType === "sheets" && (
            <div className="space-y-2">
              <Label htmlFor="sheetsUrl">Google Sheets URL</Label>
              <Input 
                id="sheetsUrl" 
                value={newSourceUrl}
                onChange={(e) => setNewSourceUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
              />
            </div>
          )}
          
          {newSourceType === "file" && (
            <div className="space-y-2">
              <Label>File Type</Label>
              <div className="flex space-x-2 relative">
                <Button
                  type="button"
                  variant={fileType === "txt" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFileType("txt")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Text
                </Button>
                <Button
                  type="button"
                  variant={fileType === "csv" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFileType("csv")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button
                  type="button"
                  variant={fileType === "excel" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFileType("excel")}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
              
              <div className="mt-2 relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept={
                    fileType === "txt" ? ".txt" : 
                    fileType === "csv" ? ".csv" : 
                    ".xlsx,.xls"
                  }
                />
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={triggerFileUpload}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadedFile ? uploadedFile.name : "Upload File"}
                </Button>
                {uploadedFile && (
                  <div className="text-xs text-muted-foreground mt-1">
                    File selected: {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                  </div>
                )}
              </div>
            </div>
          )}
          
          {newSourceType === "manual" && (
            <div className="space-y-2">
              <Label htmlFor="sourceTitles">Article Titles</Label>
              <Textarea 
                id="sourceTitles" 
                value={newSourceTitles}
                onChange={(e) => setNewSourceTitles(e.target.value)}
                placeholder="Enter one title per line"
                className="h-40"
              />
              <p className="text-xs text-muted-foreground">
                Enter one article title per line. These will be used to generate articles.
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="category">Default Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-50">
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="science">Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customPrompt">Custom Prompt</Label>
            <Textarea 
              id="customPrompt" 
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Instructions for AI content generation"
              className="h-24"
            />
            <p className="text-xs text-muted-foreground">
              Use {"{TITLE}"} as a placeholder for the article title
            </p>
          </div>
        </div>
        
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" className="mr-2">Cancel</Button>
          </SheetClose>
          <Button
            type="submit"
            onClick={handleAddSource}
            disabled={isAddingSource}
          >
            {isAddingSource ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin inline-block border-2 border-current border-t-transparent text-current rounded-full" />
                {isEditingSource ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                {isEditingSource ? "Update Source" : "Add Source"}
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AutomationSourceForm;
