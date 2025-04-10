import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, RefreshCcw, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { freeAiModels, paidAiModels, apiServices } from "@/components/AIModels";

const SettingsPage = () => {
  const { toast } = useToast();
  
  // State from store
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const pollingInterval = useAppStore((state) => state.pollingInterval) || 60; // Default to 60 if undefined
  const updateOpenRouterConfig = useAppStore((state) => state.updateOpenRouterConfig);
  const updateWordPressConfig = useAppStore((state) => state.updateWordPressConfig);
  const setPollingInterval = useAppStore((state) => state.setPollingInterval);
  const resetStore = useAppStore((state) => state.reset);
  
  // Local form state
  const [apiKey, setApiKey] = useState(openRouterConfig.apiKey);
  const [model, setModel] = useState(openRouterConfig.model);
  const [modelType, setModelType] = useState("paid");
  const [wpUrl, setWpUrl] = useState(wordPressConfig.url);
  const [wpUsername, setWpUsername] = useState(wordPressConfig.username);
  const [wpPassword, setWpPassword] = useState(wordPressConfig.password);
  const [interval, setInterval] = useState(pollingInterval.toString());
  const [selectedService, setSelectedService] = useState("openrouter");
  const [apiConfigValues, setApiConfigValues] = useState<{[key: string]: {[key: string]: string}}>({});
  
  // Loading states
  const [testingWP, setTestingWP] = useState(false);
  const [savingOpenRouter, setSavingOpenRouter] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [savingAPI, setSavingAPI] = useState(false);
  
  // Initialize API config values
  React.useEffect(() => {
    // Initialize with empty objects for each service
    const initialValues: {[key: string]: {[key: string]: string}} = {};
    apiServices.forEach(service => {
      initialValues[service.id] = {};
      service.configFields.forEach(field => {
        initialValues[service.id][field.name] = "";
      });
    });
    
    // Fill in OpenRouter values if available
    if (openRouterConfig.apiKey) {
      initialValues.openrouter.apiKey = openRouterConfig.apiKey;
      initialValues.openrouter.model = openRouterConfig.model;
    }
    
    setApiConfigValues(initialValues);
  }, []);
  
  const handleSaveOpenRouter = () => {
    setSavingOpenRouter(true);
    
    setTimeout(() => {
      updateOpenRouterConfig({
        apiKey,
        model: modelType === "free" ? openRouterConfig.freeModel || freeAiModels[0].value : model,
      });
      
      toast({
        title: "Settings saved",
        description: "Your OpenRouter settings have been saved.",
      });
      
      setSavingOpenRouter(false);
    }, 1000);
  };
  
  const handleTestWordPress = async () => {
    if (!wpUrl || !wpUsername || !wpPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all WordPress fields.",
        variant: "destructive",
      });
      return;
    }
    
    setTestingWP(true);
    
    try {
      // In a real app, this would test the WordPress connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateWordPressConfig({
        url: wpUrl,
        username: wpUsername,
        password: wpPassword,
        isConnected: true,
      });
      
      toast({
        title: "Connection successful",
        description: "Your WordPress connection has been verified.",
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to WordPress site.",
        variant: "destructive",
      });
    } finally {
      setTestingWP(false);
    }
  };
  
  const handleSaveInterval = () => {
    const parsedInterval = parseInt(interval, 10);
    
    if (isNaN(parsedInterval) || parsedInterval < 10) {
      toast({
        title: "Invalid interval",
        description: "Polling interval must be at least 10 minutes.",
        variant: "destructive",
      });
      return;
    }
    
    setPollingInterval(parsedInterval);
    
    toast({
      title: "Interval saved",
      description: `Polling interval set to ${parsedInterval} minutes.`,
    });
  };
  
  const handleResetApp = async () => {
    if (!window.confirm("Are you sure you want to reset all settings and data? This cannot be undone.")) {
      return;
    }
    
    setResetting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      resetStore();
      
      // Reset local state
      setApiKey("");
      setModel("anthropic/claude-3-opus:beta");
      setModelType("paid");
      setWpUrl("");
      setWpUsername("");
      setWpPassword("");
      setInterval("60");
      
      toast({
        title: "Reset complete",
        description: "All settings and data have been reset.",
      });
    } catch (error) {
      toast({
        title: "Reset failed",
        description: "An error occurred while resetting the application.",
        variant: "destructive",
      });
    } finally {
      setResetting(false);
    }
  };
  
  const handleApiConfigChange = (serviceId: string, fieldName: string, value: string) => {
    setApiConfigValues(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [fieldName]: value
      }
    }));
  };
  
  const handleSaveApiConfig = () => {
    setSavingAPI(true);
    
    setTimeout(() => {
      // Here we would save the API configuration
      // For OpenRouter, we'll actually update the store
      if (selectedService === "openrouter") {
        const config = apiConfigValues.openrouter;
        updateOpenRouterConfig({
          apiKey: config.apiKey,
          model: config.model,
        });
      }
      
      toast({
        title: "API configuration saved",
        description: `Your ${apiServices.find(s => s.id === selectedService)?.name} configuration has been saved.`,
      });
      
      setSavingAPI(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Settings</h1>
      
      <Card className="trendy-card">
        <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
          <CardTitle>AI Services Configuration</CardTitle>
          <CardDescription>
            Configure your AI services for content generation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="openrouter" value={selectedService} onValueChange={setSelectedService}>
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-4">
              {apiServices.map(service => (
                <TabsTrigger key={service.id} value={service.id}>
                  {service.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {apiServices.map(service => (
              <TabsContent key={service.id} value={service.id} className="space-y-4 pt-2">
                <div className="flex items-start space-x-4">
                  {service.logoUrl && (
                    <img 
                      src={service.logoUrl} 
                      alt={`${service.name} logo`}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <a 
                      href={service.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Visit {service.name} website
                    </a>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  {service.configFields.map(field => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={`${service.id}-${field.name}`}>{field.label}</Label>
                      
                      {field.type === 'select' ? (
                        <Select 
                          value={apiConfigValues[service.id]?.[field.name] || ''} 
                          onValueChange={(value) => handleApiConfigChange(service.id, field.name, value)}
                        >
                          <SelectTrigger id={`${service.id}-${field.name}`}>
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className="h-80">
                              {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input 
                          id={`${service.id}-${field.name}`}
                          type={field.type} 
                          placeholder={field.placeholder} 
                          value={apiConfigValues[service.id]?.[field.name] || ''}
                          onChange={(e) => handleApiConfigChange(service.id, field.name, e.target.value)}
                        />
                      )}
                      
                      {field.name === 'apiKey' && field.type === 'password' && (
                        <p className="text-xs text-muted-foreground">
                          Get your API key from {service.name}'s developer portal
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                {service.id === 'openrouter' && (
                  <div className="space-y-4 pt-4">
                    <Label>AI Model Type</Label>
                    <Tabs value={modelType} onValueChange={setModelType}>
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="paid">Paid Models</TabsTrigger>
                        <TabsTrigger value="free">Free Models</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="paid" className="space-y-2 mt-4">
                        <Select 
                          value={model} 
                          onValueChange={setModel}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select AI model" />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className="h-80">
                              {paidAiModels.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Paid models offer higher quality output but will use your OpenRouter credits
                        </p>
                      </TabsContent>
                      
                      <TabsContent value="free" className="space-y-2 mt-4">
                        <Select 
                          value={openRouterConfig.freeModel || freeAiModels[0].value} 
                          onValueChange={(value) => updateOpenRouterConfig({ freeModel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select free AI model" />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className="h-80">
                              {freeAiModels.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Free models don't consume API credits but may have lower quality or rate limits
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveApiConfig} 
            disabled={savingAPI}
            className="btn-gradient-primary"
          >
            {savingAPI ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save API Configuration"
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="trendy-card">
        <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
          <CardTitle>WordPress Connection</CardTitle>
          <CardDescription>
            Connect to your WordPress site for automatic content publishing.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wpUrl">WordPress URL</Label>
            <Input 
              id="wpUrl"
              placeholder="https://yoursite.com" 
              value={wpUrl}
              onChange={(e) => setWpUrl(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wpUsername">Username</Label>
            <Input 
              id="wpUsername"
              placeholder="WordPress username" 
              value={wpUsername}
              onChange={(e) => setWpUsername(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wpPassword">Password / App Password</Label>
            <Input 
              id="wpPassword"
              type="password" 
              placeholder="WordPress password or app password" 
              value={wpPassword}
              onChange={(e) => setWpPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We recommend using an <a href="https://wordpress.org/documentation/article/application-passwords/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Application Password</a> for security
            </p>
          </div>
          
          {wordPressConfig.isConnected && (
            <div className="flex items-center text-sm text-green-600">
              <Check className="mr-2 h-4 w-4" />
              Connected to WordPress
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleTestWordPress} 
            disabled={testingWP || !wpUrl || !wpUsername || !wpPassword}
            className="btn-gradient-secondary"
          >
            {testingWP ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing connection...
              </>
            ) : (
              <>
                {wordPressConfig.isConnected ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Reconnect
                  </>
                ) : (
                  "Test & Save Connection"
                )}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="trendy-card">
        <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure system behavior and polling settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interval">Polling Interval (minutes)</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="interval"
                type="number" 
                min="10"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="max-w-[150px]"
              />
              <Button onClick={handleSaveInterval}>Save</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              How often to check RSS feeds for new content (minimum 10 minutes)
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-8" />
      
      <Card className="border-destructive/20 trendy-card">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Actions here can result in data loss. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Resetting the app will delete all your feeds, articles, and configuration settings.
            </AlertDescription>
          </Alert>
          <Button 
            variant="destructive" 
            onClick={handleResetApp} 
            disabled={resetting}
          >
            {resetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Application"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
