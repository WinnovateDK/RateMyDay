import { create } from "zustand";
import { persist } from "zustand/middleware";
import PocketBase, { RecordModel } from "pocketbase";
import { useRatingStorePb } from "./RatingStorePb";

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
      console.log("token: ", authData.record.id);

      const ratingStore = useRatingStorePb.getState();
      await ratingStore.setWeeklyRatings(authData.record.id);
      await ratingStore.setMonthlyRatings(authData.record.id);
      await ratingStore.setYearlyRatings(authData.record.id);
      await ratingStore.setGraphWeeklyRatings(authData.record.id);
      await ratingStore.setGraphMonthlyRatings(authData.record.id);
      await ratingStore.setGraphYearlyRatings(authData.record.id);
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
}));

export default useAuthStore;
