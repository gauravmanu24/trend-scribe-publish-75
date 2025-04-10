
import React from "react";
import { Separator } from "@/components/ui/separator";
import AIServicesSettings from "@/components/settings/AIServicesSettings";
import WordPressSettings from "@/components/settings/WordPressSettings";
import SystemSettings from "@/components/settings/SystemSettings";
import DangerZone from "@/components/settings/DangerZone";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Settings</h1>
      
      <AIServicesSettings />
      
      <WordPressSettings />
      
      <SystemSettings />
      
      <Separator className="my-8" />
      
      <DangerZone />
    </div>
  );
};

export default SettingsPage;
