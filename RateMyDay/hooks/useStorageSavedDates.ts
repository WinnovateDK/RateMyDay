import { useState, useEffect } from "react";
import { getAllItems } from "@/utills/AsyncStorage";
import { CalendarColors } from "@/constants/Colors";

export type MarkedDate = Record<
  string,
  { rating: number; note: string; selected: boolean; selectedColor: string }
>;

const fetchMarkedDates = async (): Promise<
  [string, { value1: string; value2: string }][]
> => {
  const historicalRatings = await getAllItems(); // Assuming this returns an object
  const keyValuePairs = Object.entries(historicalRatings) as [
    string,
    { value1: string; value2: string }
  ][];
  return keyValuePairs;
};

export const useStorageSavedDates = (trigger: boolean) => {
  const [storageSavedDates, setStorageSavedDates] = useState<MarkedDate>({});

  useEffect(() => {
    if (trigger) {
      const loadDates = async () => {
        const historicalRatings = await fetchMarkedDates();

        const savedDateRecords = historicalRatings.reduce<MarkedDate>(
          (accumulator, [key, value]) => {
            if (key && value) {
              const rating =
                value.value1 !== "No Rating" ? parseInt(value.value1) : 0;
              accumulator[key] = {
                rating: rating,
                note: value.value2,
                selected: true,
                selectedColor: CalendarColors[rating - 1],
              };
            }
            return accumulator;
          },
          {} as MarkedDate
        );
        setStorageSavedDates(savedDateRecords);
      };

      loadDates();
    }
  }, [trigger]);

  return storageSavedDates;
};
