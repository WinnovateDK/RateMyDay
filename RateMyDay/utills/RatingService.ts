import {
  daysPassedThisWeek,
  getDatesInCurrentWeekPb,
  daysPassedThisMonth,
  getDatesInCurrentMonthPb,
  getWeekNumbersForCurrentMonth,
} from "@/utills/CalendarUtills";
import { getRatingByDate, getRatingsForThisYearPb } from "./PocketBase";
import pb from "./pbClient";

export type rateDatePair = {
  Label: string;
  Rating: number;
  fullDate?: Date;  // Add the fullDate property as optional
};

export type chartDataType = {
  Label: Date;
  Rating: number;
};

export async function calculateAverageRatingForWeekPb(userId: string) {
  const startOfWeek = new Date();
  const day = startOfWeek.getUTCDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() - diffToMonday);
  startOfWeek.setUTCHours(0, 0, 0, 0);

  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);
  const startOfWeekStr = startOfWeek
    .toISOString()
    .replace("T", " ")
    .split(".")[0];
  const todayStr = today.toISOString().replace("T", " ").split(".")[0];

  try {
    const records = await pb.collection("ratings").getFullList({
      filter: `userId.id = "${userId}" && date >= "${startOfWeekStr}" && date <= "${todayStr}"`,
    });

    if (records.length === 0) {
      return {
        averageRating: 0,
        lowestRating: 0,
        highestRating: 0,
        count: 0,
      };
    }

    const ratings = records.map((r) => parseInt(r.rating));
    const count = ratings.length;
    const averageRating =
      Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 100) /
      100;
    const highestRating = Math.max(...ratings);
    const lowestRating = Math.min(...ratings);
    console.log(
      "Weekly ratings records:",
      records.map((r) => ({
        date: r.date,
        rating: r.rating,
      }))
    );

    return {
      averageRating,
      lowestRating: lowestRating < 11 ? lowestRating : 0,
      highestRating: highestRating > 0 ? highestRating : 0,
      count: count,
    };
  } catch (e) {
    console.error("Error fetching ratings for the week:", e);
    return {
      averageRating: 0,
      lowestRating: 0,
      highestRating: 0,
      count: 0,
    };
  }
}

export async function getRatingsforLastMonthPb(
  userId: string
): Promise<rateDatePair[]> {
  let daysPassed = daysPassedThisMonth();
  const datesInPastMonth = getDatesInCurrentMonthPb();
  const pastMontsRatings: rateDatePair[] = [];
  let daysWithoutARating = 0;
  const today = new Date();
  const todayRating = await getRatingByDate(userId, today);

  if (todayRating) {
    daysPassed += 1;
  }

  if (daysPassed > 0) {
    for (let i = 0; i < daysPassed; i++) {
      await getRatingByDate(userId, datesInPastMonth[i]).then((rating) => {
        if (rating === null) {
          daysWithoutARating += 1;
        } else {
          const dateRate: rateDatePair = {
            Label: datesInPastMonth[i].toISOString().split("T")[0],
            Rating: parseInt(rating?.rating),
          };
          pastMontsRatings.push(dateRate);
        }
      });
    }
  }

  return pastMontsRatings;
}

export async function getRatingsForLastWeekPb(
  userId: string
): Promise<rateDatePair[]> {
  let daysPassed = daysPassedThisWeek();
  const datesInPastWeek = getDatesInCurrentWeekPb();
  const pastWeeksRatings: rateDatePair[] = [];
  let daysWithoutARating = 0;

  const today = new Date();
  const todayRating = await getRatingByDate(userId, today);

  if (todayRating) {
    daysPassed += 1;
  }

  if (daysPassed > 0) {
    for (let i = 0; i < daysPassed; i++) {
      const rating = await getRatingByDate(userId, datesInPastWeek[i]).then(
        (rating) => {
          if (rating === null) {
            daysWithoutARating += 1;
          }
          return rating;
        }
      );
      if (rating !== null) {
        const dateObj = datesInPastWeek[i];
        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");

        pastWeeksRatings.push({
          Label: `${day}-${month}`,
          Rating: parseInt(rating?.rating),
        });
      }
    }
  }
  return pastWeeksRatings;
}

export async function getAverageRatingsPerMonthPb(
  userId: string
): Promise<number[]> {
  const ratings = await getRatingsForThisYearPb(userId);
  const monthlyRatings: { [key: string]: number[] } = {};
  ratings.forEach(({ Label, Rating }) => {
    const month = new Date(Label).getMonth();
    if (Rating !== null) {
      if (!monthlyRatings[month]) {
        monthlyRatings[month] = [];
      }
      monthlyRatings[month].push(Rating);
    }
  });
  const averageRatings: number[] = [];
  for (let month = 0; month < 12; month++) {
    if (monthlyRatings[month] && monthlyRatings[month].length > 0) {
      const sum = monthlyRatings[month].reduce(
        (acc, rating) => acc + rating,
        0
      );

      const average = sum / monthlyRatings[month].length;
      averageRatings.push(average);
    } else {
      averageRatings.push(0);
    }
  }
  return averageRatings;
}

export function getAmountOfDaysInCurrentMonth(): number {
  const now: Date = new Date();
  const year: number = now.getFullYear();
  const month: number = now.getMonth();

  return new Date(year, month + 1, 0).getDate();
}

const getISOWeekStart = (year: number, weekNumber: number) => {
  const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const dayOfWeek = simple.getUTCDay() || 7;
  const ISOWeekStart = new Date(simple);
  ISOWeekStart.setUTCDate(simple.getUTCDate() - dayOfWeek + 1);
  return ISOWeekStart;
};

export const getWeekData = (
  data: chartDataType[],
  year: number,
  weekNumber: number
) => {
  const startOfWeek = getISOWeekStart(year, weekNumber);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7);

  return data.filter(
    (item) => item.Label >= startOfWeek && item.Label < endOfWeek
  );
};

export const calculateWeeklyAverages = (
  data: chartDataType[],
  year: number
) => {
  const weekNumbers = getWeekNumbersForCurrentMonth();
  const averages = weekNumbers
    .map((weekNumber) => {
      const weekData = getWeekData(data, year, weekNumber);
      const totalRating = weekData.reduce((sum, item) => sum + item.Rating, 0);
      const averageRating = totalRating / weekData.length || 0;

      if (averageRating === 0) {
        return null;
      }

      const week = `Week ${weekNumber}`;

      return {
        Label: week,
        Rating: averageRating,
      };
    })
    .filter(
      (entry): entry is { Label: string; Rating: number } => entry !== null
    );

  return averages;
};
