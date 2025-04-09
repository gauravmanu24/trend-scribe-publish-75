
import React from "react";
import { useAppStore } from "@/lib/store";
import ArticleCard from "@/components/ArticleCard";
import ArticleDialog from "@/components/ArticleDialog";
import { Article } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ArticlesPage = () => {
  const articles = useAppStore((state) => state.articles);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    setDialogOpen(true);
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
            <div className="grid grid-cols-1 gap-4">
              {filteredArticles.length > 0 ? (
                filteredArticles
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      onView={handleViewArticle} 
                    />
                  ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No articles match your search.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="published" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {publishedArticles.length > 0 ? (
                publishedArticles
                  .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
                  .map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      onView={handleViewArticle} 
                    />
                  ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No published articles found.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="drafts" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {draftArticles.length > 0 ? (
                draftArticles
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      onView={handleViewArticle} 
                    />
                  ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No draft articles found.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="failed" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {failedArticles.length > 0 ? (
                failedArticles
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      onView={handleViewArticle} 
                    />
                  ))
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
