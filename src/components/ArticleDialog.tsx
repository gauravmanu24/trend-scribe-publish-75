
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
import { ExternalLink, Send, Loader2 } from "lucide-react";
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
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const { toast } = useToast();
  const [publishing, setPublishing] = React.useState(false);
  
  if (!article) return null;
  
  const handlePublish = async () => {
    if (!article) return;
    
    setPublishing(true);
    
    try {
      // Check if WordPress is configured
      if (!wordPressConfig.url || !wordPressConfig.username || !wordPressConfig.password) {
        throw new Error("WordPress configuration is incomplete. Please check settings.");
      }

      // Make the actual WordPress API call
      const response = await fetch(`${wordPressConfig.url}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${wordPressConfig.username}:${wordPressConfig.password}`),
        },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          status: 'publish',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `WordPress error: ${response.statusText}`);
      }
      
      const publishedPost = await response.json();
      
      updateArticle(article.id, { 
        status: "published", 
        publishedAt: new Date().toISOString(),
        wordpressPostId: publishedPost.id,
        wordpressPostUrl: publishedPost.link
      });
      
      toast({
        title: "Article published",
        description: "The article was successfully published to WordPress.",
      });
    } catch (error) {
      console.error("Publishing error:", error);
      toast({
        title: "Publishing failed",
        description: error instanceof Error ? error.message : "Failed to publish article to WordPress.",
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
          
          {(article.status === "generated" || article.status === "draft") && (
            <Button 
              variant="default"
              className="bg-news-700 hover:bg-news-800 text-white"
              onClick={handlePublish}
              disabled={publishing || !wordPressConfig.isConnected}
            >
              {publishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Publish to WordPress
                </>
              )}
            </Button>
          )}
          
          {article.wordpressPostUrl && (
            <a 
              href={article.wordpressPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Published Post
              </Button>
            </a>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDialog;
