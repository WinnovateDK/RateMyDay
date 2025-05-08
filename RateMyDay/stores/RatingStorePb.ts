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
import { isSameWeek, isSameMonth, isSameYear } from "@/utills/CalendarUtills";

type Ratings = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
  count: number;
};

type RatingsYear = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
  count: number;
  allRatings: number[];
};

interface RatingsState {
  weeklyRatings: Ratings;
  monthlyRatings: Ratings;
  yearlyRatings: RatingsYear;
  graphWeeklyRatings: rateDatePair[];
  graphMonthlyRatings: rateDatePair[];
  graphYearlyRatings: number[];
  lastDate: Date;
  setWeeklyRatings: (userId: string) => Promise<void>;
  setMonthlyRatings: (userId: string) => Promise<void>;
  setYearlyRatings: (userId: string) => Promise<void>;
  setGraphWeeklyRatings: (userId: string) => Promise<void>;
  setGraphMonthlyRatings: (userId: string) => Promise<void>;
  setGraphYearlyRatings: (userId: string) => Promise<void>;
  addNewRatingLocally: (newRating: number) => void;
  setLastDate: (date: Date) => void;
}

function updateOrAppendRating(
  graphData: rateDatePair[],
  label: string,
  rating: number
): rateDatePair[] {
  const index = graphData.findIndex((entry) => entry.Label === label);
  if (index !== -1) {
    const updated = [...graphData];
    updated[index].Rating = rating;
    return updated;
  }
  return [...graphData, { Label: label, Rating: rating }];
}

function updateStatsWithPossibleReplace(
  existing: Ratings,
  newRating: number,
  oldRating: number | null
): Ratings {
  let total = existing.averageRating * existing.count;
  let count = existing.count;

  if (oldRating !== null) {
    total = total - oldRating + newRating;
  } else {
    total += newRating;
    count += 1;
  }

  const newAverage = Math.round((total / count) * 100) / 100;
  const newHighest = Math.max(existing.highestRating, newRating);
  const newLowest =
    existing.lowestRating === 0
      ? newRating
      : oldRating !== null && oldRating === existing.lowestRating
      ? Math.min(newRating, ...[])
      : Math.min(existing.lowestRating, newRating);

  return {
    averageRating: newAverage,
    highestRating: newHighest,
    lowestRating: newLowest,
    count,
  };
}

export const useRatingStorePb = create<RatingsState>()(
  persist(
    (set, get) => ({
      weeklyRatings: {
        averageRating: 0,
        highestRating: 0,
        lowestRating: 0,
        count: 0,
      },
      monthlyRatings: {
        averageRating: 0,
        highestRating: 0,
        lowestRating: 0,
        count: 0,
      },
      yearlyRatings: {
        averageRating: 0,
        highestRating: 0,
        lowestRating: 0,
        count: 0,
        allRatings: [],
      },
      graphWeeklyRatings: [],
      graphMonthlyRatings: [],
      graphYearlyRatings: [],
      lastDate: new Date(),
      setLastDate(date: Date) {
        set({ lastDate: date });
      },
      setWeeklyRatings: async (userId: string) => {
        try {
          const result = await calculateAverageRatingForWeekPb(userId);

          set({ weeklyRatings: result, lastDate: new Date() });
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
          console.error(
            "Error calculating average GraphWeekly ratings:",
            error
          );
        }
      },
      setGraphMonthlyRatings: async (userId: string) => {
        try {
          const result = await getRatingsforLastMonthPb(userId);
          set({ graphMonthlyRatings: result });
        } catch (error) {
          console.error(
            "Error calculating average GraphMonthly ratings:",
            error
          );
        }
      },
      setGraphYearlyRatings: async (userId: string) => {
        try {
          const result = await getAverageRatingsPerMonthPb(userId);
          set({ graphYearlyRatings: result });
        } catch (error) {
          console.error(
            "Error calculating average GraphYearly ratings:",
            error
          );
        }
      },
      addNewRatingLocally(newRating: number) {
        const current = get();
        const now = new Date();
        const lastDate = current.lastDate;
        const day = now.getDate().toString().padStart(2, "0");
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const label = `${day}-${month}`;
        const monthIndex = now.getMonth();

        const isStillSameWeek = isSameWeek(now, lastDate);

        const isStillSameMonth = isSameMonth(now, current.lastDate);

        const isStillSameYear = isSameYear(now, current.lastDate);

        const newGraphWeekly = isStillSameWeek
          ? updateOrAppendRating(current.graphWeeklyRatings, label, newRating)
          : [{ Label: label, Rating: newRating }];

        const weeklyRatingsValues = newGraphWeekly.map((r) => r.Rating);
        const newStatsWeekly = {
          averageRating:
            Math.round(
              (weeklyRatingsValues.reduce((sum, r) => sum + r, 0) /
                weeklyRatingsValues.length) *
                100
            ) / 100,
          highestRating: Math.max(...weeklyRatingsValues),
          lowestRating: Math.min(...weeklyRatingsValues),
          count: weeklyRatingsValues.length,
        };

        const newGraphMonthly = isStillSameMonth
          ? updateOrAppendRating(current.graphMonthlyRatings, label, newRating)
          : [{ Label: label, Rating: newRating }];

        const monthlyRatingsValues = newGraphMonthly.map((r) => r.Rating);
        const newStatsMonthly = {
          averageRating:
            Math.round(
              (monthlyRatingsValues.reduce((sum, r) => sum + r, 0) /
                monthlyRatingsValues.length) *
                100
            ) / 100,
          highestRating: Math.max(...monthlyRatingsValues),
          lowestRating: Math.min(...monthlyRatingsValues),
          count: monthlyRatingsValues.length,
        };

        let updatedAllRatings: number[] = [...current.yearlyRatings.allRatings];
        let updatedYearlyRatings = [...current.graphYearlyRatings];

        if (!isStillSameYear) {
          updatedAllRatings = [newRating];
          updatedYearlyRatings = Array(12).fill(null);
          updatedYearlyRatings[monthIndex] = newRating;
        } else {
          const existingRatingToday =
            current.graphMonthlyRatings.find((r) => r.Label === label)
              ?.Rating ?? null;

          if (existingRatingToday !== null) {
            const idx = updatedAllRatings.findIndex(
              (r) => r === existingRatingToday
            );
            if (idx !== -1) {
              updatedAllRatings[idx] = newRating;
            } else {
              updatedAllRatings.push(newRating);
            }
          } else {
            updatedAllRatings.push(newRating);
          }

          const thisMonthRatings = current.graphMonthlyRatings
            .filter((r) => {
              const rMonth = parseInt(r.Label.split("-")[1]) - 1;
              return rMonth === monthIndex;
            })
            .map((r) =>
              r.Rating === existingRatingToday ? newRating : r.Rating
            );

          const monthlyAvg = thisMonthRatings.length
            ? thisMonthRatings.reduce((sum, r) => sum + r, 0) /
              thisMonthRatings.length
            : newRating;

          updatedYearlyRatings[monthIndex] = Math.round(monthlyAvg * 100) / 100;
        }

        updatedAllRatings = current.graphMonthlyRatings
          .map((r) => r.Rating)
          .filter((r) => typeof r === "number" && !isNaN(r));

        set({
          weeklyRatings: newStatsWeekly,
          monthlyRatings: newStatsMonthly,
          yearlyRatings: {
            averageRating:
              Math.round(
                (updatedAllRatings.reduce((sum, r) => sum + r, 0) /
                  updatedAllRatings.length) *
                  100
              ) / 100,
            highestRating: Math.max(...updatedAllRatings),
            lowestRating: Math.min(...updatedAllRatings),
            count: updatedAllRatings.length,
            allRatings: updatedAllRatings,
          },
          graphWeeklyRatings: newGraphWeekly,
          graphMonthlyRatings: newGraphMonthly,
          graphYearlyRatings: updatedYearlyRatings,
          lastDate: now,
        });
      },
    }),
    {
      name: "ratings-storage",
      storage: zustandAsyncStorage,
    }
  )
);
