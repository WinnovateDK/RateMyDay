import { create } from "zustand";
import { calculateAverageRatingForWeekPb } from "@/utills/RatingService";
import {
  calculateAverageRatingForMonthPb,
  calculateAverageRatingForYearPb,
} from "@/utills/PocketBase";

type Ratings = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
};

interface RatingsState {
  weeklyRatings: Ratings;
  monthlyRatings: Ratings;
  yearlyRatings: Ratings;
  setWeeklyRatings: (userId: string) => Promise<void>;
  setMonthlyRatings: (userId: string) => Promise<void>;
  setYearlyRatings: (userId: string) => Promise<void>;
}

export const useRatingStorePb = create<RatingsState>((set) => ({
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

  setWeeklyRatings: async (userId: string) => {
    try {
      const result = await calculateAverageRatingForWeekPb(userId);
      set({ weeklyRatings: result });
    } catch (error) {
      console.error("Error calculating average ratings:", error);
    }
  },
  setMonthlyRatings: async (userId: string) => {
    try {
      console.log("userid: ", userId);
      const result = await calculateAverageRatingForMonthPb(userId);
      set({ monthlyRatings: result });
    } catch (error) {
      console.error("Error calculating average ratings:", error);
    }
  },
  setYearlyRatings: async (userId: string) => {
    try {
      console.log("userid: ", userId);
      const result = await calculateAverageRatingForYearPb(userId);
      set({ yearlyRatings: result });
    } catch (error) {
      console.error("Error calculating average ratings:", error);
    }
  },
}));
