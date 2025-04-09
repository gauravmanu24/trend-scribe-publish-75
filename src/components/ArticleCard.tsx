
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Article } from "@/types";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { ExternalLink, Trash2 } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  onView: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onView }) => {
  const removeArticle = useAppStore((state) => state.removeArticle);
  
  const getStatusBadge = (status: Article["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "generated":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Generated</Badge>;
      case "published":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Published</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <CardTitle 
              className="text-lg font-medium cursor-pointer hover:text-primary truncate"
              onClick={() => onView(article)}
            >
              {article.title}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <div className="text-sm text-muted-foreground">
                {format(new Date(article.createdAt), "MMM d, yyyy")}
              </div>
              {getStatusBadge(article.status)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="text-sm line-clamp-3">
          {article.content.substring(0, 150)}...
        </div>
        
        {article.sourceTitle && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center">
            <span>Source: {article.sourceTitle}</span>
            {article.sourceLink && (
              <a 
                href={article.sourceLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 inline-flex items-center text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="flex justify-between items-center w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removeArticle(article.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onView(article)}
            >
              View
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
