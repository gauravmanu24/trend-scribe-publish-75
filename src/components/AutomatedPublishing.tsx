
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
import { useToast } from "@/hooks/use-toast";
import { Check, Clock, RefreshCw, MoreHorizontal, AlertCircle, X, Plus, Loader2, Play, PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const setPollingInterval = useAppStore((state) => state.setPollingInterval);
  const lastManualRun = useAppStore((state) => state.lastManualRun);
  const setLastManualRun = useAppStore((state) => state.setLastManualRun);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState<"rss" | "sheets" | "manual">("manual");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceTitles, setNewSourceTitles] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [isRunningAction, setIsRunningAction] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);
  const [language, setLanguage] = useState("en");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState("800");
  const [category, setCategory] = useState("general");
  const [defaultPrompt, setDefaultPrompt] = useState(
    "Write a comprehensive, well-researched article with the following title: '{TITLE}'. Format your response with proper HTML tags including h2, h3 for headings, <ul> and <li> for lists, and <p> tags for paragraphs. The article should be informative, factual, and engaging for readers."
  );
  const [activeTab, setActiveTab] = useState("sources");
  
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
      // Use OpenRouter API to generate content
      if (!openRouterConfig.apiKey) {
        toast({
          title: "OpenRouter API key missing",
          description: "Please configure your OpenRouter API key in settings.",
          variant: "destructive",
        });
        return { success: false, error: "OpenRouter API key missing" };
      }

      const now = new Date().toISOString();
      
      // Prepare prompt using the default prompt template
      let prompt = defaultPrompt.replace('{TITLE}', title);
      
      // Add language instruction
      if (language === "hi") {
        prompt += " Write the article in Hindi language.";
      } else if (language !== "en") {
        prompt += ` Write the article in ${language} language.`;
      }
      
      // Add tone instruction
      prompt += ` Use a ${tone} tone.`;
      
      // Add word count instruction
      prompt += ` The article should be approximately ${wordCount} words long.`;
      
      const modelToUse = openRouterConfig.model || "meta-llama/llama-3.1-8b-instruct";
      
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openRouterConfig.apiKey}`,
            "HTTP-Referer": window.location.origin,
          },
          body: JSON.stringify({
            model: modelToUse,
            messages: [
              {
                role: "system",
                content: `You are a professional content writer who creates well-researched, informative articles. Write in a ${tone} tone with proper HTML formatting.`
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("OpenRouter API error response:", errorText);
          throw new Error(`OpenRouter API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        const content = data.choices && data.choices.length > 0 
          ? data.choices[0]?.message?.content || "" 
          : "";
        
        if (!content) {
          throw new Error("AI generated empty content");
        }
        
        // Create a new article
        const newArticle: Omit<Article, "id" | "updatedAt"> = {
          title,
          content,
          status: autoPublish ? "published" : "generated",
          createdAt: now,
          publishedAt: autoPublish ? now : null,
          sourceTitle: "Automated Generation",
          category,
          wordpressPostId: null,
          wordpressPostUrl: null,
        };
        
        addArticle(newArticle);
        
        return { success: true, articleId: uuidv4() };
      } catch (error) {
        console.error("Error calling OpenRouter API:", error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Failed to generate content" 
        };
      }
    } catch (error) {
      console.error("Error generating article:", error);
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
  
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setPollingInterval(value);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Automated Publishing</h2>
          <p className="text-muted-foreground">Configure automated article generation from various sources</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="interval" className="shrink-0">Interval (minutes)</Label>
            <Input
              id="interval"
              type="number"
              min="1"
              className="w-20"
              value={pollingInterval}
              onChange={handleIntervalChange}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Switch 
              id="polling-mode"
              checked={isPolling}
              onCheckedChange={setPolling}
            />
            <Label htmlFor="polling-mode" className="whitespace-nowrap">
              {isPolling ? "Enabled" : "Disabled"}
            </Label>
          </div>
          
          <Button 
            variant="default"
            onClick={processAutomation}
            disabled={isRunningAction || sources.filter(s => s.isActive).length === 0}
            className="flex items-center gap-2"
          >
            {isRunningAction ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="default">Default Settings</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sources" className="pt-6">
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
        </TabsContent>
        
        <TabsContent value="default" className="pt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Default Article Settings</CardTitle>
              <CardDescription>
                Configure default settings for automatically generated articles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="default-tone">Default Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="default-tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="default-language">Default Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="default-language">
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="default-word-count">Default Word Count</Label>
                  <Input
                    id="default-word-count"
                    type="number"
                    min="200"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="default-category">Default Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="default-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="default-prompt">Default Generation Prompt</Label>
                <Textarea 
                  id="default-prompt"
                  placeholder="Write a comprehensive article about {TITLE}..." 
                  value={defaultPrompt}
                  onChange={(e) => setDefaultPrompt(e.target.value)}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Use {'{TITLE}'} as a placeholder for the article title in your prompt.
                </p>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="auto-publish" 
                  checked={autoPublish} 
                  onCheckedChange={setAutoPublish}
                />
                <Label htmlFor="auto-publish">Automatically publish to WordPress</Label>
              </div>
              
              {autoPublish && !wordPressConfig.isConnected && (
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex gap-2 text-yellow-800">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm">WordPress is not configured. Please check your settings.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="pt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomatedPublishing;
