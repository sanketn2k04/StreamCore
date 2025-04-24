import { create } from "zustand";
import axios from "@/lib/api/axios";

interface Playlist {
  _id: string;
  name: string;
  visibility: "public" | "private";
  videos: Array<{
    _id: string;
    title: string;
    thumbnail: string;
  }>;
}

interface PlaylistStore {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (data: {
    name: string;
    visibility: "public" | "private";
  }) => Promise<Playlist>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addVideoToPlaylist: (playlistId: string, videoId: string) => Promise<void>;
  removeVideoFromPlaylist: (
    playlistId: string,
    videoId: string
  ) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlists: [],
  loading: false,
  error: null,

  fetchPlaylists: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get("/playlists");
      set({ playlists: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch playlists", loading: false });
    }
  },

  createPlaylist: async (playlistData) => {
    try {
      const { data } = await axios.post("/playlists", playlistData);
      set((state) => ({
        playlists: [...state.playlists, data],
      }));
      return data;
    } catch (error) {
      set({ error: "Failed to create playlist" });
      throw error;
    }
  },

  deletePlaylist: async (playlistId) => {
    try {
      await axios.delete(`/playlists/${playlistId}`);
      set((state) => ({
        playlists: state.playlists.filter((p) => p._id !== playlistId),
      }));
    } catch (error) {
      set({ error: "Failed to delete playlist" });
      throw error;
    }
  },

  addVideoToPlaylist: async (playlistId, videoId) => {
    try {
      await axios.post(`/playlists/${playlistId}/videos`, { videoId });
      set((state) => ({
        playlists: state.playlists.map((playlist) => {
          if (playlist._id === playlistId) {
            return {
              ...playlist,
              videos: [
                ...playlist.videos,
                { _id: videoId, title: "", thumbnail: "" },
              ],
            };
          }
          return playlist;
        }),
      }));
    } catch (error) {
      set({ error: "Failed to add video to playlist" });
      throw error;
    }
  },

  removeVideoFromPlaylist: async (playlistId, videoId) => {
    try {
      await axios.delete(`/playlists/${playlistId}/videos/${videoId}`);
      set((state) => ({
        playlists: state.playlists.map((playlist) => {
          if (playlist._id === playlistId) {
            return {
              ...playlist,
              videos: playlist.videos.filter((v) => v._id !== videoId),
            };
          }
          return playlist;
        }),
      }));
    } catch (error) {
      set({ error: "Failed to remove video from playlist" });
      throw error;
    }
  },
}));
