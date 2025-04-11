
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RssIcon } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-6 md:px-10 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with these simple steps
          </p>
        </div>

        <Tabs defaultValue="feeds" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feeds">1. Add Feeds</TabsTrigger>
            <TabsTrigger value="generate">2. Generate Content</TabsTrigger>
            <TabsTrigger value="publish">3. Publish</TabsTrigger>
          </TabsList>
          <TabsContent value="feeds" className="p-6 bg-card rounded-lg mt-4 shadow-sm border">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Connect Your RSS Feeds</h3>
              <p>Add RSS feeds from your favorite sources, competitors, or industry news sites. TrendScribe will monitor these feeds for new content and trending topics.</p>
              <div className="flex justify-center py-4">
                <div className="relative w-full max-w-md rounded-lg overflow-hidden border">
                  <div className="bg-muted/30 p-4 space-y-4">
                    <div className="h-8 bg-muted rounded-md w-3/4"></div>
                    <div className="flex items-center space-x-2">
                      <RssIcon className="h-5 w-5 text-primary" />
                      <div className="h-5 bg-muted rounded-md w-full"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RssIcon className="h-5 w-5 text-primary" />
                      <div className="h-5 bg-muted rounded-md w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="generate" className="p-6 bg-card rounded-lg mt-4 shadow-sm border">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">AI Content Generation</h3>
              <p>Select your preferred AI model, tone, and length. TrendScribe will transform RSS content into unique, plagiarism-free articles optimized for SEO and readability.</p>
              <div className="flex justify-center py-4">
                <div className="relative w-full max-w-md rounded-lg overflow-hidden border">
                  <div className="bg-muted/30 p-4 space-y-4">
                    <div className="h-8 bg-muted rounded-md w-2/3"></div>
                    <div className="h-4 bg-muted rounded-full w-full"></div>
                    <div className="h-4 bg-muted rounded-full w-5/6"></div>
                    <div className="h-4 bg-muted rounded-full w-full"></div>
                    <div className="h-4 bg-muted rounded-full w-4/5"></div>
                    <div className="h-8 bg-primary/80 rounded-md w-32 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="publish" className="p-6 bg-card rounded-lg mt-4 shadow-sm border">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Publish to WordPress</h3>
              <p>Review your AI-generated content and publish directly to WordPress with a single click. Schedule posts for optimal times or publish immediately.</p>
              <div className="flex justify-center py-4">
                <div className="relative w-full max-w-md rounded-lg overflow-hidden border">
                  <div className="bg-muted/30 p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-muted rounded-md w-1/3"></div>
                      <div className="h-8 bg-green-500/80 rounded-md w-24"></div>
                    </div>
                    <div className="h-4 bg-muted rounded-full w-full"></div>
                    <div className="h-4 bg-muted rounded-full w-5/6"></div>
                    <div className="h-4 bg-muted rounded-full w-full"></div>
                    <div className="h-4 bg-muted rounded-full w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default HowItWorksSection;
