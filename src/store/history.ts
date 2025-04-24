import { create } from "zustand";
import { api } from "@/lib/api/axios";
import type { Video } from "@/lib/types/video";

interface HistoryStore {
  watchHistory: Video[];
  loading: boolean;
  fetchHistory: () => Promise<void>;
  addToHistory: (video: Video) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  watchHistory: [],
  loading: false,

  fetchHistory: async () => {
    try {
      set({ loading: true });
      const response = await api.get("/videos/history");
      set({ watchHistory: response.data.videos });
    } catch (error) {
      console.error("Failed to fetch watch history:", error);
    } finally {
      set({ loading: false });
    }
  },

  addToHistory: async (video: Video) => {
    try {
      await api.post("/videos/history", { videoId: video._id });
      const history = get().watchHistory;
      // Remove if already exists to avoid duplicates
      const filteredHistory = history.filter((v) => v._id !== video._id);
      set({ watchHistory: [video, ...filteredHistory] });
    } catch (error) {
      console.error("Failed to add video to history:", error);
    }
  },

  clearHistory: async () => {
    try {
      await api.delete("/videos/history");
      set({ watchHistory: [] });
    } catch (error) {
      console.error("Failed to clear watch history:", error);
    }
  },
}));
