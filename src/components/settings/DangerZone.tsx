
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

const DangerZone = () => {
  const { resetting, handleResetApp } = useSettings();
  
  return (
    <Card className="border-destructive/20 trendy-card">
      <CardHeader className="bg-destructive/10">
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Actions here can result in data loss. Proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Resetting the app will delete all your feeds, articles, and configuration settings.
          </AlertDescription>
        </Alert>
        <Button 
          variant="destructive" 
          onClick={handleResetApp} 
          disabled={resetting}
        >
          {resetting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Application"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
