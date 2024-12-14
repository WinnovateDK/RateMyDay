import { getItem } from "@/utills/AsyncStorage";
import { 
    daysPassedThisWeek,
    getDatesInCurrentWeek, 
    isRatingSetToday, 
    daysPassedThisMonth, 
    getDatesInCurrentMonth,
    getDatesInCurrentYear,
    daysPassedThisYear
 } from "@/utills/CalendarUtills";

export async function calculateAverageRatingForWeek() {
    let daysPassed = daysPassedThisWeek();
    const datesInPastWeek = getDatesInCurrentWeek();
    const isRatingTodaySet = await isRatingSetToday();
    const pastWeeksRatings: number[] = [];
    let daysWithoutARating = 0;

    if (isRatingTodaySet){
      daysPassed += 1
    }
    
    if(daysPassed > 0){
      for(let i=0; i < daysPassed; i++){
        const rating = await getItem(datesInPastWeek[i]).then((rating) => {
            if(rating===null){
                daysWithoutARating += 1
            }
          return rating;
        });
        if(rating !== null){
            pastWeeksRatings.push(parseInt(rating));
          }
      }

      const highestRating = Math.max(...pastWeeksRatings);
      const lowestRating = Math.min(...pastWeeksRatings);
      const sumOfRatings = pastWeeksRatings.reduce((acc, num) => acc + num, 0);
      const averageRating = Math.round((sumOfRatings / (daysPassed-daysWithoutARating))*100) / 100;
      return {
        averageRating: averageRating,
        lowestRating: lowestRating,
        highestRating: highestRating
      }
    }

    return {
      averageRating: 0,
      lowestRating: 0,
      highestRating: 0
    }
  }
  
export async function calculateAverageRatingForMonth(){
    let daysPassed = daysPassedThisMonth();
    const datesInPastMonth = getDatesInCurrentMonth();
    const isRatingTodaySet = await isRatingSetToday();
    const pastMontsRatings: number[] = [];
    let daysWithoutARating = 0;

    if (isRatingTodaySet){
        daysPassed += 1
      }
      
      if(daysPassed > 0){
        for(let i=0; i < daysPassed; i++){
          const rating = await getItem(datesInPastMonth[i]).then((rating) => {
            if(rating===null){
                daysWithoutARating += 1
            }
            return rating;
          });
          if(rating !== null){
            pastMontsRatings.push(parseInt(rating));
          }
        }
  
        const highestRating = Math.max(...pastMontsRatings);
        const lowestRating = Math.min(...pastMontsRatings);
        const sumOfRatings = pastMontsRatings.reduce((acc, num) => acc + num, 0);
        const averageRating = Math.round((sumOfRatings / (daysPassed-daysWithoutARating))*100) / 100;
        return {
          averageRating: averageRating,
          lowestRating: lowestRating,
          highestRating: highestRating
        }
      }
  
      return {
        averageRating: 0,
        lowestRating: 0,
        highestRating: 0
      }
}

export async function calculateAverageRatingForYear() {
    let daysPassed = daysPassedThisYear();
    const datesInPastYear = getDatesInCurrentYear();
    const isRatingTodaySet = await isRatingSetToday();
    const pastYearsRatings: number[] = [];
    let daysWithoutARating = 0

    if (isRatingTodaySet){
        daysPassed += 1
      }
      
      if(daysPassed > 0){
        for(let i=0; i < daysPassed; i++){
          const rating = await getItem(datesInPastYear[i]).then((rating) => {
            if(rating===null){
                daysWithoutARating += 1
            }
            return rating;
          });
          if(rating !== null){
            pastYearsRatings.push(parseInt(rating));
          }
        }
  
        const highestRating = Math.max(...pastYearsRatings);
        const lowestRating = Math.min(...pastYearsRatings);
        const sumOfRatings = pastYearsRatings.reduce((acc, num) => acc + num, 0);
        const averageRating = Math.round((sumOfRatings / (daysPassed-daysWithoutARating))*100) / 100;
        return {
          averageRating: averageRating,
          lowestRating: lowestRating,
          highestRating: highestRating
        }
      }
  
      return {
        averageRating: 0,
        lowestRating: 0,
        highestRating: 0
      }
}