import React from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Article } from "@/types";

// Free models from OpenRouter
const freeAiModels = [
  { value: "google/gemini-2.0-flash-thinking-exp:free", label: "Gemini 2.0 Flash Thinking" },
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
  { value: "meta-llama/llama-3.3-70b-instruct:free", label: "LLaMA 3.3 70B" },
  { value: "mistralai/mistral-7b-instruct:free", label: "Mistral 7B" },
  { value: "meta-llama/llama-3.2-3b-instruct:free", label: "LLaMA 3.2 3B" },
  { value: "meta-llama/llama-3.1-8b-instruct:free", label: "LLaMA 3.1 8B" },
  { value: "qwen/qwen-2.5-7b-instruct:free", label: "Qwen 2.5 7B" }
];

const AIWriterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const updateOpenRouterConfig = useAppStore((state) => state.updateOpenRouterConfig);
  const addArticle = useAppStore((state) => state.addArticle);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [generatedContent, setGeneratedContent] = React.useState("");
  const [modelType, setModelType] = React.useState("predefined"); // "predefined", "free", or "custom"
  const [customModel, setCustomModel] = React.useState("");
  const [autoPublish, setAutoPublish] = React.useState(false);
  
  const handleGenerate = async () => {
    if (!title || !topic) {
      toast({
        title: "Missing fields",
        description: "Please provide both a title and topic.",
        variant: "destructive",
      });
      return;
    }
    
    if (!openRouterConfig.apiKey) {
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
      }
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            {
              role: "system",
              content: "You are a professional content writer who creates well-researched, informative articles. Write in clear, engaging prose with proper sections and paragraphs."
            },
            {
              role: "user",
              content: `Write a comprehensive article with the title: "${title}" about the topic: "${topic}". Include an introduction, main sections with headers, and a conclusion. Make it informative, factual, and engaging for readers.`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      
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
      const article = {
        title,
        content: generatedContent,
        feedId: "manual",
        sourceTitle: "Manual Entry",
        status: "generated" as Article["status"],
      };
      
      addArticle(article);
      
      if (autoPublish && wordPressConfig.isConnected) {
        setLoading(true);
        
        const response = await fetch(`${wordPressConfig.url}/wp-json/wp/v2/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${wordPressConfig.username}:${wordPressConfig.password}`),
          },
          body: JSON.stringify({
            title: title,
            content: generatedContent,
            status: 'publish',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `WordPress error: ${response.statusText}`);
        }
        
        toast({
          title: "Article published",
          description: "The article was successfully published to WordPress.",
        });
      } else {
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
      console.error("Publishing error:", error);
      toast({
        title: "Publishing failed",
        description: error instanceof Error ? error.message : "Failed to publish article to WordPress.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Writer</h1>
      
      {!openRouterConfig.apiKey && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            OpenRouter API key not configured. Please add it in the settings.
          </AlertDescription>
        </Alert>
      )}
      
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
              <Textarea 
                id="topic"
                placeholder="Enter topic, keywords, or brief description"
                className="min-h-[100px]"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="space-y-4 pt-4">
              <Label>AI Model Type</Label>
              <Tabs 
                value={modelType} 
                onValueChange={setModelType}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="predefined">Predefined</TabsTrigger>
                  <TabsTrigger value="free">Free Models</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="predefined" className="space-y-2 mt-4">
                  <Label htmlFor="model">AI Model</Label>
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
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handleGenerate}
              disabled={loading || !title || !topic || !openRouterConfig.apiKey}
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
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              AI-generated content based on your inputs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              className="min-h-[300px] font-serif"
              placeholder="Generated content will appear here..."
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
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
                  {autoPublish ? "Publishing..." : "Saving..."}
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
    </div>
  );
};

export default AIWriterPage;
