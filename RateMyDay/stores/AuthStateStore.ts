import { create } from "zustand";
import { persist } from "zustand/middleware";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://10.0.2.2:8090/");

interface AuthState {
  session: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: pb.authStore.token,
  isLoading: false,

  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      set({ session: authData.token, isLoading: false });
      console.log("token: ", authData);
    } catch (error) {
      console.error("Login failed: ", error);
      set({ isLoading: false });
    }
  },
  signOut: () => {
    pb.authStore.clear();
    set({ session: null });
  },
}));

export default useAuthStore;
