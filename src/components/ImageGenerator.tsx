
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, ImagePlus, Loader2, X } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface ImageGeneratorProps {
  onImageSelect: (imageUrl: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageSelect }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [imagePrompt, setImagePrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [imageSize, setImageSize] = useState<string>("512x512");
  const [imageProvider, setImageProvider] = useState<string>("openai");
  const openRouterConfig = useAppStore(state => state.openRouterConfig);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for the image you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // For demo purposes, we'll just simulate an API call
      // In a real application, you would make an actual API call to the selected provider
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Use a placeholder image URL for demonstration
      const placeholderImages = [
        "https://picsum.photos/512/512?random=1",
        "https://picsum.photos/512/512?random=2",
        "https://picsum.photos/512/512?random=3",
        "https://picsum.photos/512/512?random=4",
      ];
      
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      setGeneratedImage(randomImage);
      
      toast({
        title: "Image generated",
        description: "Your image has been successfully generated.",
      });
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    toast({
      title: "Image selected",
      description: "Image has been added to your article.",
    });
  };

  const handleClearImage = () => {
    if (activeTab === "upload") {
      setUploadedImage(null);
    } else {
      setGeneratedImage(null);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Image Manager</CardTitle>
        <CardDescription>
          Upload or generate images for your article
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="generate">Generate with AI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="image-upload">Upload an image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP.
                </p>
              </div>
              
              {uploadedImage && (
                <div className="relative">
                  <div className="aspect-video relative rounded-md overflow-hidden">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded image" 
                      className="object-cover w-full h-full"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={handleClearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    className="mt-2 w-full"
                    onClick={() => handleImageSelect(uploadedImage)}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Use this image
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="image-provider">AI Image Provider</Label>
                <Select 
                  value={imageProvider}
                  onValueChange={setImageProvider}
                >
                  <SelectTrigger id="image-provider">
                    <SelectValue placeholder="Select image provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI DALL-E 3</SelectItem>
                    <SelectItem value="stable-diffusion">Stable Diffusion XL</SelectItem>
                    <SelectItem value="midjourney">Midjourney</SelectItem>
                  </SelectContent>
                </Select>
                {!openRouterConfig.apiKey && imageProvider === "openai" && (
                  <p className="text-xs text-amber-500">
                    Please configure your OpenAI API key in settings.
                  </p>
                )}
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="image-size">Image Size</Label>
                <Select 
                  value={imageSize}
                  onValueChange={setImageSize}
                >
                  <SelectTrigger id="image-size">
                    <SelectValue placeholder="Select image size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256x256">Small (256x256)</SelectItem>
                    <SelectItem value="512x512">Medium (512x512)</SelectItem>
                    <SelectItem value="1024x1024">Large (1024x1024)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="image-prompt">Image Description</Label>
                <Textarea
                  id="image-prompt"
                  placeholder="Describe the image you want to generate in detail..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleImageGeneration}
                disabled={isGenerating || !imagePrompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
              
              {generatedImage && (
                <div className="relative">
                  <div className="aspect-video relative rounded-md overflow-hidden">
                    <img 
                      src={generatedImage} 
                      alt="Generated image" 
                      className="object-cover w-full h-full"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={handleClearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    className="mt-2 w-full"
                    onClick={() => handleImageSelect(generatedImage)}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Use this image
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImageGenerator;
