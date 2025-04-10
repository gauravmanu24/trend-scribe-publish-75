
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ArticleDownloader from "@/components/ArticleDownloader";

const AIWriterPage = () => {
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("informative");
  const [length, setLength] = useState("medium");
  const [style, setStyle] = useState("blog");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const { toast } = useToast();

  const handleGenerateContent = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your article.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      // Simulate API call to AI service
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Sample generated content based on inputs
      const sampleContent = `# ${title}

## Introduction
This is an AI-generated article about ${title}. It's written in a ${tone} tone, with a ${length} length, in ${style} style.

## Main Points
${keywords.split(",").map(keyword => `- ${keyword.trim()}\n`).join("")}

## Detailed Analysis
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl eget ultricies ultricies, nunc nisl aliquam nunc, eget aliquam nisl nisl eget nisl. Nulla facilisi. Sed euismod, nisl eget ultricies ultricies, nunc nisl aliquam nunc, eget aliquam nisl nisl eget nisl.

## Conclusion
In conclusion, ${title} is an important topic that deserves attention. We've covered the main points and provided a detailed analysis. Thank you for reading!

Keywords: ${keywords}`;

      setGeneratedContent(sampleContent);
      toast({
        title: "Content generated",
        description: "Your article has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseForAutomation = () => {
    // Implementation for using in automation
    toast({
      title: "Added to automation",
      description: "This article has been added to your automation queue.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Content Writer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Generation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title of your article"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma separated)</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. marketing, social media, strategy"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="entertaining">Entertaining</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (300 words)</SelectItem>
                    <SelectItem value="medium">Medium (600 words)</SelectItem>
                    <SelectItem value="long">Long (1200 words)</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive (2000+ words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="article">News Article</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="listicle">Listicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerateContent} 
              disabled={isGenerating || !title}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-4">
                <Textarea 
                  className="min-h-[400px] font-mono text-sm" 
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                />
                <ArticleDownloader 
                  articleTitle={title} 
                  articleContent={generatedContent}
                  onUseForAutomation={handleUseForAutomation}
                />
              </div>
            ) : (
              <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Generating your content...</p>
                  </div>
                ) : (
                  <p>Generated content will appear here</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIWriterPage;
