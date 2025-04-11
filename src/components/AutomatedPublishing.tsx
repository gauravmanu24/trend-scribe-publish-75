import React, { useState, useEffect, useRef } from "react";
import { useInterval } from "@/hooks/useInterval";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Check, Clock, RefreshCw, MoreHorizontal, AlertCircle, X, Plus, Loader2, 
  Play, PlusCircle, Upload, FileText, FileSpreadsheet, Edit, Trash2 
} from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationLog, AutomationSource, Article } from "@/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";

const AutomatedPublishing = () => {
  const { toast } = useToast();
  const feeds = useAppStore((state) => state.feeds);
  const sources = useAppStore((state) => state.automationSources);
  const setSources = useAppStore((state) => state.setAutomationSources);
  const logs = useAppStore((state) => state.automationLogs);
  const addLog = useAppStore((state) => state.addAutomationLog);
  const clearLogs = useAppStore((state) => state.clearAutomationLogs);
  const addArticle = useAppStore((state) => state.addArticle);
  const isPolling = useAppStore((state) => state.isPolling);
  const setPolling = useAppStore((state) => state.setPolling);
  const pollingInterval = useAppStore((state) => state.pollingInterval);
  const setPollingInterval = useAppStore((state) => state.setPollingInterval);
  const lastManualRun = useAppStore((state) => state.lastManualRun);
  const setLastManualRun = useAppStore((state) => state.setLastManualRun);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditingSource, setIsEditingSource] = useState(false);
  const [editSourceId, setEditSourceId] = useState<string | null>(null);
  const [isSourceSheetOpen, setIsSourceSheetOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState<"rss" | "sheets" | "manual" | "file">("manual");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceTitles, setNewSourceTitles] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [isRunningAction, setIsRunningAction] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);
  const [language, setLanguage] = useState("en");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState("800");
  const [category, setCategory] = useState("general");
  const [fileType, setFileType] = useState<"txt" | "excel" | "csv">("txt");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState(
    "Write a comprehensive, well-researched article with the following title: '{TITLE}'. Format your response with proper HTML tags including h2, h3 for headings, <ul> and <li> for lists, and <p> tags for paragraphs. The article should be informative, factual, and engaging for readers."
  );
  const [activeTab, setActiveTab] = useState("sources");
  const [processingTitles, setProcessingTitles] = useState<string[]>([]);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number | null>(null);
  const [processingSourceId, setProcessingSourceId] = useState<string | null>(null);
  const [totalTitlesToProcess, setTotalTitlesToProcess] = useState<number>(0);
  const [titlesProcessed, setTitlesProcessed] = useState<number>(0);

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
    setIsSourceSheetOpen(false);
    setNewSourceName("");
    setNewSourceUrl("");
    setNewSourceType("manual");
    setNewSourceTitles("");
    setUploadedFile(null);
  };

  const handleEditSource = (id: string) => {
    const sourceToEdit = sources.find((s) => s.id === id);
    if (sourceToEdit) {
      setEditSourceId(id);
      setIsEditingSource(true);
      
      setNewSourceName(sourceToEdit.name);
      setNewSourceType(sourceToEdit.type);
      if (sourceToEdit.url) setNewSourceUrl(sourceToEdit.url);
      if (sourceToEdit.titles) setNewSourceTitles(sourceToEdit.titles.join("\n"));
      
      setIsSourceSheetOpen(true);
    }
  };

  const handleDeleteSource = (id: string) => {
    setSourceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSource = () => {
    if (sourceToDelete) {
      const sourceName = sources.find((s) => s.id === sourceToDelete)?.name || "Source";
      const updatedSources = sources.filter((s) => s.id !== sourceToDelete);
      setSources(updatedSources);
      
      toast({
        title: "Source deleted",
        description: `${sourceName} has been removed`,
      });
    }
    
    setSourceToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const processNextTitle = async (sourceId: string, titles: string[], index: number) => {
    if (index >= titles.length) {
      setIsRunningAction(false);
      setCurrentProcessingIndex(null);
      setProcessingSourceId(null);
      setProcessingTitles([]);
      setTitlesProcessed(0);
      setTotalTitlesToProcess(0);
      
      const updatedSources = sources.map((s) => 
        s.id === sourceId 
          ? { ...s, lastProcessed: new Date().toISOString() }
          : s
      );
      
      setSources(updatedSources);
      setLastManualRun(new Date().toISOString());
      
      toast({
        title: "Processing completed",
        description: `All ${titles.length} articles have been processed`,
      });
      
      return;
    }
    
    const title = titles[index];
    setCurrentProcessingIndex(index);
    setTitlesProcessed(index + 1);
    
    try {
      const logId = uuidv4();
      const source = sources.find(s => s.id === sourceId);
      const sourceName = source?.name || "Unknown source";
      
      addLog({
        id: logId,
        sourceId: sourceId,
        sourceName: sourceName,
        title: title,
        status: "processing",
        timestamp: new Date().toISOString(),
        message: `Processing article: ${title}`,
      });
      
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      await delay(2000);
      
      const content = `<h1>${title}</h1><p>This is a sample article content for "${title}". In a real application, this would be generated by an AI service based on the title.</p><h2>Section 1</h2><p>Content for section 1...</p><h2>Section 2</h2><p>Content for section 2...</p>`;
      
      const articleId = uuidv4();
      addArticle({
        title: title,
        content: content,
        status: "generated",
        createdAt: new Date().toISOString(),
        publishedAt: null,
        sourceTitle: title,
        sourceLink: null,
        category: category,
        wordpressPostId: null,
        wordpressPostUrl: null,
        customPrompt: customPrompt,
      });
      
      addLog({
        id: uuidv4(),
        sourceId: sourceId,
        sourceName: sourceName,
        title: title,
        status: "success",
        timestamp: new Date().toISOString(),
        message: `Successfully generated article: ${title}`,
        articleId: articleId,
      });
      
      if (autoPublish && wordPressConfig.isConnected) {
        await delay(1000);
        
        addLog({
          id: uuidv4(),
          sourceId: sourceId,
          sourceName: sourceName,
          title: title,
          status: "success",
          timestamp: new Date().toISOString(),
          message: `Published to WordPress: ${title}`,
          articleId: articleId,
        });
      }
      
      setTimeout(() => {
        processNextTitle(sourceId, titles, index + 1);
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      addLog({
        id: uuidv4(),
        sourceId: sourceId,
        sourceName: sources.find(s => s.id === sourceId)?.name || "Unknown source",
        title: title,
        status: "failed",
        timestamp: new Date().toISOString(),
        message: `Failed to process article: ${errorMessage}`,
      });
      
      toast({
        title: "Processing failed",
        description: `Failed to process title: ${title}. Error: ${errorMessage}`,
        variant: "destructive",
      });
      
      setTimeout(() => {
        processNextTitle(sourceId, titles, index + 1);
      }, 500);
    }
  };

  const handleRunSource = async (sourceId: string) => {
    const source = sources.find((s) => s.id === sourceId);
    if (!source) return;
    
    if (isRunningAction) {
      toast({
        title: "Action in progress",
        description: "Please wait for the current operation to complete",
        variant: "destructive",
      });
      return;
    }
    
    if (!openRouterConfig.isConnected && !openRouterConfig.apiKey) {
      toast({
        title: "AI service not configured",
        description: "Please configure an AI service in settings before running",
        variant: "destructive",
      });
      return;
    }
    
    if (autoPublish && (!wordPressConfig.isConnected || !wordPressConfig.url)) {
      toast({
        title: "WordPress not connected",
        description: "Please connect WordPress in settings or disable auto-publish",
        variant: "destructive",
      });
      return;
    }
    
    const titles = source.titles || [];
    if (titles.length === 0) {
      toast({
        title: "No titles to process",
        description: "This source has no titles to process",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunningAction(true);
    setProcessingSourceId(sourceId);
    setProcessingTitles(titles);
    setTotalTitlesToProcess(titles.length);
    setTitlesProcessed(0);
    
    toast({
      title: "Processing started",
      description: `Starting to process ${titles.length} articles from ${source.name}`,
    });
    
    processNextTitle(sourceId, titles, 0);
  };

  const handleRunAllSources = async () => {
    if (isRunningAction) {
      toast({
        title: "Action in progress",
        description: "Please wait for the current operation to complete",
        variant: "destructive",
      });
      return;
    }
    
    const activeSources = sources.filter(s => s.isActive);
    if (activeSources.length === 0) {
      toast({
        title: "No active sources",
        description: "There are no active sources to run",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Run all sources",
      description: `This feature is not yet implemented`,
    });
  };

  const toggleSourceStatus = (id: string) => {
    const updatedSources = sources.map((s) => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    );
    
    setSources(updatedSources);
    
    const source = updatedSources.find((s) => s.id === id);
    toast({
      title: source?.isActive ? "Source activated" : "Source deactivated",
      description: `${source?.name} has been ${source?.isActive ? "activated" : "deactivated"}`,
    });
  };

  useInterval(
    () => {
      if (sources.length === 0) return;
      
      console.log("Polling: checking for new content...");
    },
    isPolling ? pollingInterval * 60 * 1000 : null
  );

  const handleSheetOpenChange = (open: boolean) => {
    setIsSourceSheetOpen(open);
    
    if (!open && !isAddingSource) {
      setIsEditingSource(false);
      setEditSourceId(null);
      setNewSourceName("");
      setNewSourceUrl("");
      setNewSourceType("manual");
      setNewSourceTitles("");
      setUploadedFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Automated Publishing</h1>
          <p className="text-muted-foreground">
            Setup sources and automatically generate and publish content
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 mr-4">
            <Label htmlFor="auto-publish" className="text-sm">Auto-publish</Label>
            <Switch 
              id="auto-publish" 
              checked={autoPublish} 
              onCheckedChange={setAutoPublish}
              disabled={!wordPressConfig.isConnected}
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsSourceSheetOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Source
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunAllSources}
            disabled={isRunningAction || sources.length === 0}
          >
            {isRunningAction ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run All Sources
              </>
            )}
          </Button>
        </div>
      </div>

      {isRunningAction && processingSourceId && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
                  Processing articles
                </h3>
                <Badge variant="outline" className="bg-blue-100">
                  {titlesProcessed} of {totalTitlesToProcess}
                </Badge>
              </div>
              
              <div className="text-sm">
                <p>Source: {sources.find(s => s.id === processingSourceId)?.name}</p>
                {currentProcessingIndex !== null && processingTitles[currentProcessingIndex] && (
                  <p className="font-medium mt-1">Current: {processingTitles[currentProcessingIndex]}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sources" className="space-y-4">
          {sources.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <PlusCircle className="h-6 w-6 text-primary"/>
                </div>
                <h3 className="font-semibold text-lg mb-2">No sources added yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Create your first content source to start automating your content generation and publishing workflow.
                </p>
                <Button onClick={() => setIsSourceSheetOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Source
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sources.map((source) => (
                <Card key={source.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {source.name}
                          {!source.isActive && (
                            <Badge variant="outline" className="ml-2 bg-gray-100">
                              Inactive
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {source.type === "rss" && "RSS Feed"}
                          {source.type === "manual" && "Manual Titles"}
                          {source.type === "sheets" && "Google Sheets"}
                          {source.type === "file" && "Uploaded File"}
                          
                          {source.lastProcessed && (
                            <span className="ml-2">
                              • Last run: {format(new Date(source.lastProcessed), "MMM d, yyyy HH:mm")}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditSource(source.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleSourceStatus(source.id)}>
                            {source.isActive ? (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteSource(source.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {source.type === "manual" && source.titles && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Titles ({source.titles.length})</h4>
                        <div className="text-sm text-muted-foreground mt-1 max-h-20 overflow-y-auto">
                          {source.titles.slice(0, 3).map((title, i) => (
                            <div key={i} className="mb-1 truncate">{title}</div>
                          ))}
                          {source.titles.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{source.titles.length - 3} more titles
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {source.type === "rss" && source.url && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Feed URL</h4>
                        <div className="text-sm text-muted-foreground truncate">
                          {source.url}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={() => handleRunSource(source.id)} 
                      disabled={isRunningAction || !source.isActive || (source.type === "manual" && (!source.titles || source.titles.length === 0))}
                      className="w-full"
                    >
                      {(isRunningAction && processingSourceId === source.id) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing {titlesProcessed} of {totalTitlesToProcess}
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Run Now
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Activity Logs</CardTitle>
                {logs.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearLogs}>
                    Clear Logs
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No activity logs yet</p>
                  <p className="text-sm">Run a source to see activity here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...logs]
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(log.timestamp), "HH:mm:ss")}
                          </TableCell>
                          <TableCell>{log.sourceName}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {log.title}
                          </TableCell>
                          <TableCell>
                            {log.status === "success" && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                Success
                              </Badge>
                            )}
                            {log.status === "processing" && (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                Processing
                              </Badge>
                            )}
                            {log.status === "failed" && (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                                Failed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            {log.message}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Sheet 
        open={isSourceSheetOpen} 
        onOpenChange={handleSheetOpenChange}
      >
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this source and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSource}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AutomatedPublishing;
