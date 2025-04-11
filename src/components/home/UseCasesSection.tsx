
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code, CloudLightning } from "lucide-react";

const UseCasesSection = () => {
  return (
    <section className="py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect For</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            TrendScribe serves a wide range of content creators and publishers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border bg-card">
            <CardHeader className="pb-2">
              <BookOpen className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Blog Owners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Keep your blog consistently updated with fresh, relevant content that engages your readers and improves SEO rankings.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border bg-card">
            <CardHeader className="pb-2">
              <Code className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Content Marketers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Scale your content marketing efforts without hiring more writers. Create more content in less time.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border bg-card">
            <CardHeader className="pb-2">
              <CloudLightning className="h-8 w-8 text-primary mb-4" />
              <CardTitle>News Websites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Transform trending news into unique perspectives and analysis pieces that differentiate your site.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
