
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, RefreshCcw, Search, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentToolsProps {
  content: string;
}

const ContentTools: React.FC<ContentToolsProps> = ({ content }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ai-detection");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    aiScore?: number;
    plagiarismScore?: number;
    spinnedContent?: string;
  }>({});

  const handleAIDetection = async () => {
    if (!content.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please generate or enter content first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulating API call - in production, this would call an actual AI detection service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Random score between 5-25% for demo purposes
      const aiScore = Math.floor(Math.random() * 20) + 5;
      
      setResults(prev => ({ ...prev, aiScore }));
      
      toast({
        title: "AI Detection Complete",
        description: `Your content has been analyzed.`,
      });
    } catch (error) {
      console.error("AI detection error:", error);
      toast({
        title: "Analysis failed",
        description: "Could not complete AI detection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlagiarismCheck = async () => {
    if (!content.trim()) {
      toast({
        title: "No content to check",
        description: "Please generate or enter content first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Random score between 0-10% for demo purposes
      const plagiarismScore = Math.floor(Math.random() * 10);
      
      setResults(prev => ({ ...prev, plagiarismScore }));
      
      toast({
        title: "Plagiarism Check Complete",
        description: `Your content has been analyzed.`,
      });
    } catch (error) {
      console.error("Plagiarism check error:", error);
      toast({
        title: "Check failed",
        description: "Could not complete plagiarism check. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContentSpin = async () => {
    if (!content.trim()) {
      toast({
        title: "No content to spin",
        description: "Please generate or enter content first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // For demo purposes, we're just adding some variations to the original text
      const sentences = content.split('. ');
      const spinnedSentences = sentences.map(sentence => {
        // Randomly choose whether to modify this sentence
        if (Math.random() > 0.5) {
          // Simple modifications for demo
          return sentence
            .replace(/good/g, 'excellent')
            .replace(/bad/g, 'poor')
            .replace(/important/g, 'crucial')
            .replace(/interesting/g, 'fascinating');
        }
        return sentence;
      });
      
      const spinnedContent = spinnedSentences.join('. ');
      
      setResults(prev => ({ ...prev, spinnedContent }));
      
      toast({
        title: "Content Spin Complete",
        description: "Your content has been rewritten.",
      });
    } catch (error) {
      console.error("Content spin error:", error);
      toast({
        title: "Spin failed",
        description: "Could not spin content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Content Tools</CardTitle>
        <CardDescription>
          Analyze and improve your content with these tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="ai-detection">AI Detection</TabsTrigger>
            <TabsTrigger value="plagiarism">Plagiarism</TabsTrigger>
            <TabsTrigger value="content-spinner">Content Spinner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-detection">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Check if your content appears to be AI-generated. Lower scores suggest more human-like content.
              </p>
              
              {results.aiScore !== undefined ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>AI Detection Score</Label>
                    <span className={`font-bold ${results.aiScore > 15 ? 'text-amber-500' : 'text-green-500'}`}>
                      {results.aiScore}%
                    </span>
                  </div>
                  <Progress value={results.aiScore} className="h-2" />
                  <div className="flex items-start mt-4 bg-muted p-3 rounded-md">
                    {results.aiScore > 15 ? (
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">
                        {results.aiScore > 15 
                          ? "Moderate AI signals detected" 
                          : "Low AI signals detected"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {results.aiScore > 15 
                          ? "Your content shows some characteristics of AI generation. Consider revising to make it more human-like." 
                          : "Your content appears mostly human-like. Great job!"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={handleAIDetection} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Run AI Detection
                    </>
                  )}
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="plagiarism">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Check if your content contains plagiarized material from across the web.
              </p>
              
              {results.plagiarismScore !== undefined ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Plagiarism Score</Label>
                    <span className={`font-bold ${results.plagiarismScore > 5 ? 'text-red-500' : 'text-green-500'}`}>
                      {results.plagiarismScore}%
                    </span>
                  </div>
                  <Progress value={results.plagiarismScore} className="h-2" />
                  <div className="flex items-start mt-4 bg-muted p-3 rounded-md">
                    {results.plagiarismScore > 5 ? (
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">
                        {results.plagiarismScore > 5 
                          ? "Potential plagiarism detected" 
                          : "Original content"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {results.plagiarismScore > 5
                          ? "Your content contains some sections that may be plagiarized. Consider revising these sections."
                          : "Your content appears to be original. Great job!"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={handlePlagiarismCheck} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Check for Plagiarism
                    </>
                  )}
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="content-spinner">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Rewrite your content to create a unique version while preserving meaning.
              </p>
              
              {results.spinnedContent ? (
                <div className="space-y-4">
                  <Label>Spun Content</Label>
                  <Textarea 
                    value={results.spinnedContent} 
                    rows={8}
                    className="font-serif"
                  />
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(results.spinnedContent || "");
                        toast({
                          title: "Copied to clipboard",
                          description: "The rewritten content has been copied to your clipboard.",
                        });
                      }}
                    >
                      Copy to clipboard
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={handleContentSpin} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rewriting...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Spin Content
                    </>
                  )}
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentTools;
