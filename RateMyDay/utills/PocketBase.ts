import PocketBase from "pocketbase";

const pb = new PocketBase("http://10.0.2.2:8090/");

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
    const records = await pb.collection("ratings").getList(1, 1, {
      filter: `user_id = "${userId}" && date= "${date}"`,
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
