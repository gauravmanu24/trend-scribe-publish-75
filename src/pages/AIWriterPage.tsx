
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

const AIWriterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const addArticle = useAppStore((state) => state.addArticle);
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [generatedContent, setGeneratedContent] = React.useState("");
  
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
      // Make the actual API call to OpenRouter
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: openRouterConfig.model,
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
  
  const handleSave = () => {
    if (!title || !generatedContent) {
      toast({
        title: "Missing content",
        description: "Please generate content before saving.",
        variant: "destructive",
      });
      return;
    }
    
    addArticle({
      title,
      content: generatedContent,
      feedId: "manual",
      sourceTitle: "Manual Entry",
      status: "generated",
    });
    
    toast({
      title: "Article saved",
      description: "Your article has been saved.",
    });
    
    // Reset form
    setTitle("");
    setTopic("");
    setGeneratedContent("");
    
    // Navigate to articles
    navigate("/articles");
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
              disabled={!generatedContent}
            >
              Clear
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!generatedContent}
            >
              <Send className="mr-2 h-4 w-4" />
              Save Article
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AIWriterPage;
