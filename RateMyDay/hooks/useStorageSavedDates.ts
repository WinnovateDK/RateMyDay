import { useState, useEffect } from 'react';
import { getAllItems } from "@/utills/AsyncStorage";
import { CalendarColors } from '@/constants/Colors';

export type MarkedDate = Record<
  string,
  { rating: number; selected: boolean; selectedColor: string }
>;

const fetchMarkedDates = async (): Promise<[string, string | null][]> => {
  const historicalRatings = await getAllItems(); // Assuming this returns an object
  const keyValuePairs = Object.entries(historicalRatings) as [string, string | null][];
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
              accumulator[key] = {
                rating: parseInt(value),
                selected: true,
                selectedColor: CalendarColors[parseInt(value) - 1],
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