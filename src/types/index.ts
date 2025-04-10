
export interface Feed {
  id: string;
  name: string;
  url: string;
  category: string;
  status: "active" | "paused" | "error";
  lastFetched?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  status: "draft" | "generated" | "published" | "failed" | "pending" | "processing";
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  sourceTitle: string | null;
  sourceLink?: string | null;
  category: string;
  wordpressPostId: string | null;
  wordpressPostUrl: string | null;
}

export interface AutomationSource {
  id: string;
  name: string;
  type: "rss" | "sheets" | "manual" | "file";
  url?: string;
  titles?: string[];
  createdAt: string;
  lastProcessed: string | null;
  isActive: boolean;
}

export interface AutomationLog {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  status: "processing" | "success" | "failed";
  timestamp: string;
  message: string;
  articleId?: string;
}

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  freeModel?: string;
  isConnected: boolean;
}

export interface WordPressConfig {
  url: string;
  username: string;
  password: string;
  isConnected: boolean;
}
