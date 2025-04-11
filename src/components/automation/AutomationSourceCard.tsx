
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Play, X, Check, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { AutomationSource } from "@/types";

interface AutomationSourceCardProps {
  source: AutomationSource;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onRun: (id: string) => void;
  isRunning: boolean;
  processingSourceId: string | null;
  titlesProcessed: number;
  totalTitlesToProcess: number;
}

const AutomationSourceCard: React.FC<AutomationSourceCardProps> = ({
  source,
  onEdit,
  onDelete,
  onToggleStatus,
  onRun,
  isRunning,
  processingSourceId,
  titlesProcessed,
  totalTitlesToProcess,
}) => {
  return (
    <Card key={source.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              {source.name}
              {!source.isActive && (
                <Badge variant="outline" className="ml-2 bg-gray-100">
                  Inactive
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {source.type === "rss" && "RSS Feed"}
              {source.type === "manual" && "Manual Titles"}
              {source.type === "sheets" && "Google Sheets"}
              {source.type === "file" && "Uploaded File"}
              
              {source.lastProcessed && (
                <span className="ml-2">
                  • Last run: {format(new Date(source.lastProcessed), "MMM d, yyyy HH:mm")}
                </span>
              )}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(source.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus(source.id)}>
                {source.isActive ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(source.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        {source.type === "manual" && source.titles && (
          <div>
            <h4 className="text-sm font-medium mb-1">Titles ({source.titles.length})</h4>
            <div className="text-sm text-muted-foreground mt-1 max-h-20 overflow-y-auto">
              {source.titles.slice(0, 3).map((title, i) => (
                <div key={i} className="mb-1 truncate">{title}</div>
              ))}
              {source.titles.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{source.titles.length - 3} more titles
                </div>
              )}
            </div>
          </div>
        )}
        
        {source.type === "rss" && source.url && (
          <div>
            <h4 className="text-sm font-medium mb-1">Feed URL</h4>
            <div className="text-sm text-muted-foreground truncate">
              {source.url}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onRun(source.id)} 
          disabled={isRunning || !source.isActive || (source.type === "manual" && (!source.titles || source.titles.length === 0))}
          className="w-full"
        >
          {(isRunning && processingSourceId === source.id) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing {titlesProcessed} of {totalTitlesToProcess}
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AutomationSourceCard;
