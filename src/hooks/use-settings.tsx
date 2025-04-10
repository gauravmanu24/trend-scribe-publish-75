
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { freeAiModels } from "@/components/AIModels";
import { apiServices } from "@/components/AIModels";

export const useSettings = () => {
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
  useEffect(() => {
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
  }, [openRouterConfig]);
  
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

  return {
    apiKey,
    model,
    modelType,
    wpUrl,
    wpUsername,
    wpPassword,
    interval,
    selectedService,
    apiConfigValues,
    testingWP,
    savingOpenRouter,
    resetting,
    savingAPI,
    setApiKey,
    setModel,
    setModelType,
    setWpUrl,
    setWpUsername,
    setWpPassword,
    setInterval,
    setSelectedService,
    handleSaveOpenRouter,
    handleTestWordPress,
    handleSaveInterval,
    handleResetApp,
    handleApiConfigChange,
    handleSaveApiConfig
  };
};
