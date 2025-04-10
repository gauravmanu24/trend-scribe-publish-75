
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
import { Loader2, Save, Wand2, Info, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ArticleDownloader from "@/components/ArticleDownloader";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AIWriterPage = () => {
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("English");
  const [wordCount, setWordCount] = useState(1000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ai-detection");

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
This is an AI-generated article about ${title}. It's written in a ${tone} tone, with approximately ${wordCount} words, in ${language}.

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
    <div className="bg-[#F7F9FC] min-h-[calc(100vh-64px)] py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">AI Writer</h1>
        
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            OpenRouter API key not configured. Please add it in the settings.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-600">Article Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Article Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="keywords">Topic or Keywords</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter topic, keywords, or brief description"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone" className="mt-1">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="entertaining">Entertaining</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="mt-1">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="article-length">Article Length: {wordCount} words</Label>
                </div>
                <input
                  type="range"
                  id="article-length"
                  min="300"
                  max="3000"
                  step="100"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Short (300)</span>
                  <span>Medium (1000)</span>
                  <span>Long (3000)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm">
            <h2 className="text-lg font-medium p-6 pb-2 text-blue-600">Generated Content</h2>
            <div className="p-6 pt-2">
              <div className="border rounded-md mb-4">
                <div className="flex items-center border-b p-2 gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <span className="sr-only">Bold</span>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M6 4V3h8a4 4 0 0 1 4 4 4 4 0 0 1-3 3.87 4 4 0 0 1 3 3.87V15a4 4 0 0 1-4 4H6v-1h1V5H6V4Zm3 1v5h3a3 3 0 1 0 0-6H8a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1Zm0 6v5h4a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3H8a1 1 0 0 0-1 1v7Z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <span className="sr-only">Italic</span>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M8 4h9v1h-1l-4 14h1v1H4v-1h1l4-14H8V4Z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <span className="sr-only">Underline</span>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M12 17c3.31 0 6-2.69 6-6V3h-2v8c0 2.21-1.79 4-4 4s-4-1.79-4-4V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <span className="sr-only">Header</span>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M11 7h2v10h-2v-4H7v4H5V7h2v4h4V7zm6 0h2v10h-2V7z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <span className="sr-only">Subheader</span>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M12 9v3H9v1h3v3h1v-3h3v-1h-3V9h-1zm-5 9v1H3v-1h4zm-4-2h8v1H3v-1zm0-2h12v1H3v-1zm0-2h18v1H3v-1z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <span className="sr-only">Subheader 3</span>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M17 11h-1v-1h-4v1H7v2h5v1h-3v2h3v1H6v2h6v-2h6v-6zm3 0v2h1v-2h-1zm-3-7h1V3h-1v1zm4 0h1V3h-1v1zm-2 2h1V5h-1v1z"/>
                    </svg>
                  </button>
                  <div className="border-l h-5 mx-1"></div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <span className="sr-only">Bullet List</span>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M4 7h2v2H4V7zm0 8h2v2H4v-2zm0-4h2v2H4v-2zm4-4h14v2H8V7zm0 8h14v2H8v-2zm0-4h14v2H8v-2z"/>
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <span className="sr-only">Numbered List</span>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M4 5.5h2v1H5v1h1v1H4V10h3V5.5H4zm0 7h1.5v3H4v1h3v-5H4v1zm0 5h3v-1H5.5v-1H6v-1H4v3zm4-9h14v-2H8v2zm0 8h14v-2H8v2zm0-4h14v-2H8v2z"/>
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <span className="sr-only">Link</span>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/>
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <span className="sr-only">Image</span>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
                    </svg>
                  </button>
                </div>

                {generatedContent ? (
                  <Textarea 
                    className="min-h-[300px] font-mono text-sm border-0 resize-none p-4" 
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                  />
                ) : (
                  <div className="min-h-[300px] flex items-center justify-center text-muted-foreground p-4">
                    {isGenerating ? (
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p>Generating your content...</p>
                      </div>
                    ) : (
                      <p className="text-gray-400">Generated content will appear here</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  Clear
                </Button>

                <Button 
                  onClick={handleGenerateContent} 
                  disabled={isGenerating || !title}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Article
                    </>
                  )}
                </Button>
              </div>
              
              {generatedContent && (
                <ArticleDownloader 
                  articleTitle={title} 
                  articleContent={generatedContent}
                  onUseForAutomation={handleUseForAutomation}
                />
              )}
            </div>
          </div>
        </div>

        {/* Content Tools Section */}
        <div className="mt-6">
          <h2 className="text-xl font-medium text-center text-blue-600 mb-2">Content Tools</h2>
          <p className="text-center text-sm text-gray-500 mb-4">Analyze and improve your content with these tools</p>
          
          <div className="bg-white rounded-md shadow-sm p-4 mb-6">
            <div className="flex overflow-x-auto mb-4">
              <button 
                className={`px-5 py-2 text-sm border-b-2 whitespace-nowrap ${activeTab === 'ai-detection' ? 'border-green-600 text-green-600 font-medium' : 'border-transparent text-gray-600'}`}
                onClick={() => setActiveTab('ai-detection')}
              >
                AI Detection
              </button>
              <button 
                className={`px-5 py-2 text-sm border-b-2 whitespace-nowrap ${activeTab === 'plagiarism' ? 'border-green-600 text-green-600 font-medium' : 'border-transparent text-gray-600'}`}
                onClick={() => setActiveTab('plagiarism')}
              >
                Plagiarism
              </button>
              <button 
                className={`px-5 py-2 text-sm border-b-2 whitespace-nowrap ${activeTab === 'content-spinner' ? 'border-green-600 text-green-600 font-medium' : 'border-transparent text-gray-600'}`}
                onClick={() => setActiveTab('content-spinner')}
              >
                Content Spinner
              </button>
              <button 
                className={`px-5 py-2 text-sm border-b-2 whitespace-nowrap ${activeTab === 'seo-analyzer' ? 'border-green-600 text-green-600 font-medium' : 'border-transparent text-gray-600'}`}
                onClick={() => setActiveTab('seo-analyzer')}
              >
                SEO Analyzer
              </button>
              <button 
                className={`px-5 py-2 text-sm border-b-2 whitespace-nowrap ${activeTab === 'nlp-analyzer' ? 'border-green-600 text-green-600 font-medium' : 'border-transparent text-gray-600'}`}
                onClick={() => setActiveTab('nlp-analyzer')}
              >
                NLP Analyzer
              </button>
            </div>
            
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Run AI Detection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWriterPage;
