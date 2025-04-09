
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FeedValidatorProps {
  onValidFeed?: (url: string) => void;
}

const FeedValidator: React.FC<FeedValidatorProps> = ({ onValidFeed }) => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "validating" | "valid" | "invalid">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const validateFeed = async () => {
    if (!url) return;
    
    setStatus("validating");
    setErrorMessage("");
    
    try {
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        setStatus("valid");
        if (onValidFeed) {
          onValidFeed(url);
        }
      } else {
        setStatus("invalid");
        setErrorMessage(data.message || "Invalid RSS feed");
      }
    } catch (error) {
      setStatus("invalid");
      setErrorMessage("Failed to validate feed. Please check the URL and try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          placeholder="Enter RSS feed URL" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={validateFeed} 
          disabled={!url || status === "validating"}
        >
          {status === "validating" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : (
            "Validate Feed"
          )}
        </Button>
      </div>
      
      {status === "valid" && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Valid RSS feed detected! This feed can be used to generate content.
          </AlertDescription>
        </Alert>
      )}
      
      {status === "invalid" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FeedValidator;
