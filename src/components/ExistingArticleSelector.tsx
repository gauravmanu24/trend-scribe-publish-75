import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Article } from "@/types";
import { useAppStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, ExternalLink, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface ExistingArticleProps {
  onArticleSelect: (article: Article) => void;
  isVisible: boolean;
}

const ExistingArticleSelector: React.FC<ExistingArticleProps> = ({ 
  onArticleSelect, 
  isVisible 
}) => {
  const articles = useAppStore((state) => state.articles);
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("internal");
  const [externalArticle, setExternalArticle] = useState("");
  const [externalArticleTitle, setExternalArticleTitle] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const handleArticleSelect = (articleId: string) => {
    setSelectedArticleId(articleId);
  };

  const handleUseArticle = () => {
    if (!selectedArticleId) return;
    
    setLoading(true);
    const selectedArticle = articles.find(article => article.id === selectedArticleId);
    
    if (selectedArticle) {
      // Include custom prompt if provided
      const articleWithPrompt = {
        ...selectedArticle,
        customPrompt: customPrompt || undefined
      };
      onArticleSelect(articleWithPrompt);
    }
    
    setLoading(false);
  };

  const handleUseExternalArticle = () => {
    if (!externalArticle) return;

    setLoading(true);
    
    const externalArticleObj: Article = {
      id: `ext-${Date.now()}`,
      title: externalArticleTitle || "External Article",
      content: externalArticle,
      sourceTitle: "External Source",
      sourceLink: null,
      status: "external" as Article["status"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: null,
      category: "general",
      wordpressPostId: null,
      wordpressPostUrl: null,
      customPrompt: customPrompt || undefined
    };
    
    onArticleSelect(externalArticleObj);
    setLoading(false);
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-4 p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
      <h3 className="text-lg font-medium text-blue-700">Generate from Existing Article</h3>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="internal">Your Articles</TabsTrigger>
          <TabsTrigger value="external">External Article</TabsTrigger>
        </TabsList>
        
        <TabsContent value="internal" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="article-select" className="text-gray-700">Select an Article</Label>
            <Select 
              value={selectedArticleId} 
              onValueChange={handleArticleSelect}
            >
              <SelectTrigger id="article-select" className="border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Choose an article" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-60">
                  {articles.length > 0 ? (
                    articles.map((article) => (
                      <SelectItem key={article.id} value={article.id}>
                        {article.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No articles available
                    </SelectItem>
                  )}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-prompt" className="text-gray-700">Custom Prompt (Optional)</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Add specific instructions for better results (e.g., 'Rewrite in a professional tone' or 'Focus on technical aspects')"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[80px] border-gray-300 focus:border-blue-500"
            />
          </div>
          
          <Button 
            onClick={handleUseArticle}
            disabled={!selectedArticleId || loading}
            className="w-full btn-blue"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading article...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Use this article
              </>
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="external" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="external-title" className="text-gray-700">Article Title</Label>
            <Input
              id="external-title"
              placeholder="Enter article title"
              value={externalArticleTitle}
              onChange={(e) => setExternalArticleTitle(e.target.value)}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="external-article" className="text-gray-700">Paste Article Content</Label>
            <Textarea
              id="external-article"
              placeholder="Paste the article content here..."
              value={externalArticle}
              onChange={(e) => setExternalArticle(e.target.value)}
              className="min-h-[120px] border-gray-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="external-prompt" className="text-gray-700">Custom Prompt (Optional)</Label>
            <Textarea
              id="external-prompt"
              placeholder="Add specific instructions for better results (e.g., 'Rewrite in a professional tone' or 'Focus on technical aspects')"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[80px] border-gray-300 focus:border-blue-500"
            />
          </div>
          
          <Button 
            onClick={handleUseExternalArticle}
            disabled={!externalArticle || loading}
            className="w-full btn-blue"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing article...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Use external article
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExistingArticleSelector;
