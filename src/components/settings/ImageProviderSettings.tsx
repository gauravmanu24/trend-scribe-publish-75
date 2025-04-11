
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Check, Image as ImageIcon, Loader2 } from "lucide-react";

const imageProviders = [
  {
    id: "pixabay",
    name: "Pixabay",
    description: "Free images and royalty-free stock",
    url: "https://pixabay.com/api/docs/",
    logoUrl: "https://pixabay.com/static/img/logo.svg",
    free: true
  },
  {
    id: "pexels",
    name: "Pexels",
    description: "Free stock photos and videos",
    url: "https://www.pexels.com/api/",
    logoUrl: "https://www.pexels.com/assets/logos/pexels-logo-7e8c002dc9ef41a3618682a56d0bb9b3c9f5f087485f4b2c884056d3c4b288c2.png",
    free: true
  },
  {
    id: "unsplash",
    name: "Unsplash",
    description: "Beautiful free images and pictures",
    url: "https://unsplash.com/developers",
    logoUrl: "https://unsplash.com/assets/core/logo-black-df2168ed0c378fa5506b1816e75eb379d06cfcd0af01e07a2eb813ae9b5d7405.svg",
    free: true
  },
  {
    id: "shutterstock",
    name: "Shutterstock",
    description: "Stock photography, footage, and editing tools",
    url: "https://www.shutterstock.com/developers/",
    logoUrl: "https://about.shutterstock.com/wp-content/uploads/2022/02/STS_FullLogo_RGB-Black.svg",
    free: false
  }
];

const ImageProviderSettings = () => {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState("pixabay");
  const [apiKeys, setApiKeys] = useState<{[key: string]: string}>({
    pixabay: "",
    pexels: "",
    unsplash: "",
    shutterstock: ""
  });
  const [activeProviders, setActiveProviders] = useState<{[key: string]: boolean}>({
    pixabay: true,
    pexels: true,
    unsplash: true,
    shutterstock: false
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const handleApiKeyChange = (providerId: string, value: string) => {
    setApiKeys({
      ...apiKeys,
      [providerId]: value
    });
  };

  const toggleProvider = (providerId: string) => {
    setActiveProviders({
      ...activeProviders,
      [providerId]: !activeProviders[providerId]
    });
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Your image provider settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Failed to save settings",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <Card className="trendy-card">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
        <CardTitle>Image Providers</CardTitle>
        <CardDescription>
          Configure image provider APIs for use in your content
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue={selectedProvider} value={selectedProvider} onValueChange={setSelectedProvider}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            {imageProviders.map(provider => (
              <TabsTrigger key={provider.id} value={provider.id}>
                {provider.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {imageProviders.map(provider => (
            <TabsContent key={provider.id} value={provider.id} className="space-y-4 pt-2">
              <div className="flex items-start space-x-4">
                {provider.logoUrl && (
                  <div className="w-12 h-12 flex items-center justify-center overflow-hidden bg-white rounded-md p-1">
                    <img 
                      src={provider.logoUrl} 
                      alt={`${provider.name} logo`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{provider.name}</h3>
                    {provider.free && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                  <a 
                    href={provider.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Visit {provider.name} API docs
                  </a>
                </div>
              </div>
              
              <div className="space-y-4 bg-background/50 rounded-md p-4 border">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${provider.id}-active`} className="flex items-center gap-2">
                    Enable {provider.name}
                    {activeProviders[provider.id] && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </Label>
                  <Switch 
                    id={`${provider.id}-active`}
                    checked={activeProviders[provider.id]}
                    onCheckedChange={() => toggleProvider(provider.id)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`${provider.id}-apikey`}>{provider.name} API Key</Label>
                  <Input
                    id={`${provider.id}-apikey`}
                    type="password"
                    placeholder={`Enter your ${provider.name} API key`}
                    value={apiKeys[provider.id]}
                    onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {provider.free
                      ? `Free to use, but an API key is required for higher rate limits.`
                      : `${provider.name} requires a paid subscription for API access.`}
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <ImageIcon className="h-4 w-4 mr-2" />
          <span>Images will be sourced from activated providers</span>
        </div>
        <Button 
          onClick={handleSaveSettings} 
          disabled={savingSettings}
          className="btn-gradient-primary"
        >
          {savingSettings ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Provider Settings"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageProviderSettings;
