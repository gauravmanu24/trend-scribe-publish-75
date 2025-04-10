import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, RefreshCcw, Search, Shield, Loader2, BarChart2, MessageSquareText } from "lucide-react";
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
    seoScore?: number;
    seoSuggestions?: string[];
    nlpAnalysis?: {
      sentiment: string;
      entities: string[];
      keywords: string[];
      readability: number;
    };
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

  const handleSEOAnalysis = async () => {
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
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Random SEO score between 60-95% for demo purposes
      const seoScore = Math.floor(Math.random() * 35) + 60;
      
      // Sample SEO suggestions
      const seoSuggestions = [
        "Consider adding more relevant keywords to your title",
        "Add meta description with primary keywords",
        "Include more internal links",
        "Optimize image alt texts",
        "Improve content structure with more headings"
      ];
      
      // Randomly select 2-4 suggestions
      const numSuggestions = Math.floor(Math.random() * 3) + 2;
      const selectedSuggestions = seoSuggestions
        .sort(() => 0.5 - Math.random())
        .slice(0, numSuggestions);
      
      setResults(prev => ({ 
        ...prev, 
        seoScore,
        seoSuggestions: selectedSuggestions
      }));
      
      toast({
        title: "SEO Analysis Complete",
        description: `Your content has been analyzed for search optimization.`,
      });
    } catch (error) {
      console.error("SEO analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Could not complete SEO analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNLPAnalysis = async () => {
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
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Sample sentiment options
      const sentiments = ["Positive", "Neutral", "Slightly positive", "Slightly negative"];
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      
      // Generate random entities
      const entityTypes = ["Person", "Organization", "Location", "Date", "Product"];
      const entities = [];
      const numEntities = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < numEntities; i++) {
        const type = entityTypes[Math.floor(Math.random() * entityTypes.length)];
        const words = content.split(' ');
        const randomWord = words[Math.floor(Math.random() * words.length)].replace(/[^a-zA-Z]/g, '');
        if (randomWord && randomWord.length > 3) {
          entities.push(`${randomWord} (${type})`);
        }
      }
      
      // Generate random keywords
      const keywords = [];
      const numKeywords = Math.floor(Math.random() * 5) + 3;
      const contentWords = content.split(' ');
      
      for (let i = 0; i < numKeywords; i++) {
        const randomIndex = Math.floor(Math.random() * contentWords.length);
        const word = contentWords[randomIndex].replace(/[^a-zA-Z]/g, '');
        if (word && word.length > 4 && !keywords.includes(word)) {
          keywords.push(word);
        }
      }
      
      // Random readability score between 50-95
      const readability = Math.floor(Math.random() * 45) + 50;
      
      setResults(prev => ({ 
        ...prev, 
        nlpAnalysis: {
          sentiment: randomSentiment,
          entities: [...new Set(entities)],
          keywords: [...new Set(keywords)],
          readability
        }
      }));
      
      toast({
        title: "NLP Analysis Complete",
        description: `Your content has been analyzed using natural language processing.`,
      });
    } catch (error) {
      console.error("NLP analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Could not complete NLP analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full text-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4 bg-green-900 w-full">
          <TabsTrigger value="ai-detection" className="data-[state=active]:bg-green-700 text-white">AI Detection</TabsTrigger>
          <TabsTrigger value="plagiarism" className="data-[state=active]:bg-green-700 text-white">Plagiarism</TabsTrigger>
          <TabsTrigger value="content-spinner" className="data-[state=active]:bg-green-700 text-white">Content Spinner</TabsTrigger>
          <TabsTrigger value="seo-analyzer" className="data-[state=active]:bg-green-700 text-white">SEO Analyzer</TabsTrigger>
          <TabsTrigger value="nlp-analyzer" className="data-[state=active]:bg-green-700 text-white">NLP Analyzer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai-detection">
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Check if your content appears to be AI-generated. Lower scores suggest more human-like content.
            </p>
            
            {results.aiScore !== undefined ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-white">AI Detection Score</Label>
                  <span className={`font-bold ${results.aiScore > 15 ? 'text-amber-300' : 'text-green-300'}`}>
                    {results.aiScore}%
                  </span>
                </div>
                <Progress value={results.aiScore} className="h-2" />
                <div className="flex items-start mt-4 bg-green-900/30 p-3 rounded-md">
                  {results.aiScore > 15 ? (
                    <AlertCircle className="h-5 w-5 text-amber-300 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-white">
                      {results.aiScore > 15 
                        ? "Moderate AI signals detected" 
                        : "Low AI signals detected"}
                    </p>
                    <p className="text-sm text-gray-300">
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
                className="w-full bg-green-600 hover:bg-green-700"
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
            <p className="text-sm text-gray-300">
              Check if your content contains plagiarized material from across the web.
            </p>
            
            {results.plagiarismScore !== undefined ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-white">Plagiarism Score</Label>
                  <span className={`font-bold ${results.plagiarismScore > 5 ? 'text-red-300' : 'text-green-300'}`}>
                    {results.plagiarismScore}%
                  </span>
                </div>
                <Progress value={results.plagiarismScore} className="h-2" />
                <div className="flex items-start mt-4 bg-green-900/30 p-3 rounded-md">
                  {results.plagiarismScore > 5 ? (
                    <AlertCircle className="h-5 w-5 text-red-300 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-white">
                      {results.plagiarismScore > 5 
                        ? "Potential plagiarism detected" 
                        : "Original content"}
                    </p>
                    <p className="text-sm text-gray-300">
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
                className="w-full bg-green-600 hover:bg-green-700"
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
            <p className="text-sm text-gray-300">
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
                className="w-full bg-green-600 hover:bg-green-700"
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

        <TabsContent value="seo-analyzer">
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Analyze your content for search engine optimization and discover improvement opportunities.
            </p>
            
            {results.seoScore !== undefined ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-white">SEO Score</Label>
                  <span className={`font-bold ${
                    results.seoScore > 80 ? 'text-green-300' : 
                    results.seoScore > 65 ? 'text-amber-300' : 
                    'text-red-300'
                  }`}>
                    {results.seoScore}%
                  </span>
                </div>
                <Progress value={results.seoScore} className="h-2" />
                
                <div className="mt-4">
                  <Label className="mb-2 block">Recommendations</Label>
                  <ul className="space-y-2 bg-green-900/30 p-3 rounded-md">
                    {results.seoSuggestions?.map((suggestion, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-amber-300 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleSEOAnalysis} 
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Run SEO Analysis
                  </>
                )}
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="nlp-analyzer">
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Use natural language processing to extract insights from your content.
            </p>
            
            {results.nlpAnalysis ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Sentiment Analysis</Label>
                    <div className="bg-green-900/30 p-3 rounded-md">
                      <p className="text-sm font-medium">{results.nlpAnalysis.sentiment}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Readability Score</Label>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span className={`font-bold ${
                          results.nlpAnalysis.readability > 80 ? 'text-green-300' : 
                          results.nlpAnalysis.readability > 60 ? 'text-amber-300' : 
                          'text-red-300'
                        }`}>
                          {results.nlpAnalysis.readability}%
                        </span>
                      </div>
                      <Progress value={results.nlpAnalysis.readability} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Key Entities</Label>
                  <div className="bg-green-900/30 p-3 rounded-md">
                    <div className="flex flex-wrap gap-1">
                      {results.nlpAnalysis.entities.map((entity, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary-foreground">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Keywords</Label>
                  <div className="bg-green-900/30 p-3 rounded-md">
                    <div className="flex flex-wrap gap-1">
                      {results.nlpAnalysis.keywords.map((keyword, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleNLPAnalysis} 
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <MessageSquareText className="mr-2 h-4 w-4" />
                    Run NLP Analysis
                  </>
                )}
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentTools;
