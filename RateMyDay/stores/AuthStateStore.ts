import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import PocketBase, { RecordModel } from "pocketbase";
import Config from 'react-native-config';
import { useRatingStorePb } from "./RatingStorePb";

const pb = new PocketBase("https://winnovate.pockethost.io");

const zustandAsyncStorage = {
  getItem: async (name: string) => {
    const item = await AsyncStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: async (name: string, value: any) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: pb.authStore.isValid
        ? {
            record: pb.authStore.record as RecordModel,
            token: pb.authStore.token,
          }
        : null,
      isGuest: false,
      isLoading: false,
      signIn: async (email, password) => {
        set({ isLoading: true });
        try {
          const authData = await pb
            .collection("users")
            .authWithPassword(email, password);
          set({ session: authData, isGuest: false });

          const ratingStore = useRatingStorePb.getState();
          await ratingStore.setWeeklyRatings(authData.record.id);
          await ratingStore.setMonthlyRatings(authData.record.id);
          await ratingStore.setYearlyRatings(authData.record.id);
          await ratingStore.setGraphWeeklyRatings(authData.record.id);
          await ratingStore.setGraphMonthlyRatings(authData.record.id);
          await ratingStore.setGraphYearlyRatings(authData.record.id);

          set({ isLoading: false });
        } catch (error) {
          console.error("Login failed: ", error);
          set({ isLoading: false });
          throw new Error("Login failed: Wrong email or password.");
        }
      },
      signOut: () => {
        pb.authStore.clear();
        set({ session: null });
      },
      setIsGuest: (isGuest) => set({ isGuest }),
    }),
    {
      name: "auth-storage",
      storage: zustandAsyncStorage,
    }
  )
);

export default useAuthStore;
