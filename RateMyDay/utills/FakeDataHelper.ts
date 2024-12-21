import { setItem } from "./AsyncStorage";
import { getDatesInCurrentYear } from "./CalendarUtills";

export async function generateFakeRatingData(){
    const dates = getDatesInCurrentYear();
    for (let i = 0; i < dates.length; i++) {
        // For every date in dates, i want to set a rating with a random number between 1 and 10
        const newKey = dates[i];
        const randomRating = Math.floor(Math.random() * 10) + 1;
        await setItem(`${newKey}`, randomRating);
    }
}