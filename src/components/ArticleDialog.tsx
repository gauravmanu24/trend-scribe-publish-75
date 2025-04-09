
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Article } from "@/types";
import { format } from "date-fns";
import { ExternalLink, Send } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

interface ArticleDialogProps {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ArticleDialog: React.FC<ArticleDialogProps> = ({ 
  article, 
  open, 
  onOpenChange 
}) => {
  const updateArticle = useAppStore((state) => state.updateArticle);
  const { toast } = useToast();
  const [publishing, setPublishing] = React.useState(false);
  
  if (!article) return null;
  
  const handlePublish = async () => {
    if (!article) return;
    
    setPublishing(true);
    
    try {
      // Simulate WordPress publishing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateArticle(article.id, { 
        status: "published", 
        publishedAt: new Date().toISOString() 
      });
      
      toast({
        title: "Article published",
        description: "The article was successfully published to WordPress.",
      });
    } catch (error) {
      toast({
        title: "Publishing failed",
        description: "Failed to publish article to WordPress.",
        variant: "destructive",
      });
      updateArticle(article.id, { status: "failed" });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{article.title}</DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {format(new Date(article.createdAt), "MMMM d, yyyy")}
              </span>
              {article.publishedAt && (
                <span className="text-sm text-green-600">
                  • Published {format(new Date(article.publishedAt), "MMMM d, yyyy")}
                </span>
              )}
            </div>
            {article.sourceTitle && (
              <div className="text-sm flex items-center">
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
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow my-6 pr-4 max-h-[50vh]">
          <div className="prose prose-sm max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          
          {article.status === "generated" && (
            <Button 
              variant="default"
              className="bg-news-700 hover:bg-news-800 text-white"
              onClick={handlePublish}
              disabled={publishing}
            >
              <Send className="h-4 w-4 mr-2" />
              Publish to WordPress
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDialog;
