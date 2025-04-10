
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RssIcon, Newspaper, PencilLine, RotateCcw, BarChart3, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <Header />

      {/* Hero Section */}
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

      {/* Features Grid Section */}
      <section className="py-20 px-6 md:px-10 bg-accent/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to automate your content workflow and scale your website
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<RssIcon className="h-8 w-8 text-primary" />}
              title="RSS Feed Integration"
              description="Connect unlimited RSS feeds from any source to monitor for fresh content ideas and trending topics."
            />
            <FeatureCard 
              icon={<PencilLine className="h-8 w-8 text-primary" />}
              title="AI Content Writer"
              description="Generate unique, SEO-optimized content with customizable tone, length, and formatting options."
            />
            <FeatureCard 
              icon={<Newspaper className="h-8 w-8 text-primary" />}
              title="WordPress Integration"
              description="Publish articles directly to your WordPress site with automated scheduling and categorization."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              title="Content Analytics"
              description="Track article performance, monitor trends, and optimize your content strategy."
            />
            <FeatureCard 
              icon={<RotateCcw className="h-8 w-8 text-primary" />}
              title="Automated Workflows"
              description="Set schedules for content generation and publishing to maintain consistent posting."
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="AI Model Selection"
              description="Choose from various AI models to optimize for quality, speed, or cost based on your needs."
            />
          </div>
        </div>
      </section>

      {/* How To Use Section */}
      <section className="py-20 px-6 md:px-10">
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

      {/* FAQs Section */}
      <section className="py-20 px-6 md:px-10 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about TrendScribe
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is the content unique and SEO-friendly?</AccordionTrigger>
              <AccordionContent>
                Yes! All content generated by TrendScribe is completely unique and optimized for search engines. 
                Our AI models are trained to create original content while maintaining readability and SEO best practices.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does the WordPress integration work?</AccordionTrigger>
              <AccordionContent>
                TrendScribe connects directly to your WordPress site using your credentials. You can publish 
                posts as drafts or schedule them automatically. The integration supports featured images, 
                categories, tags, and custom post types.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Which AI models are available?</AccordionTrigger>
              <AccordionContent>
                TrendScribe supports multiple AI models through OpenRouter, including Claude, GPT models, 
                and others. You can select the model that best fits your needs based on quality, speed, and cost.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How many RSS feeds can I add?</AccordionTrigger>
              <AccordionContent>
                You can add unlimited RSS feeds to your TrendScribe account. This allows you to monitor 
                multiple sources for content ideas across different niches and industries.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Can I customize the tone and style of generated content?</AccordionTrigger>
              <AccordionContent>
                Absolutely! TrendScribe offers extensive customization options including tone (professional, 
                conversational, enthusiastic, etc.), content length, output format, and more.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-10 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Automate Your Content Creation?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start publishing high-quality, SEO-optimized content consistently with minimal effort.
          </p>
          {user ? (
            <Button size="lg" className="px-8" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" className="px-8" asChild>
              <Link to="/auth">Get Started Now</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card className="border bg-card h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export default Index;
