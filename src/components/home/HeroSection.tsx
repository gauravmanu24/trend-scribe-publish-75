
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-4">
                TrendScribe
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                AI-powered content generation from RSS feeds to WordPress in minutes
              </p>
            </div>
            <div className="space-y-4 max-w-xl">
              <p className="text-lg text-foreground/90">
                Automatically transform RSS feeds into unique, SEO-optimized articles with our 
                advanced AI technology. Save time, increase publishing frequency, and grow your website.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Button size="lg" asChild>
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link to="/auth">Get Started</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/features">Learn More</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md p-1 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-2xl shadow-xl">
              <div className="bg-card rounded-xl p-6 shadow-inner">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded-full w-3/4"></div>
                    <div className="h-4 bg-muted rounded-full w-full"></div>
                    <div className="h-4 bg-muted rounded-full w-5/6"></div>
                    <div className="h-4 bg-muted rounded-full w-4/5"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="bg-primary/80 text-primary-foreground text-sm py-1 px-3 rounded-md">Publishing</div>
                    <div className="bg-secondary/30 h-8 w-8 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-secondary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
