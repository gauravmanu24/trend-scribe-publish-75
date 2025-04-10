import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

const freeAiModels = [
  { value: "google/gemini-2.0-flash-thinking-exp:free", label: "Gemini 2.0 Flash Thinking" },
  { value: "google/gemini-2.0-flash-thinking-exp-1219:free", label: "Gemini 2.0 Flash Thinking 1219" },
  { value: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free", label: "Nemotron Ultra 253B" },
  { value: "nvidia/llama-3.3-nemotron-super-49b-v1:free", label: "Nemotron Super 49B" },
  { value: "moonshotai/moonlight-16b-a3b-instruct:free", label: "Moonlight 16B" },
  { value: "nvidia/llama-3.1-nemotron-70b-instruct:free", label: "Nemotron 70B" },
  { value: "nvidia/llama-3.1-nemotron-nano-8b-v1:free", label: "Nemotron Nano 8B" },
  { value: "nousresearch/deephermes-3-llama-3-8b-preview:free", label: "DeepHermes 3 LLaMA 8B" },
  { value: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash" },
  { value: "google/learnlm-1.5-pro-experimental:free", label: "LearnLM 1.5 Pro" },
  { value: "google/gemini-2.5-pro-exp-03-25:free", label: "Gemini 2.5 Pro" },
  { value: "meta-llama/llama-3.2-11b-vision-instruct:free", label: "LLaMA 3.2 11B Vision" },
  { value: "mistralai/mistral-small-3.1-24b-instruct:free", label: "Mistral Small 24B" },
  { value: "deepseek/deepseek-r1-distill-llama-70b:free", label: "DeepSeek R1 LLaMA 70B" },
  { value: "qwen/qwen2.5-vl-32b-instruct:free", label: "Qwen 2.5 VL 32B" },
  { value: "qwen/qwen2.5-vl-72b-instruct:free", label: "Qwen 2.5 VL 72B" },
  { value: "deepseek/deepseek-r1-distill-qwen-32b:free", label: "DeepSeek R1 Qwen 32B" },
  { value: "deepseek/deepseek-r1-distill-qwen-14b:free", label: "DeepSeek R1 Qwen 14B" },
  { value: "qwen/qwen2.5-vl-3b-instruct:free", label: "Qwen 2.5 VL 3B" },
  { value: "meta-llama/llama-3.3-70b-instruct:free", label: "LLaMA 3.3 70B" },
  { value: "qwen/qwen-2.5-vl-7b-instruct:free", label: "Qwen 2.5 VL 7B" },
  { value: "mistralai/mistral-7b-instruct:free", label: "Mistral 7B" },
  { value: "meta-llama/llama-3.2-3b-instruct:free", label: "LLaMA 3.2 3B" },
  { value: "meta-llama/llama-3.2-1b-instruct:free", label: "LLaMA 3.2 1B" },
  { value: "meta-llama/llama-3.1-8b-instruct:free", label: "LLaMA 3.1 8B" },
  { value: "deepseek/deepseek-v3-base:free", label: "DeepSeek V3 Base" },
  { value: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek Chat V3" },
  { value: "deepseek/deepseek-r1-zero:free", label: "DeepSeek R1 Zero" },
  { value: "qwen/qwen-2.5-coder-32b-instruct:free", label: "Qwen 2.5 Coder 32B" },
  { value: "mistralai/mistral-small-24b-instruct-2501:free", label: "Mistral Small 24B 2501" },
  { value: "bytedance-research/ui-tars-72b:free", label: "TARS 72B" },
  { value: "huggingfaceh4/zephyr-7b-beta:free", label: "Zephyr 7B Beta" },
  { value: "meta-llama/llama-4-maverick:free", label: "LLaMA 4 Maverick" },
  { value: "deepseek/deepseek-chat:free", label: "DeepSeek Chat" },
  { value: "qwen/qwq-32b-preview:free", label: "QWQ 32B Preview" },
  { value: "sophosympatheia/rogue-rose-103b-v0.2:free", label: "Rogue Rose 103B" },
  { value: "meta-llama/llama-4-scout:free", label: "LLaMA 4 Scout" },
  { value: "allenai/molmo-7b-d:free", label: "MOLMO 7B" },
  { value: "google/gemma-3-27b-it:free", label: "Gemma 3 27B" },
  { value: "qwen/qwen-2.5-7b-instruct:free", label: "Qwen 2.5 7B" },
  { value: "google/gemma-3-1b-it:free", label: "Gemma 3 1B" },
  { value: "google/gemma-2-9b-it:free", label: "Gemma 2 9B" }
];

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
        modelToUse = openRouterConfig.freeModel || freeAiModels[0].value;
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
      let apiHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      };
      
      if (modelType === "external") {
        console.log(`Using external API provider: ${apiProvider}, model: ${selectedApiModel}`);
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
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const content = data.choices && data.choices.length > 0 
        ? data.choices[0]?.message?.content || "" 
        : "";
      
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Writer</h1>
      
      {!openRouterConfig.apiKey && modelType !== "external" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            OpenRouter API key not configured. Please add it in the settings.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <ContentTools content={generatedContent} />
        </div>
        
        <div className="md:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
                <CardDescription>
                  Enter details for your AI-generated article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title</Label>
                  <Input 
                    id="title"
                    placeholder="Enter article title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic or Keywords</Label>
                  <Input
                    id="topic"
                    placeholder="Enter topic, keywords, or brief description"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
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
                  <Label>AI Provider & Model</Label>
                  <Tabs 
                    value={modelType} 
                    onValueChange={setModelType}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="predefined">Predefined</TabsTrigger>
                      <TabsTrigger value="free">Free Models</TabsTrigger>
                      <TabsTrigger value="custom">Custom</TabsTrigger>
                      <TabsTrigger value="external">External APIs</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="predefined" className="space-y-2 mt-4">
                      <Label htmlFor="model">OpenRouter Model</Label>
                      <Select 
                        value={openRouterConfig.model} 
                        onValueChange={(value) => updateOpenRouterConfig({ model: value })}
                      >
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
                    </TabsContent>
                    
                    <TabsContent value="free" className="space-y-2 mt-4">
                      <Label htmlFor="free-model">Free AI Models</Label>
                      <Select 
                        value={openRouterConfig.freeModel || freeAiModels[0].value} 
                        onValueChange={(value) => updateOpenRouterConfig({ freeModel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select free AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-80">
                            {freeAiModels.map((model) => (
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
                    />
                    <Label htmlFor="auto-publish">Auto-publish to WordPress when saving</Label>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    variant="outline"
                    className="w-full mb-4" 
                    onClick={() => setShowAiImageGenerator(true)}
                    disabled={loading}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate AI Image
                  </Button>
                  
                  <Button 
                    className="w-full btn-gradient-primary"
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>
                  AI-generated content based on your inputs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RichTextEditor 
                  value={generatedContent} 
                  onChange={setGeneratedContent}
                  onImageRequest={() => setShowImageGenerator(true)} 
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setGeneratedContent("")}
                  disabled={!generatedContent || loading}
                >
                  Clear
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!generatedContent || loading}
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
              </CardFooter>
            </Card>
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
              className="w-full mt-6"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWriterPage;
