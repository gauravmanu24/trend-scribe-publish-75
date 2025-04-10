
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image as ImageIcon, Send } from "lucide-react";
import ImageGenerator from "@/components/ImageGenerator";

const WebStoryGeneratorPage = () => {
  const { toast } = useToast();
  const [keywords, setKeywords] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyFrames, setStoryFrames] = useState<{ image: string; text: string }[]>([]);
  const [frameCount, setFrameCount] = useState(5);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const niches = [
    "Travel", "Food", "Fashion", "Technology", "Health", "Fitness", 
    "Beauty", "Business", "Finance", "Education", "Entertainment", 
    "Sports", "Lifestyle", "DIY", "Parenting"
  ];

  const handleGenerate = async () => {
    if (!keywords || !niche) {
      toast({
        title: "Missing fields",
        description: "Please provide both keywords and niche.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a title based on keywords and niche
      const generatedTitle = `${niche} Guide: ${keywords.split(',')[0]} Edition`;
      setStoryTitle(generatedTitle);
      
      // Generate sample frames for the web story
      const sampleTexts = [
        `Discover the latest trends in ${niche.toLowerCase()} with our comprehensive guide.`,
        `${keywords.split(',')[0]} offers unique opportunities for ${niche.toLowerCase()} enthusiasts.`,
        `Here's what experts say about ${keywords.split(',')[0]} in the ${niche.toLowerCase()} industry.`,
        `Top tips to maximize your ${niche.toLowerCase()} experience with ${keywords.split(',')[0]}.`,
        `The future of ${niche.toLowerCase()} is being shaped by innovations like ${keywords.split(',')[0]}.`,
        `Why ${keywords.split(',')[0]} matters for your ${niche.toLowerCase()} journey.`,
        `How to incorporate ${keywords.split(',')[0]} into your daily ${niche.toLowerCase()} routine.`,
        `${niche} professionals recommend ${keywords.split(',')[0]} for optimal results.`
      ];
      
      // Create frames with placeholder images
      const frames = Array.from({ length: frameCount }, (_, i) => ({
        image: `https://picsum.photos/seed/${niche}${i}/800/600`,
        text: sampleTexts[i % sampleTexts.length]
      }));
      
      setStoryFrames(frames);
      
      toast({
        title: "Web Story Generated",
        description: "Your web story frames have been created. Now you can customize them.",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate web story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    const updatedFrames = [...storyFrames];
    updatedFrames[currentFrameIndex] = {
      ...updatedFrames[currentFrameIndex],
      image: imageUrl
    };
    setStoryFrames(updatedFrames);
    setShowImageGenerator(false);
    
    toast({
      title: "Image updated",
      description: `Image for frame ${currentFrameIndex + 1} has been updated.`,
    });
  };

  const handleTextChange = (index: number, text: string) => {
    const updatedFrames = [...storyFrames];
    updatedFrames[index] = {
      ...updatedFrames[index],
      text: text
    };
    setStoryFrames(updatedFrames);
  };

  const handlePublish = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would make an API call to WordPress to publish the story
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Web Story Published",
        description: "Your web story has been published to WordPress successfully.",
      });
      
      // Reset the form for a new story
      setKeywords("");
      setNiche("");
      setStoryTitle("");
      setStoryFrames([]);
    } catch (error) {
      console.error("Publishing error:", error);
      toast({
        title: "Publishing failed",
        description: "Failed to publish web story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Web Story Generator</h1>
      <p className="text-muted-foreground">
        Create Google Web Stories for your WordPress site with AI assistance.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Story Details</CardTitle>
              <CardDescription>
                Enter details to generate your web story
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input 
                  id="keywords"
                  placeholder="Enter keywords (comma separated)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="niche">Niche</Label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {niches.map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frameCount">Number of Frames</Label>
                <Select 
                  value={frameCount.toString()} 
                  onValueChange={(value) => setFrameCount(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of frames" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Frames</SelectItem>
                    <SelectItem value="5">5 Frames</SelectItem>
                    <SelectItem value="7">7 Frames</SelectItem>
                    <SelectItem value="10">10 Frames</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full btn-gradient-primary mt-4"
                onClick={handleGenerate}
                disabled={loading || !keywords || !niche}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Web Story"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          {storyFrames.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>{storyTitle || "Your Web Story"}</CardTitle>
                <CardDescription>
                  Customize the content of your story frames
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input 
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  className="text-xl font-bold"
                  placeholder="Story Title"
                />
                
                <div className="space-y-8">
                  {storyFrames.map((frame, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Frame {index + 1}</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setCurrentFrameIndex(index);
                            setShowImageGenerator(true);
                          }}
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Change Image
                        </Button>
                      </div>
                      
                      <div className="aspect-[9/16] relative rounded-md overflow-hidden bg-muted">
                        <img 
                          src={frame.image} 
                          alt={`Frame ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <Textarea 
                        value={frame.text}
                        onChange={(e) => handleTextChange(index, e.target.value)}
                        placeholder="Frame text"
                        className="resize-none"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handlePublish}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Publish to WordPress
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-muted">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Story Generated Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Enter your keywords and niche, then click "Generate Web Story" to create your Google Web Story.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {showImageGenerator && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Select Image for Frame {currentFrameIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageGenerator onImageSelect={handleImageSelect} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebStoryGeneratorPage;
