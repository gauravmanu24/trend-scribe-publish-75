
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Feed, Article, AutomationSource, AutomationLog, OpenRouterConfig, WordPressConfig } from "@/types";

interface AppState {
  feeds: Feed[];
  addFeed: (feed: Omit<Feed, "id" | "status">) => void;
  removeFeed: (id: string) => void;
  updateFeed: (id: string, data: Partial<Feed>) => void;
  
  articles: Article[];
  addArticle: (article: Omit<Article, "id" | "updatedAt">) => void;
  removeArticle: (id: string) => void;
  updateArticle: (id: string, data: Partial<Article>) => void;
  
  automationSources: AutomationSource[];
  setAutomationSources: (sources: AutomationSource[]) => void;
  
  automationLogs: AutomationLog[];
  addAutomationLog: (log: AutomationLog) => void;
  clearAutomationLogs: () => void;
  
  openRouterConfig: OpenRouterConfig;
  updateOpenRouterConfig: (config: Partial<OpenRouterConfig>) => void;
  
  wordPressConfig: WordPressConfig;
  updateWordPressConfig: (config: Partial<WordPressConfig>) => void;
  
  pollingInterval: number;
  setPollingInterval: (interval: number) => void;
  
  isPolling: boolean;
  setPolling: (isPolling: boolean) => void;
  
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      feeds: [],
      addFeed: (feed) =>
        set((state) => ({
          feeds: [
            ...state.feeds,
            {
              id: uuidv4(),
              status: "active",
              ...feed,
            },
          ],
        })),
      removeFeed: (id) =>
        set((state) => ({
          feeds: state.feeds.filter((feed) => feed.id !== id),
        })),
      updateFeed: (id, data) =>
        set((state) => ({
          feeds: state.feeds.map((feed) =>
            feed.id === id ? { ...feed, ...data } : feed
          ),
        })),
      
      articles: [],
      addArticle: (article) =>
        set((state) => ({
          articles: [
            ...state.articles,
            {
              id: uuidv4(),
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              publishedAt: null,
              wordpressPostId: null,
              wordpressPostUrl: null,
              sourceLink: null,
              category: article.category || "general",
              ...article,
            },
          ],
        })),
      removeArticle: (id) =>
        set((state) => ({
          articles: state.articles.filter((article) => article.id !== id),
        })),
      updateArticle: (id, data) =>
        set((state) => ({
          articles: state.articles.map((article) =>
            article.id === id
              ? {
                  ...article,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : article
          ),
        })),
      
      automationSources: [],
      setAutomationSources: (sources) => set({ automationSources: sources }),
      
      automationLogs: [],
      addAutomationLog: (log) =>
        set((state) => ({
          automationLogs: [...state.automationLogs, log],
        })),
      clearAutomationLogs: () => set({ automationLogs: [] }),
      
      openRouterConfig: {
        apiKey: "",
        model: "anthropic/claude-3-opus:beta",
        freeModel: "meta-llama/llama-3-8b-instruct",
        isConnected: false,
      },
      updateOpenRouterConfig: (config) =>
        set((state) => ({
          openRouterConfig: {
            ...state.openRouterConfig,
            ...config,
          },
        })),
      
      wordPressConfig: {
        url: "",
        username: "",
        password: "",
        isConnected: false,
      },
      updateWordPressConfig: (config) =>
        set((state) => ({
          wordPressConfig: {
            ...state.wordPressConfig,
            ...config,
          },
        })),
      
      pollingInterval: 60, // Default 60 minutes
      setPollingInterval: (interval) => set({ pollingInterval: interval }),
      
      isPolling: false,
      setPolling: (isPolling) => set({ isPolling }),
      
      reset: () => set({
        feeds: [],
        articles: [],
        automationSources: [],
        automationLogs: [],
        openRouterConfig: {
          apiKey: "",
          model: "anthropic/claude-3-opus:beta",
          freeModel: "meta-llama/llama-3-8b-instruct",
          isConnected: false,
        },
        wordPressConfig: {
          url: "",
          username: "",
          password: "",
          isConnected: false,
        },
        pollingInterval: 60,
        isPolling: false,
      }),
    }),
    {
      name: "trendscribe-storage",
    }
  )
);
