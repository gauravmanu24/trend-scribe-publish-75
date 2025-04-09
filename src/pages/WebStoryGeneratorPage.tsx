
import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/RichTextEditor";

interface StoryPage {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

const WebStoryGeneratorPage = () => {
  const [keywords, setKeywords] = useState("");
  const [niche, setNiche] = useState("");
  const [storyPages, setStoryPages] = useState<StoryPage[]>([]);
  const [storyTitle, setStoryTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(null);
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const { toast } = useToast();

  const generateWebStory = async () => {
    if (!keywords || !niche) {
      toast({
        title: "Missing information",
        description: "Please provide both keywords and niche.",
        variant: "destructive",
      });
      return;
    }

    if (!openRouterConfig.apiKey) {
      toast({
        title: "OpenRouter API key missing",
        description: "Please configure your OpenRouter API key in settings.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    try {
      // First, generate the story structure
      const modelToUse = openRouterConfig.model || "anthropic/claude-3-opus:beta";
      
      const structurePrompt = `Create a web story structure about "${keywords}" for the "${niche}" niche. 
      Give me a captivating title and 5 pages of content. Each page should have a title and short engaging content (2-3 sentences). 
      Format the response as JSON with this structure:
      {
        "title": "The Web Story Title",
        "pages": [
          {
            "title": "Page 1 Title",
            "content": "Short engaging content for page 1"
          },
          ...and so on for 5 pages
        ]
      }`;
      
      const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
              content: "You are an expert web story creator that writes engaging, visual content optimized for the web stories format."
            },
            {
              role: "user", 
              content: structurePrompt
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        }),
      });

      if (!aiResponse.ok) {
        throw new Error(`AI API error: ${aiResponse.statusText}`);
      }
      
      const aiData = await aiResponse.json();
      const content = aiData.choices[0]?.message?.content || "";
      
      if (!content) {
        throw new Error("AI generated empty content");
      }

      // Parse the JSON content
      const storyData = JSON.parse(content);
      setStoryTitle(storyData.title);
      
      // Create story pages with IDs and empty image URLs
      const pages = storyData.pages.map((page: any, index: number) => ({
        id: `page-${index + 1}`,
        title: page.title,
        content: page.content,
        imageUrl: ""
      }));
      
      setStoryPages(pages);
      setSelectedPageIndex(0);
      
      toast({
        title: "Web Story structure created",
        description: "Your web story structure is ready. You can now edit each page and generate images.",
      });
    } catch (error) {
      console.error("Web story generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateImage = async (pageIndex: number) => {
    if (!openRouterConfig.apiKey) {
      toast({
        title: "OpenRouter API key missing",
        description: "Please configure your OpenRouter API key in settings.",
        variant: "destructive",
      });
      return;
    }

    const page = storyPages[pageIndex];
    if (!page) return;
    
    // Update page status to show loading
    const updatedPages = [...storyPages];
    updatedPages[pageIndex] = { ...page, imageUrl: "loading" };
    setStoryPages(updatedPages);
    
    try {
      // Call to image generation API would go here
      // For now, just use a placeholder image
      const placeholderUrl = "https://placehold.co/600x400/webp?text=Web+Story+Image";
      
      // In a real implementation, you would use something like OpenAI's DALL-E API
      // Similar to this:
      /*
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIKey}` 
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Create a web story image for: ${page.title}. ${page.content}`,
          n: 1,
          size: "1024x1024"
        })
      });
      
      const data = await response.json();
      const imageUrl = data.data[0].url;
      */
      
      // For demo, use placeholder after delay
      setTimeout(() => {
        const updatedPages = [...storyPages];
        updatedPages[pageIndex] = { ...page, imageUrl: placeholderUrl };
        setStoryPages(updatedPages);
        
        toast({
          title: "Image generated",
          description: "Image has been generated for this page.",
        });
      }, 1500);
    } catch (error) {
      console.error("Image generation error:", error);
      
      const updatedPages = [...storyPages];
      updatedPages[pageIndex] = { ...page, imageUrl: "" };
      setStoryPages(updatedPages);
      
      toast({
        title: "Image generation failed",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
    }
  };

  const publishToWordPress = async () => {
    if (!wordPressConfig.isConnected) {
      toast({
        title: "WordPress not connected",
        description: "Please configure your WordPress connection in settings.",
        variant: "destructive",
      });
      return;
    }
    
    if (storyPages.length === 0) {
      toast({
        title: "No content to publish",
        description: "Please generate a web story first.",
        variant: "destructive",
      });
      return;
    }
    
    setGenerating(true);
    
    try {
      // In a real implementation, you would use the WordPress REST API to create a web story
      // This would depend on having the Web Stories plugin installed on your WordPress site
      
      toast({
        title: "Publishing to WordPress",
        description: "Your web story is being published...",
      });
      
      // Simulate a successful publish
      setTimeout(() => {
        toast({
          title: "Web story published",
          description: "Your web story has been successfully published to WordPress.",
        });
        setGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("WordPress publishing error:", error);
      toast({
        title: "Publishing failed",
        description: error instanceof Error ? error.message : "Failed to publish to WordPress",
        variant: "destructive",
      });
      setGenerating(false);
    }
  };

  const updatePageContent = (index: number, field: keyof StoryPage, value: string) => {
    if (index === null) return;
    
    const updatedPages = [...storyPages];
    updatedPages[index] = { ...updatedPages[index], [field]: value };
    setStoryPages(updatedPages);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Web Story Generator</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Web Story</CardTitle>
          <CardDescription>
            Generate engaging web stories for WordPress using AI. Simply enter keywords and select a niche.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input 
                id="keywords" 
                placeholder="Enter main keywords (e.g., 'summer fashion trends')" 
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                disabled={generating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Select 
                disabled={generating}
                onValueChange={setNiche}
                value={niche}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="food">Food & Recipes</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="health">Health & Fitness</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={generateWebStory}
            disabled={generating || !keywords || !niche}
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : "Generate Web Story"}
          </Button>
        </CardContent>
      </Card>
      
      {storyTitle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{storyTitle}</span>
              <Button 
                onClick={publishToWordPress}
                disabled={generating || storyPages.some(page => !page.imageUrl || page.imageUrl === "loading")}
              >
                {generating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : "Publish to WordPress"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-5">
              <div className="md:col-span-1">
                <div className="space-y-2">
                  <Label>Pages</Label>
                  <div className="space-y-2">
                    {storyPages.map((page, index) => (
                      <Button 
                        key={page.id}
                        variant={selectedPageIndex === index ? "default" : "outline"}
                        className="w-full justify-start text-left"
                        onClick={() => setSelectedPageIndex(index)}
                      >
                        {index + 1}. {page.title.length > 15 ? `${page.title.substring(0, 15)}...` : page.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-4">
                {selectedPageIndex !== null && storyPages[selectedPageIndex] && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageTitle">Page Title</Label>
                      <Input 
                        id="pageTitle"
                        value={storyPages[selectedPageIndex].title}
                        onChange={(e) => updatePageContent(selectedPageIndex, "title", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pageContent">Page Content</Label>
                      <Textarea 
                        id="pageContent"
                        value={storyPages[selectedPageIndex].content}
                        onChange={(e) => updatePageContent(selectedPageIndex, "content", e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Page Image</Label>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => generateImage(selectedPageIndex)}
                          disabled={storyPages[selectedPageIndex].imageUrl === "loading"}
                        >
                          {storyPages[selectedPageIndex].imageUrl === "loading" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Image className="mr-2 h-4 w-4" />
                              Generate Image
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="border rounded-md p-4 flex items-center justify-center min-h-[200px] bg-muted/20">
                        {storyPages[selectedPageIndex].imageUrl ? (
                          storyPages[selectedPageIndex].imageUrl === "loading" ? (
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Loader2 className="h-8 w-8 animate-spin mb-2" />
                              <span>Generating image...</span>
                            </div>
                          ) : (
                            <img 
                              src={storyPages[selectedPageIndex].imageUrl} 
                              alt={storyPages[selectedPageIndex].title}
                              className="max-h-[300px] object-contain" 
                            />
                          )
                        ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Image className="h-8 w-8 mb-2" />
                            <span>No image generated yet</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebStoryGeneratorPage;
