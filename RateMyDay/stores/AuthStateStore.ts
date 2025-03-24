import { create } from "zustand";
import { persist } from "zustand/middleware";
import PocketBase, { RecordModel } from "pocketbase";

const pb = new PocketBase("https://winnovate.pockethost.io");

interface AuthData {
  record: RecordModel;
  token: string;
}

interface AuthState {
  session: AuthData | null;
  isGuest: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  setIsGuest: (isGuest: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: pb.authStore.isValid
    ? { record: pb.authStore.record as RecordModel, token: pb.authStore.token }
    : null,
  isGuest: false,
  isLoading: false,
  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      set({ session: authData, isGuest: false, isLoading: false });
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
  setIsGuest: (isGuest) => set({ isGuest }),
}));

export default useAuthStore;
