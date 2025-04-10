
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import ArticleCard from "@/components/ArticleCard";
import ArticleDialog from "@/components/ArticleDialog";
import { Article } from "@/types";
import { Search, PlusCircle, Settings, ArrowUpDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import AutomatedPublishing from "@/components/AutomatedPublishing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a custom icon for automation
const AutomationIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
};

const ArticlesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const articles = useAppStore((state) => state.articles);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "title">("newest");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"articles" | "automation">("articles");

  // Check if we should show the automation tab by default
  React.useEffect(() => {
    if (location.hash === "#automation") {
      setActiveTab("automation");
    }
  }, [location]);

  const filteredArticles = articles.filter((article) => {
    const matchesQuery =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;
    
    return matchesQuery && matchesStatus;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      // title
      return a.title.localeCompare(b.title);
    }
  });

  const handleViewArticle = (article: Article) => {
    setViewingArticle(article);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto space-y-4 py-6">
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "articles" | "automation")}
        className="space-y-4"
      >
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-2">Articles</h1>
          <TabsList>
            <TabsTrigger value="articles">
              <PlusCircle className="h-4 w-4 mr-2" />
              Manual Articles
            </TabsTrigger>
            <TabsTrigger value="automation">
              <AutomationIcon className="h-4 w-4 mr-2" />
              Automated Publishing
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="articles" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortOrder} onValueChange={(value: "newest" | "oldest" | "title") => setSortOrder(value)}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="default" 
                className="whitespace-nowrap"
                onClick={() => navigate("/ai-writer")}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>
          
          {sortedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedArticles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onView={handleViewArticle} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">No articles found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start by creating your first article"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button 
                    variant="default" 
                    onClick={() => navigate("/ai-writer")}
                    className="mt-4"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Article
                  </Button>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="automation">
          <AutomatedPublishing />
        </TabsContent>
      </Tabs>
      
      <ArticleDialog 
        article={viewingArticle} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </div>
  );
};

export default ArticlesPage;
