
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

const TitleGeneratorPage = () => {
  const { toast } = useToast();
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  const [titleGeneratorNiche, setTitleGeneratorNiche] = useState("");
  const [titleCount, setTitleCount] = useState<string>("10");
  const [isTitleGenerating, setIsTitleGenerating] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);

  const generateTitles = async () => {
    if (!titleGeneratorNiche) {
      toast({
        title: "Niche required",
        description: "Please specify a niche for title generation.",
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

    setIsTitleGenerating(true);
    try {
      const count = parseInt(titleCount) || 10;
      const modelToUse = openRouterConfig.model || "meta-llama/llama-3.1-8b-instruct";
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterConfig.apiKey}`,
          "HTTP-Referer": window.location.origin,
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            {
              role: "system",
              content: "You are a professional content strategist who creates engaging, clickable article titles."
            },
            {
              role: "user",
              content: `Generate ${count} unique, engaging, and SEO-friendly article titles for the ${titleGeneratorNiche} niche. Format the output as a numbered list.`
            }
          ],
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (content) {
        // Extract titles from numbered list format
        const extractedTitles = content
          .split(/\d+\.\s+/)
          .map(line => line.trim())
          .filter(line => line.length > 0);
          
        setGeneratedTitles(extractedTitles);
        
        toast({
          title: "Titles generated",
          description: `Generated ${extractedTitles.length} titles for ${titleGeneratorNiche} niche.`,
        });
      } else {
        throw new Error("No content returned from API");
      }
    } catch (error) {
      console.error("Title generation error:", error);
      toast({
        title: "Title generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTitleGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedTitles.length === 0) return;
    
    const titlesToClip = generatedTitles.map((t, i) => `${i+1}. ${t}`).join('\n');
    navigator.clipboard.writeText(titlesToClip);
    
    toast({
      title: "Copied to clipboard",
      description: `${generatedTitles.length} titles copied to clipboard.`,
    });
  };

  return (
    <div className="container py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Title Generator</h1>
      <p className="text-muted-foreground mb-8">Generate engaging article titles for your content</p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Titles</CardTitle>
            <CardDescription>
              Configure your title generation preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="niche">Niche/Topic</Label>
                <Input
                  id="niche"
                  placeholder="e.g., Digital Marketing, Health & Wellness, etc."
                  value={titleGeneratorNiche}
                  onChange={(e) => setTitleGeneratorNiche(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="title-count">Number of Titles</Label>
                <Select value={titleCount} onValueChange={setTitleCount}>
                  <SelectTrigger id="title-count">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Titles</SelectItem>
                    <SelectItem value="10">10 Titles</SelectItem>
                    <SelectItem value="25">25 Titles</SelectItem>
                    <SelectItem value="50">50 Titles</SelectItem>
                    <SelectItem value="100">100 Titles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={generateTitles}
              disabled={isTitleGenerating || !openRouterConfig.apiKey || !titleGeneratorNiche}
            >
              {isTitleGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Titles...
                </>
              ) : (
                "Generate Titles"
              )}
            </Button>

            {!openRouterConfig.apiKey && (
              <p className="text-sm text-amber-600">
                Please configure your OpenRouter API key in the Settings page to use this feature.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Generated Titles</CardTitle>
            <CardDescription>
              {generatedTitles.length > 0 
                ? `${generatedTitles.length} titles for "${titleGeneratorNiche}"`
                : "Generated titles will appear here"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedTitles.length > 0 ? (
              <>
                <div className="border rounded-md h-[300px] overflow-y-auto p-3 mb-4">
                  <ol className="list-decimal list-inside space-y-2">
                    {generatedTitles.map((title, index) => (
                      <li key={index} className="text-sm">
                        {title}
                      </li>
                    ))}
                  </ol>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCopyToClipboard}
                >
                  Copy All Titles
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] border border-dashed rounded-md text-muted-foreground">
                <p>No titles generated yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tips for Effective Article Titles</CardTitle>
          <CardDescription>
            Guidelines to create engaging and SEO-friendly titles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Best Practices</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Keep titles under 60 characters for optimal display in search results</li>
                <li>Include your primary keyword near the beginning of the title</li>
                <li>Use numbers and specific data points when applicable</li>
                <li>Create a sense of urgency or curiosity to drive clicks</li>
                <li>Test different title formats to see what resonates with your audience</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Title Formats That Work</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>How-to:</strong> "How to [Achieve Desire] in [Timeframe]"</li>
                <li><strong>Numbered lists:</strong> "10 Ways to [Solve Problem] Without [Common Solution]"</li>
                <li><strong>Questions:</strong> "Are You Making These [Common] Mistakes?"</li>
                <li><strong>Secrets:</strong> "The Secret to [Desired Outcome] That Nobody Talks About"</li>
                <li><strong>Ultimate guides:</strong> "The Ultimate Guide to [Topic] for [Audience]"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TitleGeneratorPage;
