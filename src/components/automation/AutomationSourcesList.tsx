
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AutomationSource } from "@/types";
import AutomationSourceCard from "./AutomationSourceCard";

interface AutomationSourcesListProps {
  sources: AutomationSource[];
  onAddSource: () => void;
  onEditSource: (id: string) => void;
  onDeleteSource: (id: string) => void;
  onToggleSourceStatus: (id: string) => void;
  onRunSource: (id: string) => void;
  isRunningAction: boolean;
  processingSourceId: string | null;
  titlesProcessed: number;
  totalTitlesToProcess: number;
}

const AutomationSourcesList: React.FC<AutomationSourcesListProps> = ({
  sources,
  onAddSource,
  onEditSource,
  onDeleteSource,
  onToggleSourceStatus,
  onRunSource,
  isRunningAction,
  processingSourceId,
  titlesProcessed,
  totalTitlesToProcess,
}) => {
  if (sources.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <PlusCircle className="h-6 w-6 text-primary"/>
          </div>
          <h3 className="font-semibold text-lg mb-2">No sources added yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Create your first content source to start automating your content generation and publishing workflow.
          </p>
          <Button onClick={onAddSource}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Source
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {sources.map((source) => (
        <AutomationSourceCard
          key={source.id}
          source={source}
          onEdit={onEditSource}
          onDelete={onDeleteSource}
          onToggleStatus={onToggleSourceStatus}
          onRun={onRunSource}
          isRunning={isRunningAction}
          processingSourceId={processingSourceId}
          titlesProcessed={titlesProcessed}
          totalTitlesToProcess={totalTitlesToProcess}
        />
      ))}
    </div>
  );
};

export default AutomationSourcesList;
