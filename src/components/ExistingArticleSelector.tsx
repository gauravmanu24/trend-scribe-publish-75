
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Article } from "@/types";
import { useAppStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";

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

  const handleArticleSelect = (articleId: string) => {
    setSelectedArticleId(articleId);
  };

  const handleUseArticle = () => {
    if (!selectedArticleId) return;
    
    setLoading(true);
    const selectedArticle = articles.find(article => article.id === selectedArticleId);
    
    if (selectedArticle) {
      onArticleSelect(selectedArticle);
    }
    
    setLoading(false);
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-4 p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
      <h3 className="text-lg font-medium text-blue-700">Generate from Existing Article</h3>
      
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
    </div>
  );
};

export default ExistingArticleSelector;
