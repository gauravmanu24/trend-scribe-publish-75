
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AboutUsPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About TrendScribe</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            At TrendScribe, we're on a mission to revolutionize content creation for website owners, bloggers, and digital marketers. 
            We believe that high-quality content should be accessible to everyone, regardless of writing experience or time constraints.
          </p>
          <p>
            Our AI-powered platform bridges the gap between content discovery and publication by transforming RSS feeds into unique, 
            valuable articles that engage readers and perform well in search engines.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Our Story</h2>
          <p className="mb-4">
            TrendScribe was founded in 2024 by a team of content creators and AI specialists who understood the challenges of 
            consistent content production. After years of struggling with writer's block, tight deadlines, and the constant 
            demand for fresh content, we decided to build a solution.
          </p>
          <p>
            By combining the latest advances in artificial intelligence with practical content workflow tools, we created a 
            platform that not only generates high-quality content but also streamlines the entire publication process.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Our Technology</h2>
          <p className="mb-4">
            TrendScribe leverages state-of-the-art natural language processing and generation technologies through the OpenRouter 
            platform. This allows us to provide access to the most advanced AI models like Claude, GPT, and others.
          </p>
          <p>
            Our proprietary content transformation system ensures that every article is unique, readable, and optimized for both 
            human readers and search engines. We continually refine our algorithms to improve quality and adapt to changing 
            content standards.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Our Values</h2>
          <ul className="space-y-3 list-disc pl-6">
            <li><strong>Quality:</strong> We prioritize content quality above all else, ensuring that every article meets high standards of readability and value.</li>
            <li><strong>Innovation:</strong> We continuously improve our technology to deliver better results for our users.</li>
            <li><strong>Accessibility:</strong> We make professional content creation accessible to everyone, regardless of budget or technical expertise.</li>
            <li><strong>Transparency:</strong> We're honest about what AI can and cannot do, and we're committed to ethical AI use.</li>
            <li><strong>User Success:</strong> Our ultimate goal is to help our users grow their online presence through quality content.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUsPage;
