
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
      // In a real app, this would call the OpenRouter API
      // Simulating API call and response delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Sample generated content
      const sampleContent = `
The latest trends in ${topic} are showing significant shifts in how people interact with this technology. Industry experts are noting several key developments that are worth watching.

First, there's a growing emphasis on user experience and accessibility. Companies are recognizing that ${topic} needs to be approachable for users of all technical backgrounds. This democratization is leading to wider adoption and more diverse use cases.

Another important trend is the integration of artificial intelligence and machine learning capabilities. These technologies are enhancing ${topic}'s functionality, making systems more adaptive and responsive to user needs. The ability to process and learn from vast amounts of data is opening new possibilities for innovation.

Sustainability is also becoming a central concern in ${topic} development. Organizations are increasingly focusing on reducing energy consumption and environmental impact, responding to both regulatory pressures and consumer demands for more responsible technology.

Security remains a critical priority, with threats becoming more sophisticated. Experts are advocating for "security by design" approaches, where protection measures are built into systems from the ground up rather than added as afterthoughts.

Finally, there's a shift toward more collaborative and open-source development models. This community-driven approach is accelerating innovation and helping to solve complex challenges through collective expertise.

As ${topic} continues to evolve, staying informed about these trends will be essential for businesses and individuals looking to leverage its benefits and prepare for future developments.
      `;
      
      setGeneratedContent(sampleContent);
      
      toast({
        title: "Content generated",
        description: "Your article has been successfully generated.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate article content.",
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
