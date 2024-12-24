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

type rateDatePair = {
  rating: number,
  date: string
}


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

export async function getRatingsforLastMonth(): Promise<rateDatePair[]> {
  let daysPassed = daysPassedThisMonth();
  const datesInPastMonth = getDatesInCurrentMonth();
  const isRatingTodaySet = await isRatingSetToday();
  const pastMontsRatings: rateDatePair[] = [];
  let daysWithoutARating = 0;

    if (isRatingTodaySet){
      daysPassed += 1
    }
    
    if(daysPassed > 0){
      for(let i=0; i < daysPassed; i++){
        const rating = await getItem(datesInPastMonth[i]).then((rating) => {
          if(rating===null){
              daysWithoutARating += 1
              const tempRating = interpolateRating(pastMontsRatings, i, datesInPastMonth).then((rating) => {
                return rating;
              });
              return tempRating;
          }
          return rating;
        });
        
        const dateRate: rateDatePair = {rating: parseInt(rating), date: datesInPastMonth[i]} 
        pastMontsRatings.push(dateRate);
        
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
          pastWeeksRatings.push({rating: parseInt(rating), date: datesInPastWeek[i]});
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
  let daysWithoutARating = 0

  if (isRatingTodaySet){
      daysPassed += 1
    }
    
    if(daysPassed > 0){
      for(let i=0; i < daysPassed; i++){
        const rating = await getItem(datesInPastYear[i]).then((rating) => {
          if(rating===null){
              daysWithoutARating += 1
              const tempRating = interpolateRating(pastYearsRatings, i, datesInPastYear).then((rating) => {
                return rating;
              });
              
              return tempRating;
          }
          return rating;
        });
        
        pastYearsRatings.push({rating: rating !== null ? parseInt(rating) : rating, date: datesInPastYear[i]});
      }
    }
    return pastYearsRatings;
}

export async function getAverageRatingsPerMonth(): Promise<number[]> {
  const ratings = await getRatingsForLastYear();
  const monthlyRatings: { [key: string]: number[] } = {};

  ratings.forEach(({ rating, date }) => {
    const month = new Date(date).getMonth();
    if (rating !== null) {
      if (!monthlyRatings[month]) {
        monthlyRatings[month] = [];
      }
      monthlyRatings[month].push(rating);
    }
  });

  const averageRatings: number[] = [];
  for (let month = 0; month < 12; month++) {
    if (monthlyRatings[month] && monthlyRatings[month].length > 0) {
      const sum = monthlyRatings[month].reduce((acc, rating) => acc + rating, 0);

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

export async function interpolateRating(ratings: { rating: number | null, date: string }[], index: number, dates: string[]): Promise<number> {
  const maxRange = 3;
  let previousValue: number | null = null;
  let nextValue: number | null = null;

  // Search for previous value within the range
  try {
    for (let i = 1; i <= maxRange; i++) {
      if (index - i >= 0 && ratings[index - i].rating !== null && ratings[index - i].rating !== undefined && ratings[index - i].rating !== 0) {
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
        const nextRating = await getItem(dates[index+ i]).then((rating) => {
          return rating;
        });
        if(nextRating !== null && nextRating !== undefined){
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


