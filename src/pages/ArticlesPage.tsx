
import React from "react";
import { useAppStore } from "@/lib/store";
import ArticleCard from "@/components/ArticleCard";
import ArticleDialog from "@/components/ArticleDialog";
import { Article } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ArticlesPage = () => {
  const articles = useAppStore((state) => state.articles);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const updateArticle = useAppStore((state) => state.updateArticle);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [publishingArticleId, setPublishingArticleId] = React.useState<string | null>(null);
  const { toast } = useToast();
  
  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    setDialogOpen(true);
  };
  
  // Function to publish article to WordPress
  const handlePublishToWordPress = async (article: Article) => {
    if (!article) return;
    
    setPublishingArticleId(article.id);
    
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
    } finally {
      setPublishingArticleId(null);
    }
  };
  
  const filteredArticles = React.useMemo(() => {
    return articles.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);
  
  const publishedArticles = filteredArticles.filter((a) => a.status === "published");
  const draftArticles = filteredArticles.filter((a) => a.status === "draft" || a.status === "generated");
  const failedArticles = filteredArticles.filter((a) => a.status === "failed");
  
  // Render article item with publish button
  const renderArticleItem = (article: Article) => (
    <div key={article.id} className="flex flex-col">
      <ArticleCard 
        key={article.id} 
        article={article} 
        onView={handleViewArticle} 
      />
      {(article.status === "generated" || article.status === "draft") && (
        <div className="mt-2 flex justify-end">
          <Button 
            variant="outline" 
            className="bg-news-700 hover:bg-news-800 text-white"
            size="sm"
            onClick={() => handlePublishToWordPress(article)}
            disabled={publishingArticleId === article.id || !wordPressConfig.isConnected}
          >
            {publishingArticleId === article.id ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to WordPress
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Articles</h1>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {!wordPressConfig.isConnected && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-800 text-sm">
          WordPress is not configured. Please visit Settings to connect your WordPress site.
        </div>
      )}
      
      {articles.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="text-xl font-medium text-gray-500">No articles yet</h2>
          <p className="text-gray-400 mt-2">
            Articles will appear here once they are generated from your RSS feeds.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              All ({filteredArticles.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Published ({publishedArticles.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts ({draftArticles.length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed ({failedArticles.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {filteredArticles.length > 0 ? (
                filteredArticles
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(renderArticleItem)
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No articles match your search.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="published" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {publishedArticles.length > 0 ? (
                publishedArticles
                  .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
                  .map(renderArticleItem)
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No published articles found.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="drafts" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {draftArticles.length > 0 ? (
                draftArticles
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(renderArticleItem)
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No draft articles found.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="failed" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {failedArticles.length > 0 ? (
                failedArticles
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(renderArticleItem)
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No failed articles found.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <ArticleDialog 
        article={selectedArticle} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default ArticlesPage;
