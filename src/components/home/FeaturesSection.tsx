
import React from "react";
import FeatureCard from "./FeatureCard";
import { RssIcon, PencilLine, Newspaper, BarChart3, RotateCcw, Zap, 
         Award, Globe, MessageSquare } from "lucide-react";

const FeaturesSection = () => {
  return (
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
          <FeatureCard 
            icon={<Award className="h-8 w-8 text-primary" />}
            title="SEO Optimization"
            description="Built-in SEO tools to ensure your content ranks well in search engines with proper keyword usage."
          />
          <FeatureCard 
            icon={<Globe className="h-8 w-8 text-primary" />}
            title="Multi-language Support"
            description="Create content in multiple languages to expand your global reach and audience engagement."
          />
          <FeatureCard 
            icon={<MessageSquare className="h-8 w-8 text-primary" />}
            title="Article Commenting"
            description="Enable commenting features to increase reader engagement and build a community around your content."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
