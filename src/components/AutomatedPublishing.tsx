
import React, { useState, useEffect } from "react";
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
import { toast } from "@/hooks/use-toast";
import { Check, Clock, RefreshCw, MoreHorizontal, AlertCircle, X, Plus, Loader2, Play, PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";
import { AutomationLog, AutomationSource, Article } from "@/types";

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
  const lastManualRun = useAppStore((state) => state.lastManualRun);
  const setLastManualRun = useAppStore((state) => state.setLastManualRun);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState<"rss" | "sheets" | "manual">("manual");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceTitles, setNewSourceTitles] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [isRunningAction, setIsRunningAction] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);
  const [language, setLanguage] = useState("en");
  const [newSourcePrompt, setNewSourcePrompt] = useState("");
  
  useEffect(() => {
    // Initialize sources if empty
    if (sources.length === 0) {
      const initialSources: AutomationSource[] = [
        {
          id: uuidv4(),
          name: "Demo Manual Source",
          type: "manual",
          titles: ["The Future of AI in Content Creation", "10 Ways to Improve Your Website SEO", "Digital Marketing Trends for 2023"],
          createdAt: new Date().toISOString(),
          lastProcessed: null,
          isActive: true,
        }
      ];
      setSources(initialSources);
    }
  }, [sources.length, setSources]);
  
  // Process automation if polling is enabled
  useInterval(() => {
    if (isPolling) {
      console.log("Running automated publishing...");
      processAutomation();
    }
  }, pollingInterval * 60 * 1000); // Convert minutes to milliseconds
  
  const addSource = () => {
    if (!newSourceName) {
      toast({
        title: "Source name required",
        description: "Please provide a name for the automation source.",
        variant: "destructive",
      });
      return;
    }
    
    if (newSourceType === "rss" && !newSourceUrl) {
      toast({
        title: "URL required",
        description: "Please provide a URL for the RSS feed.",
        variant: "destructive",
      });
      return;
    }
    
    if (newSourceType === "manual" && !newSourceTitles) {
      toast({
        title: "Titles required",
        description: "Please provide at least one title for manual generation.",
        variant: "destructive",
      });
      return;
    }
    
    const titles = newSourceType === "manual" ? newSourceTitles.split("\n").filter(t => t.trim()) : undefined;
    
    if (newSourceType === "manual" && (!titles || titles.length === 0)) {
      toast({
        title: "Valid titles required",
        description: "Please provide at least one valid title for manual generation.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingSource(true);
    
    try {
      const newSource: AutomationSource = {
        id: uuidv4(),
        name: newSourceName,
        type: newSourceType,
        url: newSourceType === "rss" ? newSourceUrl : undefined,
        titles: newSourceType === "manual" ? titles : undefined,
        createdAt: new Date().toISOString(),
        lastProcessed: null,
        isActive: true,
      };
      
      setSources([...sources, newSource]);
      
      // Clear form
      setNewSourceName("");
      setNewSourceType("manual");
      setNewSourceUrl("");
      setNewSourceTitles("");
      setNewSourcePrompt("");
      
      toast({
        title: "Source added",
        description: `${newSourceName} has been added to your automation sources.`,
      });
    } catch (error) {
      console.error("Error adding source:", error);
      toast({
        title: "Error adding source",
        description: "Failed to add the automation source. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingSource(false);
    }
  };
  
  const processAutomation = async () => {
    if (isRunningAction) return;
    
    setIsRunningAction(true);
    setLastManualRun(new Date().toISOString());
    
    try {
      for (const source of sources.filter(s => s.isActive)) {
        await processSource(source);
      }
      
      toast({
        title: "Automation completed",
        description: "All active sources have been processed.",
      });
    } catch (error) {
      console.error("Automation error:", error);
      toast({
        title: "Automation error",
        description: "An error occurred during automation processing.",
        variant: "destructive",
      });
    } finally {
      setIsRunningAction(false);
    }
  };
  
  const processSource = async (source: AutomationSource) => {
    if (!source.isActive) return;
    
    const logId = uuidv4();
    
    try {
      addLog({
        id: logId,
        sourceId: source.id,
        sourceName: source.name,
        title: "Processing source",
        status: "processing",
        timestamp: new Date().toISOString(),
        message: `Started processing ${source.name}`,
      });
      
      if (source.type === "manual" && source.titles && source.titles.length > 0) {
        // For demo, just pick a random title
        const randomIndex = Math.floor(Math.random() * source.titles.length);
        const title = source.titles[randomIndex];
        
        const result = await generateArticle(title);
        
        if (result.success) {
          addLog({
            id: uuidv4(),
            sourceId: source.id,
            sourceName: source.name,
            title,
            status: "success",
            timestamp: new Date().toISOString(),
            message: `Generated article from title: ${title}`,
            articleId: result.articleId,
          });
        } else {
          addLog({
            id: uuidv4(),
            sourceId: source.id,
            sourceName: source.name,
            title,
            status: "failed",
            timestamp: new Date().toISOString(),
            message: `Failed to generate article: ${result.error || "Unknown error"}`,
          });
        }
      }
      
      // Update source's last processed timestamp
      setSources(sources.map(s => 
        s.id === source.id 
          ? { ...s, lastProcessed: new Date().toISOString() } 
          : s
      ));
      
    } catch (error) {
      console.error("Error processing source:", error);
      addLog({
        id: uuidv4(),
        sourceId: source.id,
        sourceName: source.name,
        title: "Processing error",
        status: "failed",
        timestamp: new Date().toISOString(),
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  };
  
  const generateArticle = async (title: string) => {
    try {
      // In a real implementation, this would call an AI service to generate content
      // For demo purposes, we'll create a stub article
      
      const now = new Date().toISOString();
      
      // Use prompt if available, otherwise use default content
      const content = newSourcePrompt 
        ? `${newSourcePrompt}\n\nArticle title: ${title}\n\n` +
          `<h2>${title}</h2>\n\n<p>This is a generated article based on the user's prompt.</p>` +
          `<p>Language: ${language === "hi" ? "हिंदी" : language === "en" ? "English" : language}</p>`
        : `This is an automatically generated article about "${title}".\n\n` +
          `<h2>Introduction</h2>\n\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nisl eget nisl.</p>\n\n` +
          `<h2>Main Content</h2>\n\n<p>Sed euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nisl eget nisl. Sed euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nisl eget nisl.</p>\n\n` +
          `<h2>Conclusion</h2>\n\n<p>This article was automatically generated based on the title. Language: ${language === "hi" ? "हिंदी" : language === "en" ? "English" : language}</p>`;
      
      const newArticle = {
        title,
        content: content,
        status: autoPublish ? "published" as Article["status"] : "generated" as Article["status"],
        createdAt: now,
        publishedAt: autoPublish ? now : null,
        sourceTitle: "Automated Generation",
        category: "automated",
        wordpressPostId: null,
        wordpressPostUrl: null,
      };
      
      addArticle(newArticle);
      
      if (autoPublish && wordPressConfig.isConnected) {
        // In a real implementation, this would make an API call to WordPress
        // For demo purposes, we'll simulate success
        return { success: true, articleId: uuidv4() };
      }
      
      return { success: true, articleId: uuidv4() };
    } catch (error) {
      console.error("Error processing title:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  };
  
  const toggleSourceStatus = (id: string, isActive: boolean) => {
    setSources(sources.map(s => 
      s.id === id ? { ...s, isActive } : s
    ));
    
    toast({
      title: isActive ? "Source activated" : "Source paused",
      description: `The automation source has been ${isActive ? "activated" : "paused"}.`,
    });
  };
  
  const deleteSource = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
    
    toast({
      title: "Source deleted",
      description: "The automation source has been deleted.",
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Automated Publishing</h2>
          <p className="text-muted-foreground">Set up automatic content generation from various sources</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="polling-mode"
              checked={isPolling}
              onCheckedChange={setPolling}
            />
            <Label htmlFor="polling-mode">Auto-publish ({pollingInterval} min)</Label>
          </div>
          
          <Button 
            variant="outline"
            onClick={processAutomation}
            disabled={isRunningAction || sources.filter(s => s.isActive).length === 0}
            className="flex items-center"
          >
            {isRunningAction ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Now
              </>
            )}
          </Button>
        </div>
      </div>
      
      {lastManualRun && (
        <div className="text-sm text-muted-foreground flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Last run: {format(new Date(lastManualRun), "MMM d, yyyy - h:mm a")}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sources */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Content Sources</h3>
          
          <div className="space-y-4">
            {sources.length === 0 ? (
              <p className="text-muted-foreground">No automation sources configured.</p>
            ) : (
              sources.map(source => (
                <Card key={source.id} className="shadow-sm">
                  <CardHeader className="py-4 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{source.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={source.isActive ? "default" : "secondary"}>
                          {source.isActive ? "Active" : "Paused"}
                        </Badge>
                        <MoreHorizontal className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" />
                      </div>
                    </div>
                    <CardDescription className="text-xs">
                      {source.type === "rss" ? (
                        <>RSS Feed: {source.url}</>
                      ) : source.type === "manual" ? (
                        <>Manual: {source.titles?.length} titles</>
                      ) : (
                        <>Google Sheets</>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="py-3 px-5 flex justify-between border-t">
                    <div className="text-xs text-muted-foreground">
                      {source.lastProcessed ? (
                        <>Last processed: {format(new Date(source.lastProcessed), "MMM d, yyyy")}</>
                      ) : (
                        <>Never processed</>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8"
                        onClick={() => toggleSourceStatus(source.id, !source.isActive)}
                      >
                        {source.isActive ? "Pause" : "Activate"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteSource(source.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Source
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Add Automation Source</SheetTitle>
                  <SheetDescription>
                    Configure a new source for automated content generation.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="source-name">Source Name</Label>
                    <Input 
                      id="source-name"
                      placeholder="Newsletter Content" 
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="source-type">Source Type</Label>
                    <Select 
                      value={newSourceType} 
                      onValueChange={(value) => setNewSourceType(value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Titles</SelectItem>
                        <SelectItem value="rss">RSS Feed</SelectItem>
                        <SelectItem value="sheets">Google Sheets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newSourceType === "rss" && (
                    <div className="grid gap-2">
                      <Label htmlFor="source-url">RSS Feed URL</Label>
                      <Input 
                        id="source-url"
                        placeholder="https://example.com/feed.xml" 
                        value={newSourceUrl}
                        onChange={(e) => setNewSourceUrl(e.target.value)}
                      />
                    </div>
                  )}
                  
                  {newSourceType === "manual" && (
                    <div className="grid gap-2">
                      <Label htmlFor="source-titles">Article Titles</Label>
                      <Textarea 
                        id="source-titles"
                        placeholder="Enter one title per line" 
                        value={newSourceTitles}
                        onChange={(e) => setNewSourceTitles(e.target.value)}
                        rows={5}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter one article title per line.
                      </p>
                    </div>
                  )}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="prompt-template">Content Generation Prompt</Label>
                    <Textarea 
                      id="prompt-template"
                      placeholder="Write a detailed article about [TOPIC]. Include sections on history, modern applications, and future trends." 
                      value={newSourcePrompt}
                      onChange={(e) => setNewSourcePrompt(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Customize how articles are generated with a specific prompt template.
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="language">Article Language</Label>
                    <Select 
                      value={language} 
                      onValueChange={setLanguage}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="auto-publish" 
                      checked={autoPublish} 
                      onCheckedChange={setAutoPublish}
                    />
                    <Label htmlFor="auto-publish">Auto-publish to WordPress</Label>
                  </div>
                </div>
                
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>
                  <Button 
                    onClick={addSource}
                    disabled={isAddingSource}
                  >
                    {isAddingSource ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Source"
                    )}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Activity Logs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Activity Logs</h3>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearLogs}
              disabled={logs.length === 0}
            >
              Clear Logs
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            {logs.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p>No activity logs to display.</p>
                <p className="text-sm">Run automation to generate logs.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...logs].reverse().slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {log.status === "success" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                            <Check className="mr-1 h-3 w-3" />
                            Success
                          </Badge>
                        ) : log.status === "processing" ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                            <Clock className="mr-1 h-3 w-3" />
                            Processing
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="text-sm font-medium">{log.title}</div>
                        <div className="text-xs text-muted-foreground">{log.sourceName}</div>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap text-sm">
                        {format(new Date(log.timestamp), "h:mm a")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedPublishing;
