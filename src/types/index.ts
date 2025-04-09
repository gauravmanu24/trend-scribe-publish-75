
export interface Feed {
  id: string;
  name: string;
  url: string;
  category: string;
  lastFetched?: string;
  status: "active" | "paused" | "error";
}

export interface WordPressConfig {
  url: string;
  username: string;
  password: string; // In a real app, use secure storage
  isConnected: boolean;
}

export interface OpenRouterConfig {
  apiKey: string; // In a real app, use secure storage
  model: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  feedId: string;
  sourceTitle?: string;
  sourceLink?: string;
  status: "draft" | "generated" | "published" | "failed";
  createdAt: string;
  publishedAt?: string;
}

export interface AppState {
  feeds: Feed[];
  wordPressConfig: WordPressConfig;
  openRouterConfig: OpenRouterConfig;
  articles: Article[];
  isPolling: boolean;
  pollingInterval: number; // in minutes
}
