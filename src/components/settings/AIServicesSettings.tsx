
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { apiServices, paidAiModels, freeAiModels } from "@/components/AIModels";
import { useSettings } from "@/hooks/use-settings";

const AIServicesSettings = () => {
  const { toast } = useToast();
  
  // Use settings hook
  const { 
    apiConfigValues, 
    selectedService, 
    modelType, 
    apiKey,
    model,
    savingAPI,
    setSelectedService, 
    setModelType,
    setApiKey,
    setModel,
    handleApiConfigChange,
    handleSaveApiConfig 
  } = useSettings();
  
  // State from store for OpenRouter config
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const updateOpenRouterConfig = useAppStore((state) => state.updateOpenRouterConfig);
  
  return (
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
  );
};

export default AIServicesSettings;
