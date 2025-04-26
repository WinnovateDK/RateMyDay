
import { create } from "zustand";
import { persist } from "zustand/middleware";
import PocketBase, { RecordModel } from "pocketbase";
import Config from 'react-native-config';
import { useRatingStorePb } from "./RatingStorePb";
import { getBackupFromRemote } from "@/utills/PocketBaseBackupService";
import { zustandAsyncStorage } from "@/utills/ZustandAsyncStorage";

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
  encryptionKey: string | null;
  setEncryptionKey: (encryptionKey: string) => void;
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
      encryptionKey: null,
      setEncryptionKey: (key: string) => {
        set({ encryptionKey: key });
      },
      signIn: async (email, password) => {
        set({ isLoading: true });
        try {
          const authData = await pb
            .collection("users")
            .authWithPassword(email, password);
          set({ session: authData, isGuest: false });
          pb.authStore.save(authData.token, authData.record as RecordModel);
          const ratingStore = useRatingStorePb.getState();
          await ratingStore.setWeeklyRatings(authData.record.id);
          await ratingStore.setMonthlyRatings(authData.record.id);
          await ratingStore.setYearlyRatings(authData.record.id);
          await ratingStore.setGraphWeeklyRatings(authData.record.id);
          await ratingStore.setGraphMonthlyRatings(authData.record.id);
          await ratingStore.setGraphYearlyRatings(authData.record.id);
          const key = await getBackupFromRemote(authData.record.id);
          if(key) {
            set({ encryptionKey: key });
          }
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
