
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Rss, Newspaper, Bot, Globe, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FeaturesPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Rss className="h-10 w-10 text-primary" />,
      title: "RSS Feed Management",
      description: "Add and manage RSS feeds from your favorite sources. Organize them by category and monitor their activity.",
      benefits: [
        "Track multiple sources in one place",
        "Filter content by category or keyword",
        "Automatic feed health monitoring",
        "Organize sources by importance or topic"
      ]
    },
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: "AI Content Generation",
      description: "Generate high-quality articles and content using state-of-the-art AI models from multiple providers.",
      benefits: [
        "Choose from 40+ free and premium AI models",
        "Customize tone, style, and length",
        "Multiple output formats (HTML, Markdown, Plain Text)",
        "Write in multiple languages with language-aware AI"
      ]
    },
    {
      icon: <Newspaper className="h-10 w-10 text-primary" />,
      title: "Content Rewriting",
      description: "Repurpose and rewrite RSS content into original articles ready for publication on your own platforms.",
      benefits: [
        "Ethical content spinning with proper attribution",
        "Custom templates for consistent style",
        "Multilingual support for global content",
        "SEO-optimized output with keyword targeting"
      ]
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "WordPress Integration",
      description: "Publish content directly to your WordPress site with full formatting and media support.",
      benefits: [
        "One-click publishing to WordPress",
        "Schedule posts for optimal timing",
        "Custom categories and tags support",
        "Featured image generation and insertion"
      ]
    },
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "API Integration",
      description: "Connect with multiple AI service providers to leverage the best tools for your specific needs.",
      benefits: [
        "OpenRouter for access to multiple models",
        "Direct OpenAI integration for GPT models",
        "Anthropic Claude for factual accuracy",
        "Groq for ultra-fast content generation",
        "DeepInfra for specialized models"
      ]
    }
  ];

  const apiServices = [
    {
      name: "OpenRouter",
      description: "A unified API gateway to access dozens of language models from multiple providers.",
      models: [
        "Claude 3.5 Sonnet",
        "Claude 3 Opus/Sonnet/Haiku",
        "GPT-4o",
        "LLaMA-3 70B",
        "40+ free models"
      ]
    },
    {
      name: "OpenAI",
      description: "Direct access to OpenAI's powerful GPT models and DALL·E image generation.",
      models: [
        "GPT-4o",
        "GPT-4 Turbo",
        "GPT-3.5 Turbo"
      ]
    },
    {
      name: "Anthropic",
      description: "Claude models known for their helpful, harmless, and honest AI assistance.",
      models: [
        "Claude 3.5 Sonnet",
        "Claude 3 Opus",
        "Claude 3 Sonnet",
        "Claude 3 Haiku"
      ]
    },
    {
      name: "Groq",
      description: "Ultra-fast inference platform for real-time content generation and processing.",
      models: [
        "LLaMA-3 8B/70B",
        "Mixtral 8x7B",
        "Gemma 7B"
      ]
    },
    {
      name: "DeepInfra",
      description: "Deploy and serve open-source AI models at scale with optimized infrastructure.",
      models: [
        "LLaMA-3 70B/8B",
        "Mistral 7B"
      ]
    },
    {
      name: "Cohere",
      description: "Specialized models for natural language understanding and generation.",
      models: [
        "Command R+",
        "Command R",
        "Command Light"
      ]
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Feature-Rich Content Automation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          TrendScribe combines powerful AI content generation with seamless workflow automation to revolutionize your content strategy.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {features.map((feature, index) => (
          <Card key={index} className="trendy-card overflow-hidden">
            <div className="p-2 bg-gradient-to-r from-primary/20 to-secondary/20">
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </div>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Key Benefits:</h4>
              <ul className="space-y-1">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <ArrowRight className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Supported AI Model Providers
        </h2>
        
        <Tabs defaultValue="openrouter" className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full mb-8">
            {apiServices.map((service) => (
              <TabsTrigger key={service.name} value={service.name.toLowerCase()}>
                {service.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {apiServices.map((service) => (
            <TabsContent key={service.name} value={service.name.toLowerCase()} className="p-6 bg-muted/50 rounded-xl">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 space-y-4">
                  <h3 className="text-2xl font-bold">{service.name}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                  <Button 
                    onClick={() => navigate("/settings")}
                    className="btn-gradient-primary"
                  >
                    Configure {service.name}
                  </Button>
                </div>
                
                <div className="md:w-1/2 bg-background p-6 rounded-lg">
                  <h4 className="font-medium mb-4">Available Models:</h4>
                  <ul className="space-y-2">
                    {service.models.map((model, i) => (
                      <li key={i} className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                        <span>{model}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Ready to Upgrade Your Content Strategy?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join TrendScribe today and harness the power of AI to create engaging, high-quality content at scale.
        </p>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => navigate("/signup")}
            size="lg"
            className="btn-gradient-primary"
          >
            Sign Up Now
          </Button>
          <Button 
            onClick={() => navigate("/about")}
            variant="outline" 
            size="lg"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
