import { getItem } from "@/utills/AsyncStorage";
import moment from "moment";

export function daysPassedThisWeek(): number {
  const today = new Date();
  let currentDayOfWeek = today.getDay();
  currentDayOfWeek = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  return currentDayOfWeek;
}

export function daysPassedThisMonth(): number {
  const today = new Date();
  const currentDay = today.getDate();

  return currentDay - 1;
}

export function getDatesInCurrentWeek(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - adjustedDayOfWeek);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    const formattedDate = formatDate(currentDay);

    dates.push(formattedDate);
  }

  return dates;
}

export async function handleGetTodaysRating() {
  const date = new Date();
  const formattedDate = formatDate(date);
  const rating = await getItem(`${formattedDate}`).then((rating) => {
    return rating;
  });
  return rating.rating;
}

export async function isRatingSetToday(): Promise<boolean> {
  const isTodaysRatingSet = handleGetTodaysRating().then((rating) => {
    if (rating === null) {
      return false;
    }
    return true;
  });

  return isTodaysRatingSet;
}

export function getDaysInCurrentMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export function getDatesInCurrentMonth(): string[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dates: string[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const formattedDate = formatDate(currentDate);
    dates.push(formattedDate);
  }

  return dates;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysPassedThisYear(): number {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const msPerDay = 24 * 60 * 60 * 1000;

  const daysPassed = Math.floor(
    (today.getTime() - startOfYear.getTime()) / msPerDay
  );

  return daysPassed;
}

export function getDatesInCurrentYear(): string[] {
  const today = new Date();
  const year = today.getFullYear();
  const dates: string[] = [];

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = formatDate(new Date(year, month, day));
      dates.push(formattedDate);
    }
  }

  return dates;
}

/**
 * Function to get all week numbers for the current month
 * @returns {number[]} - Array of week numbers for the current month
 */
export const getWeekNumbersForCurrentMonth = (): number[] => {
  const currentDate = moment(); // Get the current date
  const startOfMonth = currentDate.clone().startOf("month"); // Start of the current month
  const endOfMonth = currentDate.clone().endOf("month"); // End of the current month

  const weekNumbers: number[] = [];
  let currentWeek = startOfMonth.isoWeek();

  while (startOfMonth.isBefore(endOfMonth, "day")) {
    weekNumbers.push(currentWeek); // Add the current week number to the array
    startOfMonth.add(1, "week"); // Move to the next week
    currentWeek = startOfMonth.isoWeek(); // Update the week number
  }

  return [...new Set(weekNumbers)]; // Return unique week numbers
};
