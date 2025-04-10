import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Send, PlusCircle, ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Article } from "@/types";
import AIWriterOptions from "@/components/AIWriterOptions";
import ContentTools from "@/components/ContentTools";
import ImageGenerator from "@/components/ImageGenerator";
import RichTextEditor from "@/components/RichTextEditor";
import { freeAiModels, paidAiModels } from "@/components/AIModels";

const apiIntegrations = [
  {
    name: "OpenAI",
    models: [
      { value: "openai/gpt-4o", label: "GPT-4o" },
      { value: "openai/gpt-4-turbo", label: "GPT-4 Turbo" },
      { value: "openai/gpt-3.5-turbo", label: "GPT-3.5 Turbo" }
    ],
    configKey: "openAiApiKey"
  },
  {
    name: "Groq",
    models: [
      { value: "groq/llama-3-70b-8192", label: "LLaMA-3 70B" },
      { value: "groq/gemma-7b-it", label: "Gemma 7B" }
    ],
    configKey: "groqApiKey"
  },
  {
    name: "Anthropic",
    models: [
      { value: "anthropic/claude-3-opus", label: "Claude 3 Opus" },
      { value: "anthropic/claude-3-sonnet", label: "Claude 3 Sonnet" },
      { value: "anthropic/claude-3-haiku", label: "Claude 3 Haiku" }
    ],
    configKey: "anthropicApiKey"
  },
  {
    name: "DeepInfra",
    models: [
      { value: "deepinfra/llama-3-70b", label: "LLaMA-3 70B" },
      { value: "deepinfra/mistral-7b", label: "Mistral 7B" }
    ],
    configKey: "deepInfraApiKey"
  }
];

const activeFreeFreeAiModels = freeAiModels.filter(model => {
  const excludedModels = [
    "sophosympatheia/rogue-rose-103b-v0.2:free", 
    "bytedance-research/ui-tars-72b:free",
    "qwen/qwq-32b-preview:free"
  ];
  return !excludedModels.includes(model.value);
});

const AIWriterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const updateOpenRouterConfig = useAppStore((state) => state.updateOpenRouterConfig);
  const addArticle = useAppStore((state) => state.addArticle);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [modelType, setModelType] = useState("predefined"); // "predefined", "free", "custom", or "external"
  const [customModel, setCustomModel] = useState("");
  const [autoPublish, setAutoPublish] = useState(true);
  const [apiProvider, setApiProvider] = useState("openai");
  const [selectedApi, setSelectedApi] = useState(apiIntegrations[0]);
  const [selectedApiModel, setSelectedApiModel] = useState("");
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [showAiImageGenerator, setShowAiImageGenerator] = useState(false);
  
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("en");
  const [wordCount, setWordCount] = useState(1000);
  const [outputFormat, setOutputFormat] = useState("html");
  
  const handleGenerate = async () => {
    if (!title || !topic) {
      toast({
        title: "Missing fields",
        description: "Please provide both a title and topic.",
        variant: "destructive",
      });
      return;
    }
    
    if (modelType !== "external" && !openRouterConfig.apiKey) {
      toast({
        title: "API key missing",
        description: "Please configure your OpenRouter API key in settings.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      let modelToUse = openRouterConfig.model;
      
      if (modelType === "free") {
        modelToUse = openRouterConfig.freeModel || activeFreeFreeAiModels[0].value;
      } else if (modelType === "custom") {
        modelToUse = customModel;
      } else if (modelType === "external") {
        modelToUse = selectedApiModel;
      }
      
      const languageNames: {[key: string]: string} = {
        en: "English", es: "Spanish", fr: "French", de: "German",
        it: "Italian", pt: "Portuguese", ru: "Russian", ja: "Japanese",
        zh: "Chinese", ar: "Arabic", hi: "Hindi"
      };
      
      const systemMessage = `You are a professional content writer who creates well-researched, informative articles. 
      Write in a ${tone} tone in ${languageNames[language] || "English"}. 
      ${outputFormat === "html" ? "Format your response with proper HTML tags including h2, h3, h4 for headings, <ul> and <li> for lists, and <p> tags for paragraphs." : 
        outputFormat === "markdown" ? "Format your response with proper Markdown syntax for headings, lists, and paragraphs." :
        "Write in clear, well-structured paragraphs with proper sections."
      }`;
      
      const userMessage = `Write a comprehensive article with the title: "${title}" about the topic: "${topic}". 
      Write in ${languageNames[language] || "English"} using a ${tone} tone. 
      The article should be approximately ${wordCount} words in length.
      ${outputFormat === "html" ? 
        "Format your response with proper HTML tags including <h2>, <h3>, <h4> for headings, <ul> and <li> for lists, and <p> tags for paragraphs." :
        outputFormat === "markdown" ? 
        "Format your response with proper Markdown syntax for headings (#, ##, ###), lists (-, *), and paragraphs." :
        "Make it informative, factual, and engaging for readers with clear sections."
      }`;
      
      let apiEndpoint = "https://openrouter.ai/api/v1/chat/completions";
      let apiKey = openRouterConfig.apiKey;
      let apiHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      };
      
      if (modelType === "external") {
        console.log(`Using external API provider: ${apiProvider}, model: ${selectedApiModel}`);
        
        switch (apiProvider.toLowerCase()) {
          case "openai":
            apiEndpoint = "https://api.openai.com/v1/chat/completions";
            apiKey = "";
            apiHeaders = {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            };
            break;
          case "anthropic":
            apiEndpoint = "https://api.anthropic.com/v1/messages";
            apiKey = "";
            apiHeaders = {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01"
            };
            break;
          case "groq":
            apiEndpoint = "https://api.groq.com/openai/v1/chat/completions";
            apiKey = "";
            apiHeaders = {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            };
            break;
          default:
            break;
        }
      }
      
      const maxRetries = 2;
      let retryCount = 0;
      let success = false;
      let content = "";
      
      while (retryCount <= maxRetries && !success) {
        try {
          if (retryCount > 0 && modelType === "free") {
            const stableModels = [
              "mistralai/mistral-7b-instruct:free", 
              "meta-llama/llama-3.1-8b-instruct:free",
              "google/gemini-pro:free"
            ];
            modelToUse = stableModels[Math.min(retryCount - 1, stableModels.length - 1)];
            console.log(`Retrying with more stable model: ${modelToUse}`);
          }
          
          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: apiHeaders,
            body: JSON.stringify({
              model: modelToUse,
              messages: [
                {
                  role: "system",
                  content: systemMessage
                },
                {
                  role: "user",
                  content: userMessage
                }
              ],
              temperature: 0.7,
              timeout: 120000
            }),
          });
    
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error (${response.status}): ${errorText}`);
            throw new Error(`API error: ${response.statusText}`);
          }
          
          const data = await response.json();
          content = data.choices && data.choices.length > 0 
            ? data.choices[0]?.message?.content || "" 
            : "";
          
          if (content) {
            success = true;
          } else {
            throw new Error("Received empty content from API");
          }
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          
          if (retryCount > maxRetries) {
            throw error;
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      setGeneratedContent(content);
      
      if (modelType === "free") {
        updateOpenRouterConfig({ freeModel: modelToUse });
      } else if (modelType === "custom" && customModel && customModel !== openRouterConfig.model) {
        updateOpenRouterConfig({ model: customModel });
      }
      
      toast({
        title: "Content generated",
        description: "Your article has been successfully generated.",
      });
      
      if (autoPublish && wordPressConfig.isConnected) {
        await handlePublishToWordPress(title, content);
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate article content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePublishToWordPress = async (articleTitle: string, articleContent: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${wordPressConfig.url}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${wordPressConfig.username}:${wordPressConfig.password}`),
        },
        body: JSON.stringify({
          title: articleTitle,
          content: articleContent,
          status: 'publish',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `WordPress error: ${response.statusText}`);
      }
      
      const publishedData = await response.json();
      
      toast({
        title: "Article published",
        description: "The article was successfully published to WordPress.",
      });
      
      return publishedData;
    } catch (error) {
      console.error("WordPress publishing error:", error);
      toast({
        title: "WordPress publishing failed",
        description: error instanceof Error ? error.message : "Failed to publish to WordPress",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!title || !generatedContent) {
      toast({
        title: "Missing content",
        description: "Please generate content before saving.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let wordpressPostId, wordpressPostUrl;
      
      const article = {
        title,
        content: generatedContent,
        feedId: "manual",
        sourceTitle: "Manual Entry",
        status: "generated" as Article["status"],
      };
      
      if (autoPublish && wordPressConfig.isConnected) {
        try {
          const publishedData = await handlePublishToWordPress(title, generatedContent);
          
          if (publishedData && publishedData.id) {
            wordpressPostId = publishedData.id;
            wordpressPostUrl = publishedData.link;
            
            addArticle({
              ...article,
              status: "published" as Article["status"],
              wordpressPostId,
              wordpressPostUrl,
              publishedAt: new Date().toISOString(),
            });
          } else {
            addArticle(article);
          }
        } catch (error) {
          addArticle(article);
          throw error;
        }
      } else {
        addArticle(article);
        
        toast({
          title: "Article saved",
          description: "Your article has been saved.",
        });
      }
      
      setTitle("");
      setTopic("");
      setGeneratedContent("");
      setCustomModel("");
      
      navigate("/articles");
    } catch (error) {
      console.error("Saving error:", error);
    }
  };

  const handleApiProviderChange = (value: string) => {
    setApiProvider(value);
    const newSelectedApi = apiIntegrations.find(api => api.name.toLowerCase() === value.toLowerCase()) || apiIntegrations[0];
    setSelectedApi(newSelectedApi);
    setSelectedApiModel(newSelectedApi.models[0].value);
  };

  const handleAddImage = (imageUrl: string) => {
    const imgTag = `<img src="${imageUrl}" alt="Article image" class="my-4 rounded-md max-w-full" />`;
    setGeneratedContent(prevContent => prevContent + '\n' + imgTag);
    setShowImageGenerator(false);
    setShowAiImageGenerator(false);
  };

  return (
    <div className="max-w-7xl mx-auto bg-ai-writer">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">AI Writer</h1>
      
      {!openRouterConfig.apiKey && modelType !== "external" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            OpenRouter API key not configured. Please add it in the settings.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Article Details</h2>
            <div className="panel-bg p-6 h-[480px] overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700">Article Title</Label>
                  <Input 
                    id="title"
                    placeholder="Enter article title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-gray-700">Topic or Keywords</Label>
                  <Input
                    id="topic"
                    placeholder="Enter topic, keywords, or brief description"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <AIWriterOptions 
                  tone={tone}
                  setTone={setTone}
                  language={language}
                  setLanguage={setLanguage}
                  wordCount={wordCount}
                  setWordCount={setWordCount}
                  outputFormat={outputFormat}
                  setOutputFormat={setOutputFormat}
                />
                
                <div className="space-y-4 pt-4">
                  <Label className="text-gray-700">AI Provider & Model</Label>
                  <Tabs 
                    value={modelType} 
                    onValueChange={setModelType}
                    className="w-full ai-writer-tabs"
                  >
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="predefined" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Predefined</TabsTrigger>
                      <TabsTrigger value="free" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Free Models</TabsTrigger>
                      <TabsTrigger value="custom" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Custom</TabsTrigger>
                      <TabsTrigger value="external" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">External APIs</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="predefined" className="space-y-2 mt-4">
                      <Label htmlFor="model" className="text-gray-700">OpenRouter Model</Label>
                      <Select 
                        value={openRouterConfig.model} 
                        onValueChange={(value) => updateOpenRouterConfig({ model: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          {paidAiModels.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TabsContent>
                    
                    <TabsContent value="free" className="space-y-2 mt-4">
                      <Label htmlFor="free-model">Free AI Models</Label>
                      <Select 
                        value={openRouterConfig.freeModel || activeFreeFreeAiModels[0].value} 
                        onValueChange={(value) => updateOpenRouterConfig({ freeModel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select free AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-80">
                            {activeFreeFreeAiModels.map((model) => (
                              <SelectItem key={model.value} value={model.value}>
                                {model.label}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </TabsContent>
                    
                    <TabsContent value="custom" className="space-y-2 mt-4">
                      <Label htmlFor="custom-model">Custom Model ID</Label>
                      <Input 
                        id="custom-model"
                        placeholder="Enter model ID (e.g., anthropic/claude-3-opus:beta)"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the full model ID from OpenRouter
                      </p>
                    </TabsContent>

                    <TabsContent value="external" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-provider">API Provider</Label>
                        <Select 
                          value={apiProvider} 
                          onValueChange={handleApiProviderChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select API provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {apiIntegrations.map((api) => (
                              <SelectItem key={api.name} value={api.name.toLowerCase()}>
                                {api.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="api-model">Model</Label>
                        <Select 
                          value={selectedApiModel} 
                          onValueChange={setSelectedApiModel}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedApi.models.map((model) => (
                              <SelectItem key={model.value} value={model.value}>
                                {model.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input 
                          id="api-key"
                          type="password"
                          placeholder={`Enter your ${selectedApi.name} API key`}
                        />
                        <p className="text-xs text-muted-foreground">
                          This key is only used for this session and not stored permanently.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {wordPressConfig.isConnected && (
                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox 
                      id="auto-publish" 
                      checked={autoPublish} 
                      onCheckedChange={(checked) => setAutoPublish(checked === true)}
                      className="border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="auto-publish" className="text-gray-700">Auto-publish to WordPress when saving</Label>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    variant="outline"
                    className="w-full mb-4 btn-outline-blue" 
                    onClick={() => setShowAiImageGenerator(true)}
                    disabled={loading}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate AI Image
                  </Button>
                  
                  <Button 
                    className="w-full btn-blue"
                    onClick={handleGenerate}
                    disabled={loading || !title || !topic || (modelType !== "external" && !openRouterConfig.apiKey)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Content"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Generated Content</h2>
            <div className="panel-bg p-6 h-[480px] flex flex-col">
              <div className="flex-grow overflow-auto mb-4">
                <RichTextEditor 
                  value={generatedContent} 
                  onChange={setGeneratedContent}
                  onImageRequest={() => setShowImageGenerator(true)}
                  className="text-gray-700 bg-transparent min-h-full" 
                />
              </div>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setGeneratedContent("")}
                  disabled={!generatedContent || loading}
                  className="btn-outline-blue"
                >
                  Clear
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!generatedContent || loading}
                  className="btn-blue"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {autoPublish && wordPressConfig.isConnected ? "Publishing..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {autoPublish && wordPressConfig.isConnected ? "Save & Publish" : "Save Article"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-blue-600 text-center mb-2">Content Tools</h2>
          <p className="text-center text-blue-600 mb-4">Analyze and improve your content with these tools</p>
          <div className="panel-bg p-6 h-[350px] overflow-auto">
            <ContentTools content={generatedContent} />
          </div>
        </div>

        {showAiImageGenerator && (
          <div className="mt-6">
            <ImageGenerator onImageSelect={handleAddImage} />
          </div>
        )}

        {showImageGenerator && !showAiImageGenerator && (
          <div className="mt-6">
            <ImageGenerator onImageSelect={handleAddImage} />
          </div>
        )}

        {!showImageGenerator && !showAiImageGenerator && generatedContent && (
          <Button 
            variant="outline" 
            onClick={() => setShowImageGenerator(true)}
            className="w-full mt-6 btn-outline-blue"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default AIWriterPage;
