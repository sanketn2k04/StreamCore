import { create } from "zustand";
import { api } from "@/lib/api/axios";
import { User, LoginInput, RegisterInput } from "@/lib/types/user";

interface AuthStore {
  user: User | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  login: async (input) => {
    const response = await api.post("/users/login", input);
    set({ user: response.data.user });
  },
  register: async (input) => {
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    const response = await api.post("/users/register", formData);
    set({ user: response.data.user });
  },
  logout: async () => {
    await api.post("/users/logout");
    set({ user: null });
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get("/users/current-user");
      set({ user: response.data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));
