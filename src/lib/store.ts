
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
  setOpenRouterConfig: (config: Partial<OpenRouterConfig>) => void;
  
  wordPressConfig: WordPressConfig;
  setWordPressConfig: (config: Partial<WordPressConfig>) => void;
  
  isPolling: boolean;
  setPolling: (isPolling: boolean) => void;
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
              id: article.id || uuidv4(),
              updatedAt: new Date().toISOString(),
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
        model: "",
        isConnected: false,
      },
      setOpenRouterConfig: (config) =>
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
      setWordPressConfig: (config) =>
        set((state) => ({
          wordPressConfig: {
            ...state.wordPressConfig,
            ...config,
          },
        })),
      
      isPolling: false,
      setPolling: (isPolling) => set({ isPolling }),
    }),
    {
      name: "trendscribe-storage",
    }
  )
);
