
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/use-settings";

const SystemSettings = () => {
  const {
    interval,
    setInterval,
    handleSaveInterval
  } = useSettings();
  
  return (
    <Card className="trendy-card">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Configure system behavior and polling settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="interval">Polling Interval (minutes)</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="interval"
              type="number" 
              min="10"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="max-w-[150px]"
            />
            <Button onClick={handleSaveInterval}>Save</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            How often to check RSS feeds for new content (minimum 10 minutes)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
