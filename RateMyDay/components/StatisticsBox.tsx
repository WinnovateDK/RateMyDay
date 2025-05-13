import React, { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import useAuthStore from "@/stores/AuthStateStore";
import { useRatingStorePb } from "@/stores/RatingStorePb";
import useStore from "@/stores/isRatingSetStore";
import {
  calculateAverageRatingForMonth,
  calculateAverageRatingForWeek,
  calculateAverageRatingForYear,
} from "@/utills/RatingService";

type Stats = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
};

const StatisticsBox = ({
  renderCondition,
  timerange,
}: {
  renderCondition: any;
  timerange: string;
}) => {
  const [stats, setStats] = useState<Stats>({
    averageRating: 0,
    highestRating: 0,
    lowestRating: 0,
  });
  const { weeklyRatings, monthlyRatings, yearlyRatings } = useRatingStorePb();
  const { isRatingUpdated } = useStore();
  const { session } = useAuthStore();
  useEffect(() => {
    if (session) {
      switch (timerange) {
        case "Weekly":
          setStats(weeklyRatings);
          break;

        case "Monthly":
          setStats(monthlyRatings);
          break;

        case "Yearly":
          setStats(yearlyRatings);
          break;
      }
    } else {
      switch (timerange) {
        case "Weekly":
          calculateAverageRatingForWeek().then((avgRatings) => {
            setStats({
              averageRating: avgRatings.averageRating,
              highestRating: avgRatings.highestRating,
              lowestRating: avgRatings.lowestRating,
            });
          });
          break;

        case "Monthly":
          calculateAverageRatingForMonth().then((avgRatings) => {
            setStats({
              averageRating: avgRatings.averageRating,
              highestRating: avgRatings.highestRating,
              lowestRating: avgRatings.lowestRating,
            });
          });
          break;

        case "Yearly":
          calculateAverageRatingForYear().then((avgRatings) => {
            setStats({
              averageRating: avgRatings.averageRating,
              highestRating: avgRatings.highestRating,
              lowestRating: avgRatings.lowestRating,
            });
          });
          break;
      }
    }
  }, [renderCondition, timerange, isRatingUpdated]);

  return (
    <View className="justify-center items-center">
      <View className="flex items-center pb-12">
        <Text className="text-5xl text-sky-800" style={{fontFamily: 'Fredoka_400Regular'}}>Average Rating</Text>
        <Text className="text-5xl text-sky-900 mt-4" style={{fontFamily: 'Fredoka_700Bold'}}>
          {stats.averageRating ? stats.averageRating : 0}
        </Text>
      </View>
      <View className="mt-5 flex-row justify-between w-full px-4">
        <View className="flex items-center">
          <Text className="text-2xl text-sky-800" style={{fontFamily: 'Fredoka_400Regular'}}>Lowest Rating</Text>
          <Text className="text-4xl text-sky-900 mt-4" style={{fontFamily: 'Fredoka_700Bold'}}>
            {stats.lowestRating ? stats.lowestRating : 0}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl text-sky-800" style={{fontFamily: 'Fredoka_400Regular'}}>Highest Rating</Text>
          <Text className="text-4xl text-sky-900 mt-4" style={{fontFamily: 'Fredoka_700Bold'}}>
            {stats.highestRating ? stats.highestRating : 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StatisticsBox;
