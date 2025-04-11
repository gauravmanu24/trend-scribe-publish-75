
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIServicesSettings from "@/components/settings/AIServicesSettings";
import WordPressSettings from "@/components/settings/WordPressSettings";
import SystemSettings from "@/components/settings/SystemSettings";
import UserProfileSettings from "@/components/settings/UserProfileSettings";
import DangerZone from "@/components/settings/DangerZone";
import ImageProviderSettings from "@/components/settings/ImageProviderSettings";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 grid grid-cols-6 w-full max-w-3xl">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="ai">AI Services</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="wordpress">WordPress</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <UserProfileSettings />
        </TabsContent>
        
        <TabsContent value="ai">
          <AIServicesSettings />
        </TabsContent>
        
        <TabsContent value="images">
          <ImageProviderSettings />
        </TabsContent>
        
        <TabsContent value="wordpress">
          <WordPressSettings />
        </TabsContent>
        
        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
        
        <TabsContent value="danger">
          <Separator className="my-8" />
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
