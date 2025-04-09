
import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { AppState, Feed, Article } from "../types";
import { v4 as uuidv4 } from "uuid";

const initialState: AppState = {
  feeds: [],
  wordPressConfig: {
    url: "",
    username: "",
    password: "",
    isConnected: false,
  },
  openRouterConfig: {
    apiKey: "",
    model: "anthropic/claude-3-opus:beta",
    freeModel: "meta-llama/llama-3.1-8b-instruct:free",
  },
  articles: [],
  isPolling: false,
  pollingInterval: 60,
  lastManualRun: null,
};

type StoreState = AppState & {
  addFeed: (feed: Omit<Feed, "id" | "status" | "lastFetched">) => void;
  updateFeed: (id: string, feed: Partial<Feed>) => void;
  removeFeed: (id: string) => void;
  updateWordPressConfig: (config: Partial<AppState["wordPressConfig"]>) => void;
  updateOpenRouterConfig: (config: Partial<AppState["openRouterConfig"]>) => void;
  addArticle: (article: Omit<Article, "id" | "createdAt">) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  removeArticle: (id: string) => void;
  setPolling: (isPolling: boolean) => void;
  setPollingInterval: (minutes: number) => void;
  setLastManualRun: (date: string | null) => void;
  reset: () => void;
};

const persistConfig: PersistOptions<StoreState> = {
  name: "news-publisher-storage",
};

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      ...initialState,
      addFeed: (feed) =>
        set((state) => ({
          feeds: [
            ...state.feeds,
            {
              ...feed,
              id: uuidv4(),
              status: "active",
              lastFetched: undefined,
            },
          ],
        })),
      updateFeed: (id, feed) =>
        set((state) => ({
          feeds: state.feeds.map((f) => (f.id === id ? { ...f, ...feed } : f)),
        })),
      removeFeed: (id) =>
        set((state) => ({
          feeds: state.feeds.filter((f) => f.id !== id),
        })),
      updateWordPressConfig: (config) =>
        set((state) => ({
          wordPressConfig: { ...state.wordPressConfig, ...config },
        })),
      updateOpenRouterConfig: (config) =>
        set((state) => ({
          openRouterConfig: { ...state.openRouterConfig, ...config },
        })),
      addArticle: (article) =>
        set((state) => ({
          articles: [
            ...state.articles,
            {
              ...article,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateArticle: (id, article) =>
        set((state) => ({
          articles: state.articles.map((a) => (a.id === id ? { ...a, ...article } : a)),
        })),
      removeArticle: (id) =>
        set((state) => ({
          articles: state.articles.filter((a) => a.id !== id),
        })),
      setPolling: (isPolling) =>
        set(() => ({
          isPolling,
        })),
      setPollingInterval: (minutes) =>
        set(() => ({
          pollingInterval: minutes,
        })),
      setLastManualRun: (date) =>
        set(() => ({
          lastManualRun: date,
        })),
      reset: () => set(initialState),
    }),
    persistConfig
  )
);
