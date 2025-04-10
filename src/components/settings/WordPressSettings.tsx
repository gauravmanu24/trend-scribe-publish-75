
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2, RefreshCcw } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useAppStore } from "@/lib/store";

const WordPressSettings = () => {
  const {
    wpUrl,
    wpUsername,
    wpPassword,
    testingWP,
    setWpUrl,
    setWpUsername,
    setWpPassword,
    handleTestWordPress
  } = useSettings();
  
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  
  return (
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
  );
};

export default WordPressSettings;
