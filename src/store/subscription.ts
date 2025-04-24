import { create } from "zustand";
import { api } from "@/lib/api/axios";

interface SubscriptionStore {
  subscribedChannels: string[];
  likedVideos: string[];
  dislikedVideos: string[];
  setSubscribedChannels: (channels: string[]) => void;
  setLikedVideos: (videos: string[]) => void;
  setDislikedVideos: (videos: string[]) => void;
  toggleSubscription: (channelId: string) => Promise<void>;
  toggleLike: (videoId: string) => Promise<void>;
  toggleDislike: (videoId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscribedChannels: [],
  likedVideos: [],
  dislikedVideos: [],

  setSubscribedChannels: (channels) => set({ subscribedChannels: channels }),
  setLikedVideos: (videos) => set({ likedVideos: videos }),
  setDislikedVideos: (videos) => set({ dislikedVideos: videos }),

  toggleSubscription: async (channelId) => {
    const { subscribedChannels } = get();
    const isSubscribed = subscribedChannels.includes(channelId);

    // Optimistic update
    set({
      subscribedChannels: isSubscribed
        ? subscribedChannels.filter((id) => id !== channelId)
        : [...subscribedChannels, channelId],
    });

    try {
      await api.post(
        `/subscription/c/channel/${isSubscribed ? "unsubscribe" : "subscribe"}`,
        {
          channel: channelId,
        }
      );
    } catch (error) {
      // Revert on error
      set({
        subscribedChannels: isSubscribed
          ? [...subscribedChannels, channelId]
          : subscribedChannels.filter((id) => id !== channelId),
      });
      throw error;
    }
  },

  toggleLike: async (videoId) => {
    const { likedVideos, dislikedVideos } = get();
    const isLiked = likedVideos.includes(videoId);

    // Remove from disliked if present
    if (dislikedVideos.includes(videoId)) {
      set({
        dislikedVideos: dislikedVideos.filter((id) => id !== videoId),
      });
    }

    // Optimistic update
    set({
      likedVideos: isLiked
        ? likedVideos.filter((id) => id !== videoId)
        : [...likedVideos, videoId],
    });

    try {
      await api.post(`/videos/v/${videoId}/${isLiked ? "unlike" : "like"}`);
    } catch (error) {
      // Revert on error
      set({
        likedVideos: isLiked
          ? [...likedVideos, videoId]
          : likedVideos.filter((id) => id !== videoId),
      });
      throw error;
    }
  },

  toggleDislike: async (videoId) => {
    const { likedVideos, dislikedVideos } = get();
    const isDisliked = dislikedVideos.includes(videoId);

    // Remove from liked if present
    if (likedVideos.includes(videoId)) {
      set({
        likedVideos: likedVideos.filter((id) => id !== videoId),
      });
    }

    // Optimistic update
    set({
      dislikedVideos: isDisliked
        ? dislikedVideos.filter((id) => id !== videoId)
        : [...dislikedVideos, videoId],
    });

    try {
      await api.post(
        `/videos/v/${videoId}/${isDisliked ? "undislike" : "dislike"}`
      );
    } catch (error) {
      // Revert on error
      set({
        dislikedVideos: isDisliked
          ? [...dislikedVideos, videoId]
          : dislikedVideos.filter((id) => id !== videoId),
      });
      throw error;
    }
  },
}));
