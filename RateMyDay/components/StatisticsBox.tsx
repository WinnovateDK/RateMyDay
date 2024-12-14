import React, { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getItem } from "@/utills/AsyncStorage";

type Stats = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
};

const StatisticsBox = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [stats, setStats] = useState<Stats>({averageRating: 0, highestRating: 0, lowestRating: 0})

  const daysPassedThisWeek = (): number =>  {
    const today = new Date();
    let currentDayOfWeek = today.getDay();     
    currentDayOfWeek = (currentDayOfWeek === 0) ? 6 : currentDayOfWeek - 1;
    return currentDayOfWeek;
  }

  function getDatesInCurrentWeek(): string[] {
    const today = new Date();
    const dayOfWeek = today.getDay();
  
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
    const monday = new Date(today);
    monday.setDate(today.getDate() - adjustedDayOfWeek);
  
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
  
      const year = currentDay.getFullYear();
      const month = String(currentDay.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const date = String(currentDay.getDate()).padStart(2, "0");
  
      dates.push(`${year}-${month}-${date}`);
    }
  
    return dates;
  }

  const handleGetTodaysRating = async () => {
    const dateObject = new Date();
    const day = dateObject.getUTCDate() < 10 ? `0${dateObject.getUTCDate()}` : dateObject.getUTCDate();
    const yearMonthDate = `${dateObject.getUTCFullYear()}-${
      dateObject.getUTCMonth() + 1
    }-${day}`;
    const rating = await getItem(`${yearMonthDate}`).then((rating) => {
      const stringRating = '' + rating;
      return rating;
    });
    return rating;
  };

  const isRatingSetToday = async (): Promise<boolean> => {
    const isTodaysRatingSet = handleGetTodaysRating().then((rating) => {
      if(rating === null){
        return false
      }
      return true
    });

    return isTodaysRatingSet
  }

  function getDaysInCurrentMonth(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }


  async function calculateAverageRatingForWeek() {
    let daysPassed = daysPassedThisWeek();
    const datesInPastWeek = getDatesInCurrentWeek();
    const isRatingTodaySet = await isRatingSetToday();
    const pastWeeksRatings: number[] = [];

    if (isRatingTodaySet){
      daysPassed += 1
    }
    
    if(daysPassed > 0){
      for(let i=0; i < daysPassed; i++){
        const rating = await getItem(datesInPastWeek[i]).then((rating) => {
          return rating;
        });
        pastWeeksRatings.push(parseInt(rating));
      }

      const highestRating = Math.max(...pastWeeksRatings);
      const lowestRating = Math.min(...pastWeeksRatings);
      const sumOfRatings = pastWeeksRatings.reduce((acc, num) => acc + num, 0);
      const averageRating = (sumOfRatings / daysPassed);
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

  useEffect(() => {
    switch (selectedPeriod) {
      case "weekly":
        calculateAverageRatingForWeek().then((avgRatings) => {
          setStats({
            averageRating: avgRatings.averageRating, 
            highestRating: avgRatings.highestRating, 
            lowestRating: avgRatings.lowestRating
          });
        });
        break;

      case "monthly":
        setStats({
          averageRating: 0, 
          highestRating: 0, 
          lowestRating: 0
        });
        break;

      case "yearly":
        setStats({
          averageRating: 0, 
          highestRating: 0, 
          lowestRating: 0
        });
        break;    
    }    
  }, [selectedPeriod]);
  
  return (
    <View className="flex-1 px-4 py-3.5 rounded-t-3xl shadow-gray-800 max-w-full max-h-full items-center bg-white">
      <View className="absolute top-0 right-0">
        <Picker
          selectedValue={selectedPeriod}
          onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
          style={{ width: 140, height: 40 }}
        >
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Yearly" value="yearly" />
        </Picker>
      </View>

      <View className="w-full items-center">
        <Text className="text-xl font-semibold text-gray-800">Your stats</Text>
      </View>
      <View className="justify-center items-center h-full">
        <View className="flex items-center">
          <Text className="text-4xl text-teal-800">Average Rating</Text>
          <Text className="text-4xl font-bold text-teal-900 mt-4">
            {stats.averageRating}
          </Text>
        </View>
        <View className="mt-5 flex-row justify-between w-full px-4">
          <View className="flex items-center">
            <Text className="text-xl text-teal-800">Lowest Rating</Text>
            <Text className="text-2xl font-bold text-teal-900 mt-4">
              {stats.lowestRating}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xl text-teal-800">Highest Rating</Text>
            <Text className="text-2xl font-bold text-teal-900 mt-4">
              {stats.highestRating}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StatisticsBox;
