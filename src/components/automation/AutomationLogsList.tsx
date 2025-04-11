
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { AutomationLog } from "@/types";

interface AutomationLogsListProps {
  logs: AutomationLog[];
  clearLogs: () => void;
}

const AutomationLogsList: React.FC<AutomationLogsListProps> = ({ logs, clearLogs }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Activity Logs</CardTitle>
          {logs.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearLogs}>
              Clear Logs
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No activity logs yet</p>
            <p className="text-sm">Run a source to see activity here</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...logs]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(log.timestamp), "HH:mm:ss")}
                    </TableCell>
                    <TableCell>{log.sourceName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {log.title}
                    </TableCell>
                    <TableCell>
                      {log.status === "success" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Success
                        </Badge>
                      )}
                      {log.status === "processing" && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          Processing
                        </Badge>
                      )}
                      {log.status === "failed" && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      {log.message}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomationLogsList;
