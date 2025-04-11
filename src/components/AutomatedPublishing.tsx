import React, { useState, useEffect } from "react";
import { useInterval } from "@/hooks/useInterval";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Check, Clock, RefreshCw, MoreHorizontal, AlertCircle, X, Plus, Loader2, 
  Play, PlusCircle, Upload, FileText, FileSpreadsheet, Edit, Trash2 
} from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationLog, AutomationSource, Article } from "@/types";

const AutomatedPublishing = () => {
  const { toast } = useToast();
  const feeds = useAppStore((state) => state.feeds);
  const sources = useAppStore((state) => state.automationSources);
  const setSources = useAppStore((state) => state.setAutomationSources);
  const logs = useAppStore((state) => state.automationLogs);
  const addLog = useAppStore((state) => state.addAutomationLog);
  const clearLogs = useAppStore((state) => state.clearAutomationLogs);
  const addArticle = useAppStore((state) => state.addArticle);
  const isPolling = useAppStore((state) => state.isPolling);
  const setPolling = useAppStore((state) => state.setPolling);
  const pollingInterval = useAppStore((state) => state.pollingInterval);
  const setPollingInterval = useAppStore((state) => state.setPollingInterval);
  const lastManualRun = useAppStore((state) => state.lastManualRun);
  const setLastManualRun = useAppStore((state) => state.setLastManualRun);
  const wordPressConfig = useAppStore((state) => state.wordPressConfig);
  const openRouterConfig = useAppStore((state) => state.openRouterConfig);
  
  // Add missing state variables
  const [isEditingSource, setIsEditingSource] = useState(false);
  const [editSourceId, setEditSourceId] = useState<string | null>(null);
  const [isSourceSheetOpen, setIsSourceSheetOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState<"rss" | "sheets" | "manual" | "file">("manual");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceTitles, setNewSourceTitles] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [isRunningAction, setIsRunningAction] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);
  const [language, setLanguage] = useState("en");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState("800");
  const [category, setCategory] = useState("general");
  const [fileType, setFileType] = useState<"txt" | "excel" | "csv">("txt");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState(
    "Write a comprehensive, well-researched article with the following title: '{TITLE}'. Format your response with proper HTML tags including h2, h3 for headings, <ul> and <li> for lists, and <p> tags for paragraphs. The article should be informative, factual, and engaging for readers."
  );
  const [activeTab, setActiveTab] = useState("sources");
  const [processingTitles, setProcessingTitles] = useState<string[]>([]);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number | null>(null);
  const [processingSourceId, setProcessingSourceId] = useState<string | null>(null);
  const [totalTitlesToProcess, setTotalTitlesToProcess] = useState<number>(0);
  const [titlesProcessed, setTitlesProcessed] = useState<number>(0);

[Rest of the original code, exactly as shown in the original file, continuing from line 67 onwards...]
