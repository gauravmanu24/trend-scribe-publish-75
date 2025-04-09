
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { Play, Pause, Settings, RssIcon, BookOpenIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ArticleCard from "@/components/ArticleCard";
import ArticleDialog from "@/components/ArticleDialog";
import { Article } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const feeds = useAppStore((state) => state.feeds);
  const articles = useAppStore((state) => state.articles);
  const isPolling = useAppStore((state) => state.isPolling);
  const setPolling = useAppStore((state) => state.setPolling);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  const recentArticles = React.useMemo(() => {
    return [...articles]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [articles]);
  
  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    setDialogOpen(true);
  };

  const getServiceStatus = () => {
    if (!openRouterConfig.apiKey || !wordPressConfig.url) {
      return { color: "text-red-600", message: "Missing configuration" };
    }
    
    if (feeds.length === 0) {
      return { color: "text-yellow-600", message: "No feeds configured" };
    }
    
    if (!isPolling) {
      return { color: "text-yellow-600", message: "Service paused" };
    }
    
    return { color: "text-green-600", message: "Active & Running" };
  };
  
  const status = getServiceStatus();
  const totalPublished = articles.filter(a => a.status === "published").length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          variant={isPolling ? "destructive" : "default"}
          onClick={() => setPolling(!isPolling)}
          disabled={!openRouterConfig.apiKey || !wordPressConfig.url || feeds.length === 0}
        >
          {isPolling ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause Service
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Service
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Service Status</CardTitle>
            <CardDescription>Current publishing service status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${isPolling ? "bg-green-500" : "bg-yellow-500"}`}></div>
              <span className={status.color}>{status.message}</span>
            </div>
            {(!openRouterConfig.apiKey || !wordPressConfig.url) && (
              <Button
                variant="link"
                className="p-0 h-auto mt-2 text-sm"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-3 w-3 mr-1" />
                Complete setup
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">RSS Feeds</CardTitle>
            <CardDescription>Configured content sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feeds.length}</div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {feeds.filter(f => f.status === "active").length} active
              </div>
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => navigate("/feeds")}
              >
                <RssIcon className="h-3 w-3 mr-1" />
                Manage feeds
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
            <CardDescription>Total articles published</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPublished}</div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {articles.filter(a => a.status === "generated").length} ready to publish
              </div>
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => navigate("/articles")}
              >
                <BookOpenIcon className="h-3 w-3 mr-1" />
                View articles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* System setup status */}
      <Card>
        <CardHeader>
          <CardTitle>System Setup</CardTitle>
          <CardDescription>Configuration status for your publishing system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">OpenRouter AI Configuration</h3>
                <p className="text-sm text-muted-foreground">AI content generation setup</p>
              </div>
              <div className="flex items-center">
                {openRouterConfig.apiKey ? (
                  <span className="text-green-600 text-sm font-medium flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    Configured
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/settings")}
                  >
                    Configure
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">WordPress Integration</h3>
                <p className="text-sm text-muted-foreground">Content publishing destination</p>
              </div>
              <div className="flex items-center">
                {wordPressConfig.url ? (
                  <span className="text-green-600 text-sm font-medium flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    Connected
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/settings")}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">RSS Feeds</h3>
                <p className="text-sm text-muted-foreground">Content sources for trending topics</p>
              </div>
              <div className="flex items-center">
                {feeds.length > 0 ? (
                  <span className="text-green-600 text-sm font-medium flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    {feeds.length} Configured
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/feeds")}
                  >
                    Add Feeds
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent articles */}
      {recentArticles.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Articles</h2>
            <Button 
              variant="link" 
              onClick={() => navigate("/articles")}
            >
              View all
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {recentArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onView={handleViewArticle}
              />
            ))}
          </div>
        </div>
      )}
      
      <ArticleDialog 
        article={selectedArticle} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
