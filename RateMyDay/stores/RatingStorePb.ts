import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateAverageRatingForWeekPb } from "@/utills/RatingService";
import {
  calculateAverageRatingForMonthPb,
  calculateAverageRatingForYearPb,
  getRatingsForLastWeekPb,
  getRatingsforLastMonthPb,
} from "@/utills/PocketBase";
import {
  rateDatePair,
  getAverageRatingsPerMonthPb,
} from "@/utills/RatingService";
import { zustandAsyncStorage } from "@/utills/ZustandAsyncStorage";

type Ratings = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
};

interface RatingsState {
  weeklyRatings: Ratings;
  monthlyRatings: Ratings;
  yearlyRatings: Ratings;
  graphWeeklyRatings: rateDatePair[];
  graphMonthlyRatings: rateDatePair[];
  graphYearlyRatings: number[];
  setWeeklyRatings: (userId: string) => Promise<void>;
  setMonthlyRatings: (userId: string) => Promise<void>;
  setYearlyRatings: (userId: string) => Promise<void>;
  setGraphWeeklyRatings: (userId: string) => Promise<void>;
  setGraphMonthlyRatings: (userId: string) => Promise<void>;
  setGraphYearlyRatings: (userId: string) => Promise<void>;
}

export const useRatingStorePb = create<RatingsState>()(
  persist(
    (set) => ({
      weeklyRatings: {
        averageRating: 0,
        highestRating: 0,
        lowestRating: 0,
      },
      monthlyRatings: {
        averageRating: 0,
        highestRating: 0,
        lowestRating: 0,
      },
      yearlyRatings: {
        averageRating: 0,
        highestRating: 0,
        lowestRating: 0,
      },
      graphWeeklyRatings: [],
      graphMonthlyRatings: [],
      graphYearlyRatings: [],

      setWeeklyRatings: async (userId: string) => {
        try {
          const result = await calculateAverageRatingForWeekPb(userId);
          set({ weeklyRatings: result });
        } catch (error) {
          console.error("Error calculating average Weekly ratings:", error);
        }
      },
      setMonthlyRatings: async (userId: string) => {
        try {
          
          const result = await calculateAverageRatingForMonthPb(userId);
          set({ monthlyRatings: result });
        } catch (error) {
          console.error("Error calculating average Monthly ratings:", error);
        }
      },
      setYearlyRatings: async (userId: string) => {
        try {
          const result = await calculateAverageRatingForYearPb(userId);
          set({ yearlyRatings: result });
        } catch (error) {
          console.error("Error calculating average Yearly ratings:", error);
        }
      },
      setGraphWeeklyRatings: async (userId: string) => {
        try {
          
          const result = await getRatingsForLastWeekPb(userId);
          set({ graphWeeklyRatings: result });
        } catch (error) {
          console.error("Error calculating average GraphWeekly ratings:", error);
        }
      },
      setGraphMonthlyRatings: async (userId: string) => {
        try {
          const result = await getRatingsforLastMonthPb(userId);
          set({ graphMonthlyRatings: result });
        } catch (error) {
          console.error("Error calculating average GraphMonthly ratings:", error);
        }
      },
      setGraphYearlyRatings: async (userId: string) => {
        try {
          const result = await getAverageRatingsPerMonthPb(userId);
          set({ graphYearlyRatings: result });
        } catch (error) {
          console.error("Error calculating average GraphYearly ratings:", error);
        }
      },
    }),
    {
      name: "ratings-storage",
      storage: zustandAsyncStorage,
    }
  )
);
