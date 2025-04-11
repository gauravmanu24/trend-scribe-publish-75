
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { AutomationSource } from "@/types";

interface AutomationProcessingCardProps {
  isRunningAction: boolean;
  processingSourceId: string | null;
  sources: AutomationSource[];
  titlesProcessed: number;
  totalTitlesToProcess: number;
  currentProcessingIndex: number | null;
  processingTitles: string[];
}

const AutomationProcessingCard: React.FC<AutomationProcessingCardProps> = ({
  isRunningAction,
  processingSourceId,
  sources,
  titlesProcessed,
  totalTitlesToProcess,
  currentProcessingIndex,
  processingTitles,
}) => {
  if (!isRunningAction || !processingSourceId) {
    return null;
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
              Processing articles
            </h3>
            <Badge variant="outline" className="bg-blue-100">
              {titlesProcessed} of {totalTitlesToProcess}
            </Badge>
          </div>
          
          <div className="text-sm">
            <p>Source: {sources.find(s => s.id === processingSourceId)?.name}</p>
            {currentProcessingIndex !== null && processingTitles[currentProcessingIndex] && (
              <p className="font-medium mt-1">Current: {processingTitles[currentProcessingIndex]}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationProcessingCard;
