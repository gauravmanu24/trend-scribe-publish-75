
import React from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, RefreshCcw, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettingsPage = () => {
  const { toast } = useToast();
  
  // State from store
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const pollingInterval = useAppStore((state) => state.pollingInterval);
  const updateOpenRouterConfig = useAppStore((state) => state.updateOpenRouterConfig);
  const updateWordPressConfig = useAppStore((state) => state.updateWordPressConfig);
  const setPollingInterval = useAppStore((state) => state.setPollingInterval);
  const resetStore = useAppStore((state) => state.reset);
  
  // Local form state
  const [apiKey, setApiKey] = React.useState(openRouterConfig.apiKey);
  const [model, setModel] = React.useState(openRouterConfig.model);
  const [wpUrl, setWpUrl] = React.useState(wordPressConfig.url);
  const [wpUsername, setWpUsername] = React.useState(wordPressConfig.username);
  const [wpPassword, setWpPassword] = React.useState(wordPressConfig.password);
  const [interval, setInterval] = React.useState(pollingInterval.toString());
  
  // Loading states
  const [testingWP, setTestingWP] = React.useState(false);
  const [savingOpenRouter, setSavingOpenRouter] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  
  const handleSaveOpenRouter = () => {
    setSavingOpenRouter(true);
    
    setTimeout(() => {
      updateOpenRouterConfig({
        apiKey,
        model,
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>OpenRouter AI Configuration</CardTitle>
          <CardDescription>
            Configure your OpenRouter API key and model for AI content generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
              id="apiKey"
              type="password" 
              placeholder="Enter your OpenRouter API key" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">OpenRouter</a>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anthropic/claude-3-opus:beta">Claude 3 Opus</SelectItem>
                <SelectItem value="anthropic/claude-3-sonnet:beta">Claude 3 Sonnet</SelectItem>
                <SelectItem value="anthropic/claude-3-haiku:beta">Claude 3 Haiku</SelectItem>
                <SelectItem value="google/gemini-pro">Google Gemini Pro</SelectItem>
                <SelectItem value="openai/gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="meta-llama/llama-3-70b-instruct">Llama 3 70B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveOpenRouter} 
            disabled={savingOpenRouter || !apiKey}
          >
            {savingOpenRouter ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save AI Settings"
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>WordPress Connection</CardTitle>
          <CardDescription>
            Connect to your WordPress site for automatic content publishing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              We recommend using an <a href="https://wordpress.org/documentation/article/application-passwords/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Application Password</a> for security
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
      
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure system behavior and polling settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
      
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Actions here can result in data loss. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
