import { getItem } from "@/utills/AsyncStorage";
import {
  daysPassedThisWeek,
  getDatesInCurrentWeek,
  isRatingSetToday,
  daysPassedThisMonth,
  getDatesInCurrentMonth,
  getDatesInCurrentYear,
  daysPassedThisYear,
  getWeekNumbersForCurrentMonth,
} from "@/utills/CalendarUtills";

export type rateDatePair = {
  Label: string;
  Rating: number;
};

export type chartDataType = {
  Label: Date;
  Rating: number;
};

export async function calculateAverageRatingForWeek() {
  let daysPassed = daysPassedThisWeek();
  const datesInPastWeek = getDatesInCurrentWeek();
  const isRatingTodaySet = await isRatingSetToday();
  const pastWeeksRatings: number[] = [];
  let daysWithoutARating = 0;
  console.log("hej");
  if (isRatingTodaySet) {
    daysPassed += 1;
  }

  if (daysPassed > 0) {
    for (let i = 0; i < daysPassed; i++) {
      const rating = await getItem(datesInPastWeek[i]).then((rating) => {
        if (rating === null) {
          daysWithoutARating += 1;
        }
        return rating;
      });
      if (rating !== null) {
        pastWeeksRatings.push(parseInt(rating.rating));
      }
    }

    const highestRating = Math.max(...pastWeeksRatings);
    const lowestRating = Math.min(...pastWeeksRatings);
    const sumOfRatings = pastWeeksRatings.reduce((acc, num) => acc + num, 0);
    const averageRating =
      Math.round((sumOfRatings / (daysPassed - daysWithoutARating)) * 100) /
      100;
    return {
      averageRating: averageRating,
      lowestRating: lowestRating,
      highestRating: highestRating,
    };
  }

  return {
    averageRating: 0,
    lowestRating: 0,
    highestRating: 0,
  };
}

export async function calculateAverageRatingForMonth() {
  let daysPassed = daysPassedThisMonth();
  const datesInPastMonth = getDatesInCurrentMonth();
  const isRatingTodaySet = await isRatingSetToday();
  const pastMontsRatings: number[] = [];
  let daysWithoutARating = 0;

  if (isRatingTodaySet) {
    daysPassed += 1;
  }

  if (daysPassed > 0) {
    for (let i = 0; i < daysPassed; i++) {
      const rating = await getItem(datesInPastMonth[i]).then((rating) => {
        if (rating === null) {
          daysWithoutARating += 1;
        }
        return rating;
      });
      if (rating !== null) {
        pastMontsRatings.push(parseInt(rating.rating));
      }
    }

    const highestRating = Math.max(...pastMontsRatings);
    const lowestRating = Math.min(...pastMontsRatings);
    const sumOfRatings = pastMontsRatings.reduce((acc, num) => acc + num, 0);
    const averageRating =
      Math.round((sumOfRatings / (daysPassed - daysWithoutARating)) * 100) /
      100;
    return {
      averageRating: averageRating,
      lowestRating: lowestRating,
      highestRating: highestRating,
    };
  }

  return {
    averageRating: 0,
    lowestRating: 0,
    highestRating: 0,
  };
}

export async function calculateAverageRatingForYear() {
  let daysPassed = daysPassedThisYear();
  const datesInPastYear = getDatesInCurrentYear();
  const isRatingTodaySet = await isRatingSetToday();
  const pastYearsRatings: number[] = [];
  let daysWithoutARating = 0;
  if (isRatingTodaySet) {
    daysPassed += 1;
  }

  if (daysPassed > 0) {
    for (let i = 0; i < daysPassed; i++) {
      const rating = await getItem(datesInPastYear[i]).then((rating) => {
        if (rating === null) {
          daysWithoutARating += 1;
        }
        return rating;
      });
      if (rating !== null) {
        pastYearsRatings.push(parseInt(rating.rating));
      }
    }

    const highestRating = Math.max(...pastYearsRatings);
    const lowestRating = Math.min(...pastYearsRatings);
    const sumOfRatings = pastYearsRatings.reduce((acc, num) => acc + num, 0);
    const averageRating =
      Math.round((sumOfRatings / (daysPassed - daysWithoutARating)) * 100) /
      100;
    return {
      averageRating: averageRating,
      lowestRating: lowestRating,
      highestRating: highestRating,
    };
  }

  return {
    averageRating: 0,
    lowestRating: 0,
    highestRating: 0,
  };
}

export async function getRatingsforLastMonth(): Promise<rateDatePair[]> {
  let daysPassed = daysPassedThisMonth();
  const datesInPastMonth = getDatesInCurrentMonth();
  const isRatingTodaySet = await isRatingSetToday();
  const pastMontsRatings: rateDatePair[] = [];
  let daysWithoutARating = 0;

  if (isRatingTodaySet) {
    daysPassed += 1;
  }

  if (daysPassed > 0) {
    for (let i = 0; i < daysPassed; i++) {
      const rating = await getItem(datesInPastMonth[i]).then((rating) => {
        if (rating === null) {
          daysWithoutARating += 1;
        } else {
          const dateRate: rateDatePair = {
            Label: datesInPastMonth[i],
            Rating: parseInt(rating.rating),
          };
          pastMontsRatings.push(dateRate);
        }
      });
    }
  }
  return pastMontsRatings;
}

export async function getRatingsForLastWeek(): Promise<rateDatePair[]> {
  let daysPassed = daysPassedThisWeek();
  const datesInPastWeek = getDatesInCurrentWeek();
  const isRatingTodaySet = await isRatingSetToday();
  const pastWeeksRatings: rateDatePair[] = [];
  let daysWithoutARating = 0;

  if (isRatingTodaySet) {
    daysPassed += 1;
  }

  if (daysPassed > 0) {
    for (let i = 0; i < daysPassed; i++) {
      const rating = await getItem(datesInPastWeek[i]).then((rating) => {
        if (rating.rating === null) {
          daysWithoutARating += 1;
        }
        return rating;
      });
      if (rating.rating !== null) {
        pastWeeksRatings.push({
          Label: datesInPastWeek[i].split("-")[2],
          Rating: parseInt(rating.rating),
        });
      }
    }
  }
  return pastWeeksRatings;
}

export async function getRatingsForLastYear(): Promise<rateDatePair[]> {
  let daysPassed = daysPassedThisYear();
  const datesInPastYear = getDatesInCurrentYear();
  const isRatingTodaySet = await isRatingSetToday();
  const pastYearsRatings: rateDatePair[] = [];
  let daysWithoutARating = 0;

  if (isRatingTodaySet) {
    daysPassed += 1;
  }

  if (daysPassed > 0) {
    for (let i = 0; i < daysPassed; i++) {
      const rating = await getItem(datesInPastYear[i]);

      if (rating === null) {
        daysWithoutARating += 1;
        continue;
      }
      pastYearsRatings.push({
        Label: datesInPastYear[i],
        Rating: rating !== null ? parseInt(rating.rating) : rating.rating,
      });
    }
  }
  return pastYearsRatings;
}

export async function getAverageRatingsPerMonth(): Promise<number[]> {
  const ratings = await getRatingsForLastYear();
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
      averageRatings.push(0); // No ratings for this month
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

export async function interpolateRating(
  ratings: { rating: number | null; date: string }[],
  index: number,
  dates: string[]
): Promise<number> {
  const maxRange = 3;
  let previousValue: number | null = null;
  let nextValue: number | null = null;

  // Search for previous value within the range
  try {
    for (let i = 1; i <= maxRange; i++) {
      if (
        index - i >= 0 &&
        ratings[index - i].rating !== null &&
        ratings[index - i].rating !== undefined &&
        ratings[index - i].rating !== 0
      ) {
        previousValue = ratings[index - i].rating!;
        break;
      }
    }
  } catch (error) {
    console.log("Error in previous interpolation value: ", error);
  }

  // Search for next value within the range
  try {
    for (let i = 1; i <= maxRange; i++) {
      if (index + i < dates.length && dates[index + i] !== null) {
        const nextRating = await getItem(dates[index + i]).then((rating) => {
          return rating;
        });
        if (nextRating !== null && nextRating !== undefined) {
          nextValue = nextRating;
          break;
        }
      }
    }
  } catch (error) {
    console.log("Error in finding next interpolation value: ", error);
  }

  // Interpolate if both previous and next values are found
  if (previousValue !== null && nextValue !== null) {
    return (previousValue + nextValue) / 2;
  }

  // Return previous or next value if only one is found
  if (previousValue !== null) {
    return previousValue;
  }
  if (nextValue !== null) {
    return nextValue;
  }
  // Return 0 if no values are found within the range
  return 0;
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
  const averages = weekNumbers.map((weekNumber) => {
    const weekData = getWeekData(data, year, weekNumber);
    const totalRating = weekData.reduce((sum, item) => sum + item.Rating, 0);
    const averageRating = totalRating / weekData.length || 0;

    const week = `Week ${weekNumber}`;

    return {
      Label: week,
      Rating: averageRating,
    };
  });
  return averages;
};
