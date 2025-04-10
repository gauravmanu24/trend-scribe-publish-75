import React, { useState, useEffect } from "react";
import { useInterval } from "@/hooks/useInterval";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Clock, FileText, Play, Pause, FilePlus, Trash2, AlertCircle, CheckCircle, Upload } from "lucide-react";
import { format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";
import { AutomationLog, AutomationSource, Article } from "@/types";

const AutomatedPublishing = () => {
  const { toast } = useToast();
  const addArticle = useAppStore((state) => state.addArticle);
  const automationSources = useAppStore((state) => state.automationSources);
  const setAutomationSources = useAppStore((state) => state.setAutomationSources);
  const automationLogs = useAppStore((state) => state.automationLogs);
  const addAutomationLog = useAppStore((state) => state.addAutomationLog);
  const clearAutomationLogs = useAppStore((state) => state.clearAutomationLogs);
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);

  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);
  const [interval, setInterval] = useState<number>(60); // minutes
  const [activeTab, setActiveTab] = useState<string>("sources");
  const [selectedSourceType, setSelectedSourceType] = useState<"rss" | "sheets" | "manual">("manual");
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [manualTitles, setManualTitles] = useState("");
  const [defaultTone, setDefaultTone] = useState("professional");
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [defaultWordCount, setDefaultWordCount] = useState(800);
  const [defaultCategory, setDefaultCategory] = useState("General");
  const [autoPublish, setAutoPublish] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Function to handle file upload for titles
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setManualTitles(content);
        setUploading(false);
        toast({
          title: "File uploaded",
          description: `Successfully loaded ${content.split("\n").filter(line => line.trim()).length} titles`,
        });
      };
      
      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "There was a problem reading the file.",
          variant: "destructive",
        });
        setUploading(false);
      };
      
      reader.readAsText(file);
    }
  };

  // Function to add a new source
  const addSource = () => {
    if (!newSourceName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the source.",
        variant: "destructive",
      });
      return;
    }

    if (selectedSourceType === "manual" && !manualTitles.trim()) {
      toast({
        title: "Titles required",
        description: "Please enter at least one title.",
        variant: "destructive",
      });
      return;
    }

    if ((selectedSourceType === "rss" || selectedSourceType === "sheets") && !newSourceUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    const newSource: AutomationSource = {
      id: uuidv4(),
      name: newSourceName,
      type: selectedSourceType,
      url: selectedSourceType !== "manual" ? newSourceUrl : undefined,
      titles: selectedSourceType === "manual" ? manualTitles.split("\n").filter(title => title.trim()) : undefined,
      createdAt: new Date().toISOString(),
      lastProcessed: null,
      isActive: true,
    };

    setAutomationSources([...automationSources, newSource]);
    setNewSourceName("");
    setNewSourceUrl("");
    setManualTitles("");

    toast({
      title: "Source added",
      description: `${newSourceName} has been added successfully.`,
    });
  };

  // Function to remove a source
  const removeSource = (id: string) => {
    setAutomationSources(automationSources.filter(source => source.id !== id));
    toast({
      title: "Source removed",
      description: "The source has been removed successfully.",
    });
  };

  // Function to toggle source active state
  const toggleSourceActive = (id: string) => {
    setAutomationSources(automationSources.map(source => 
      source.id === id ? { ...source, isActive: !source.isActive } : source
    ));
  };

  // Function to process a single title
  const processTitle = async (title: string) => {
    if (!openRouterConfig.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    try {
      // In a real implementation, this would make an API call to OpenRouter
      // For demo purposes, we'll simulate the process with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const now = new Date().toISOString();
      const newArticle = {
        title,
        content: `This is an automatically generated article about "${title}".\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nisl eget nisl.\n\nSed euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nisl eget nisl. Sed euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nisl eget nisl.\n\nConclusion: This article was automatically generated based on the title.`,
        status: autoPublish ? "published" as Article["status"] : "generated" as Article["status"],
        createdAt: now,
        publishedAt: autoPublish ? now : null,
        sourceTitle: "Automated Generation",
        sourceLink: null,
        category: defaultCategory,
        wordpressPostId: null,
        wordpressPostUrl: null,
      };

      addArticle(newArticle);
      
      // If auto-publish is enabled and WordPress is configured, simulate publishing
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
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  };

  // Function to process titles from a source
  const processSource = async (source: AutomationSource) => {
    let titles: string[] = [];
    let successCount = 0;
    let failCount = 0;

    try {
      // Get titles based on source type
      if (source.type === "manual" && source.titles) {
        titles = source.titles;
      } else if (source.type === "rss" && source.url) {
        // In a real implementation, this would fetch and parse RSS feeds
        // For demo purposes, we'll use dummy titles
        titles = ["Latest Technology Trends", "The Future of AI", "Web Development in 2025"];
      } else if (source.type === "sheets" && source.url) {
        // In a real implementation, this would fetch from Google Sheets
        // For demo purposes, we'll use dummy titles
        titles = ["How to Master JavaScript", "Python vs JavaScript", "The Best Programming Languages"];
      }

      // Process each title
      for (const title of titles) {
        addAutomationLog({
          id: uuidv4(),
          sourceId: source.id,
          sourceName: source.name,
          title,
          status: "processing",
          timestamp: new Date().toISOString(),
          message: `Processing "${title}"`,
        });

        const result = await processTitle(title);

        if (result.success) {
          successCount++;
          addAutomationLog({
            id: uuidv4(),
            sourceId: source.id,
            sourceName: source.name,
            title,
            status: "success",
            timestamp: new Date().toISOString(),
            message: `Successfully generated article`,
            articleId: result.articleId,
          });
        } else {
          failCount++;
          addAutomationLog({
            id: uuidv4(),
            sourceId: source.id,
            sourceName: source.name,
            title,
            status: "failed",
            timestamp: new Date().toISOString(),
            message: result.error || "Failed to generate article",
          });
        }
      }

      // Update source's last processed timestamp
      setAutomationSources(automationSources.map(s => 
        s.id === source.id ? { ...s, lastProcessed: new Date().toISOString() } : s
      ));

      toast({
        title: "Source processed",
        description: `${source.name}: ${successCount} articles generated, ${failCount} failed`,
      });
    } catch (error) {
      console.error(`Error processing source ${source.name}:`, error);
      addAutomationLog({
        id: uuidv4(),
        sourceId: source.id,
        sourceName: source.name,
        title: "Source Error",
        status: "failed",
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : "Failed to process source",
      });
      
      toast({
        title: "Processing error",
        description: `Failed to process source: ${source.name}`,
        variant: "destructive",
      });
    }
  };

  // Function to run automation once
  const runAutomation = async () => {
    if (!openRouterConfig.apiKey) {
      toast({
        title: "API key missing",
        description: "Please configure your OpenRouter API key in settings.",
        variant: "destructive",
      });
      return;
    }

    const activeSources = automationSources.filter(source => source.isActive);
    
    if (activeSources.length === 0) {
      toast({
        title: "No active sources",
        description: "Please add or activate at least one source.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Automation started",
      description: `Processing ${activeSources.length} sources...`,
    });
    
    for (const source of activeSources) {
      await processSource(source);
    }
  };

  // Run automation at specified interval
  useInterval(() => {
    if (isAutomationEnabled) {
      runAutomation();
    }
  }, interval * 60 * 1000); // Convert minutes to milliseconds

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Automated Publishing</h2>
          <p className="text-muted-foreground">
            Configure automated article generation from various sources
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="interval">Interval (minutes)</Label>
            <Input 
              id="interval"
              type="number"
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value) || 60)}
              className="w-20"
              min={1}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="automation-toggle"
              checked={isAutomationEnabled}
              onCheckedChange={setIsAutomationEnabled}
            />
            <Label htmlFor="automation-toggle">
              {isAutomationEnabled ? "Enabled" : "Disabled"}
            </Label>
          </div>
          
          <Button 
            variant="default" 
            onClick={runAutomation} 
            disabled={automationSources.filter(s => s.isActive).length === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Run Now
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="settings">Default Settings</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Source</CardTitle>
              <CardDescription>
                Configure where to get article titles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="source-type">Source Type</Label>
                    <Select 
                      value={selectedSourceType} 
                      onValueChange={(value: "rss" | "sheets" | "manual") => setSelectedSourceType(value)}
                    >
                      <SelectTrigger id="source-type">
                        <SelectValue placeholder="Select source type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Title List</SelectItem>
                        <SelectItem value="rss">RSS Feed</SelectItem>
                        <SelectItem value="sheets">Google Sheets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-3">
                    <Label htmlFor="source-name">Source Name</Label>
                    <Input
                      id="source-name"
                      placeholder="My Article Source"
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                    />
                  </div>
                </div>
                
                {(selectedSourceType === "rss" || selectedSourceType === "sheets") && (
                  <div>
                    <Label htmlFor="source-url">
                      {selectedSourceType === "rss" ? "RSS Feed URL" : "Google Sheets URL"}
                    </Label>
                    <Input
                      id="source-url"
                      placeholder={selectedSourceType === "rss" 
                        ? "https://example.com/feed.xml" 
                        : "https://docs.google.com/spreadsheets/d/..."}
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                    />
                  </div>
                )}
                
                {selectedSourceType === "manual" && (
                  <div className="space-y-2">
                    <Label htmlFor="manual-titles">Enter Titles (one per line)</Label>
                    <Textarea
                      id="manual-titles"
                      placeholder="Enter article titles here, one per line..."
                      value={manualTitles}
                      onChange={(e) => setManualTitles(e.target.value)}
                      rows={5}
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {manualTitles.split("\n").filter(line => line.trim()).length} titles
                      </div>
                      <div className="flex items-center">
                        <Input
                          id="title-upload"
                          type="file"
                          accept=".txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Label 
                          htmlFor="title-upload" 
                          className="flex items-center cursor-pointer text-primary hover:text-primary/80 text-sm"
                        >
                          {uploading ? (
                            <>Uploading...</>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-1" />
                              Upload .txt file
                            </>
                          )}
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addSource}>Add Source</Button>
            </CardFooter>
          </Card>
          
          {automationSources.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {automationSources.map((source) => (
                <Card key={source.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{source.name}</CardTitle>
                      <Switch
                        checked={source.isActive}
                        onCheckedChange={() => toggleSourceActive(source.id)}
                      />
                    </div>
                    <CardDescription>
                      {source.type === "rss" && "RSS Feed"}
                      {source.type === "sheets" && "Google Sheets"}
                      {source.type === "manual" && "Manual Titles"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(source.type === "rss" || source.type === "sheets") && source.url && (
                      <div className="text-sm text-muted-foreground truncate">
                        {source.url}
                      </div>
                    )}
                    {source.type === "manual" && source.titles && (
                      <div className="text-sm text-muted-foreground">
                        {source.titles.length} titles
                      </div>
                    )}
                    {source.lastProcessed && (
                      <div className="text-xs text-muted-foreground mt-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Last processed: {format(new Date(source.lastProcessed), "MMM d, yyyy h:mm a")}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive"
                      onClick={() => removeSource(source.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => processSource(source)}
                      disabled={!source.isActive}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Process
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FilePlus className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">No sources yet</h3>
              <p className="text-muted-foreground">
                Add your first source to start automating article generation
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Article Settings</CardTitle>
              <CardDescription>
                Configure default settings for automatically generated articles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-tone">Default Tone</Label>
                  <Select value={defaultTone} onValueChange={setDefaultTone}>
                    <SelectTrigger id="default-tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-language">Default Language</Label>
                  <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                    <SelectTrigger id="default-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-word-count">Default Word Count</Label>
                <Input
                  id="default-word-count"
                  type="number"
                  value={defaultWordCount}
                  onChange={(e) => setDefaultWordCount(parseInt(e.target.value) || 800)}
                  min={300}
                  max={3000}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-category">Default Category</Label>
                <Input
                  id="default-category"
                  value={defaultCategory}
                  onChange={(e) => setDefaultCategory(e.target.value)}
                  placeholder="General"
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="auto-publish"
                  checked={autoPublish}
                  onCheckedChange={setAutoPublish}
                />
                <Label htmlFor="auto-publish">
                  Automatically publish to WordPress
                </Label>
              </div>
              
              {autoPublish && !wordPressConfig.isConnected && (
                <div className="flex items-center space-x-2 p-2 bg-amber-50 text-amber-800 rounded-md text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>WordPress is not configured. Please check your settings.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Automation Logs</CardTitle>
                <CardDescription>
                  History of automated article generation
                </CardDescription>
              </div>
              {automationLogs.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAutomationLogs}
                >
                  Clear Logs
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {automationLogs.length > 0 ? (
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
                    {[...automationLogs].reverse().map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(log.timestamp), "MMM d, HH:mm:ss")}
                        </TableCell>
                        <TableCell>{log.sourceName}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {log.title}
                        </TableCell>
                        <TableCell>
                          {log.status === "success" && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Success
                            </Badge>
                          )}
                          {log.status === "failed" && (
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              Failed
                            </Badge>
                          )}
                          {log.status === "processing" && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              Processing
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {log.message}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No logs yet</h3>
                  <p className="text-muted-foreground">
                    Logs will appear here once you run the automation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomatedPublishing;
