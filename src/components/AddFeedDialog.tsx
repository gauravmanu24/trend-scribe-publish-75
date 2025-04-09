
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Feed } from "@/types";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedValidator from "./FeedValidator";
import GoogleTrendsGenerator from "./GoogleTrendsGenerator";

const feedSchema = z.object({
  name: z.string().min(1, "Feed name is required"),
  url: z.string().url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
});

type FeedFormValues = z.infer<typeof feedSchema>;

interface AddFeedDialogProps {
  editFeed?: Feed;
  onComplete?: () => void;
}

const AddFeedDialog: React.FC<AddFeedDialogProps> = ({ editFeed, onComplete }) => {
  const { toast } = useToast();
  const addFeed = useAppStore(state => state.addFeed);
  const updateFeed = useAppStore(state => state.updateFeed);
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "validator" | "trends">("manual");

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FeedFormValues>({
    resolver: zodResolver(feedSchema),
    defaultValues: editFeed 
      ? { name: editFeed.name, url: editFeed.url, category: editFeed.category } 
      : { name: "", url: "", category: "" }
  });

  React.useEffect(() => {
    if (editFeed && !open) {
      setOpen(true);
    }
  }, [editFeed, open]);

  const onSubmit = (data: FeedFormValues) => {
    try {
      if (editFeed) {
        updateFeed(editFeed.id, data);
        toast({
          title: "Feed updated",
          description: `Feed "${data.name}" has been updated.`,
        });
      } else {
        // Ensure all required fields are passed to addFeed
        addFeed({
          name: data.name,
          url: data.url,
          category: data.category,
        });
        toast({
          title: "Feed added",
          description: `Feed "${data.name}" has been added.`,
        });
      }
      reset({ name: "", url: "", category: "" });
      setOpen(false);
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editFeed ? "update" : "add"} feed.`,
        variant: "destructive",
      });
    }
  };

  const handleValidFeed = (url: string) => {
    setValue("url", url);
  };

  const handleUrlGenerated = (url: string) => {
    setValue("url", url);
    setValue("name", "Google Trends " + (watch("category") || "Daily"));
    setValue("category", "Trends");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Feed</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{editFeed ? "Edit Feed" : "Add New Feed"}</DialogTitle>
            <DialogDescription>
              {editFeed 
                ? "Update the feed information below." 
                : "Add a new RSS feed to monitor trends and generate content."}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="validator">Validate Feed</TabsTrigger>
              <TabsTrigger value="trends">Google Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    placeholder="Google Trends Tech"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  RSS URL
                </Label>
                <div className="col-span-3">
                  <Input
                    id="url"
                    placeholder="https://trends.google.com/trends/trendingsearches/daily/rss?geo=US"
                    {...register("url")}
                    className={errors.url ? "border-red-500" : ""}
                  />
                  {errors.url && (
                    <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3">
                  <Input
                    id="category"
                    placeholder="Technology"
                    {...register("category")}
                    className={errors.category ? "border-red-500" : ""}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="validator">
              <FeedValidator onValidFeed={handleValidFeed} />
              {watch("url") && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name-validated" className="text-right">
                      Name
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="name-validated"
                        placeholder="Feed name"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category-validated" className="text-right">
                      Category
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="category-validated"
                        placeholder="Category"
                        {...register("category")}
                        className={errors.category ? "border-red-500" : ""}
                      />
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trends">
              <GoogleTrendsGenerator onUrlGenerated={handleUrlGenerated} />
              {watch("url") && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name-trends" className="text-right">
                      Name
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="name-trends"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category-trends" className="text-right">
                      Category
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="category-trends"
                        {...register("category")}
                        className={errors.category ? "border-red-500" : ""}
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {editFeed ? "Save Changes" : "Add Feed"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeedDialog;
