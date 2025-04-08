import PocketBase from "pocketbase";
import { daysPassedThisWeek, getDatesInCurrentWeekPb } from "./CalendarUtills";
import { rateDatePair } from "./RatingService";
import { pb } from "./pbClient";

export const createUser = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const user = await pb.collection("users").create({
      email: email,
      password: password,
      passwordConfirm: confirmPassword,
    });

    return user;
  } catch (e) {
    console.error("Error creating user: ", e);
    throw e;
  }
};

export const createRating = async (
  userId: string,
  rating: number,
  note: string
) => {
  try {
    const data = {
      user_id: userId,
      rating: rating,
      note: note,
      date: new Date().toISOString(),
    };

    const record = await pb.collection("ratings").create(data);
    console.log("rating created: ", data);
  } catch (e) {
    console.error("Error creating rating: ", e);
  }
};

export const updateRating = async (
  ratingId: string,
  newRating?: number,
  newNote?: string
) => {
  try {
    const data: Record<string, any> = {};

    if (newRating !== undefined) data.rating = newRating;
    if (newNote !== undefined) data.note = newNote;

    const updatedRecord = await pb.collection("ratings").update(ratingId, data);
    console.log("Rating updated: ", updateRating);
    return updatedRecord;
  } catch (e) {
    console.error("Error updating rating: ", e);
  }
};

export const getRatingByDate = async (userId: string, date: Date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0];
    console.log("formatteed: ", formattedDate);

    const records = await pb.collection("ratings").getList(1, 1, {
      filter: `user_id = "${userId}" && date >= "${formattedDate} 00:00:00" && date <= "${formattedDate} 23:59:59"`,
    });

    if (records.items.length > 0) {
      console.log("Rating found: ", records.items[0]);
      return records.items[0];
    } else {
      console.log("No rating found for this date.");
      return null;
    }
  } catch (e) {
    console.error("Error getting rating: ", e);
  }
};

export const getAllRatingsForUser = async (userId: string) => {
  try {
    const ratings = await pb.collection("ratings").getFullList({
      filter: `user_id = "${userId}"`,
    });
    return ratings;
  } catch (e) {
    console.error("Error fetching ratings: ", e);
    return [];
  }
};

export async function calculateAverageRatingForMonthPb(userId: string) {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const allRatings = await pb.collection("ratings").getFullList({
      filter: `user_id = "${userId}" && date >= "${startOfMonth.toISOString()}" && date <= "${today.toISOString()}"`,
    });
    if (allRatings.length === 0) {
      return {
        averageRating: 0,
        lowestRating: 0,
        highestRating: 0,
      };
    }

    const ratings = allRatings.map((record) => parseInt(record.rating));

    const highestRating = Math.max(...ratings);
    const lowestRating = Math.min(...ratings);
    const sumOfRatings = ratings.reduce((acc, num) => acc + num, 0);
    const averageRating =
      Math.round((sumOfRatings / ratings.length) * 100) / 100;

    return {
      averageRating,
      lowestRating,
      highestRating,
    };
  } catch (error) {
    console.error("Error calculating monthly average rating:", error);
    return {
      averageRating: 0,
      lowestRating: 0,
      highestRating: 0,
    };
  }
}

export async function calculateAverageRatingForYearPb(userId: string) {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const allRatings = await pb.collection("ratings").getFullList({
      filter: `user_id = "${userId}" && date >= "${startOfYear.toISOString()}" && date <= "${today.toISOString()}"`,
    });

    if (allRatings.length === 0) {
      return {
        averageRating: 0,
        lowestRating: 0,
        highestRating: 0,
      };
    }

    const ratings = allRatings.map((record) => parseInt(record.rating));

    const highestRating = Math.max(...ratings);
    const lowestRating = Math.min(...ratings);
    const sumOfRatings = ratings.reduce((acc, num) => acc + num, 0);
    const averageRating =
      Math.round((sumOfRatings / ratings.length) * 100) / 100;

    return {
      averageRating,
      lowestRating,
      highestRating,
    };
  } catch (error) {
    console.error("Error calculating yearly average rating:", error);
    return {
      averageRating: 0,
      lowestRating: 0,
      highestRating: 0,
    };
  }
}

export async function getRatingsForLastWeekPb(
  userId: string
): Promise<rateDatePair[]> {
  const startOfWeek = new Date();
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay());
  startOfWeek.setUTCHours(0, 0, 0, 0);

  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);

  const startOfWeekStr = startOfWeek
    .toISOString()
    .replace("T", " ")
    .split(".")[0];
  const todayStr = today.toISOString().replace("T", " ").split(".")[0];

  const allRatings = await pb.collection("ratings").getFullList({
    filter: `user_id = "${userId}" && date >= "${startOfWeekStr}" && date <= "${todayStr}"`,
  });

  const pastWeeksRatings: rateDatePair[] = allRatings
    .filter((rating) => rating?.rating !== null)
    .map((rating) => {
      const dateObj = new Date(rating.date);
      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");

      return {
        Label: `${day}-${month}`,
        Rating: parseInt(rating.rating),
      };
    });

  return pastWeeksRatings;
}

export async function getRatingsforLastMonthPb(
  userId: string
): Promise<rateDatePair[]> {
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const lastDayOfMonth = new Date(firstDayOfMonth);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(0);
  lastDayOfMonth.setHours(23, 59, 59, 999);

  const firstDayStr = firstDayOfMonth
    .toISOString()
    .replace("T", " ")
    .split(".")[0];
  const lastDayStr = lastDayOfMonth
    .toISOString()
    .replace("T", " ")
    .split(".")[0];

  const allRatings = await pb.collection("ratings").getFullList({
    filter: `user_id = "${userId}" && date >= "${firstDayStr}" && date <= "${lastDayStr}"`,
  });

  const pastMonthRatings: rateDatePair[] = allRatings
    .filter((rating) => rating?.rating !== null)
    .map((rating) => {
      const dateObj = new Date(rating.date);
      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");

      return {
        Label: `${day}-${month}`,
        Rating: parseInt(rating.rating),
      };
    });
  console.log("pastmonths ratings: ", pastMonthRatings);
  return pastMonthRatings;
}

export async function getRatingsForThisYearPb(
  userId: string
): Promise<rateDatePair[]> {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1); // Start of the current year
  const today = new Date(); // Current date

  // Fetch all ratings from the database (adjust this if your database supports range queries)
  const allRatings = await pb.collection("ratings").getList(1, 100, {
    filter: `user_id = "${userId}" && date >= "${startOfYear.toISOString()}" && date <= "${today.toISOString()}"`,
  });

  const ratingsForThisYear: rateDatePair[] = allRatings.items.map((rating) => {
    const dateObj = new Date(rating.date);
    const label = `${dateObj.getDate().toString().padStart(2, "0")}-${(
      dateObj.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;

    return {
      Label: label,
      Rating: parseInt(rating.rating),
    };
  });

  return ratingsForThisYear;
}
