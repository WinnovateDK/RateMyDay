import React, { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  calculateAverageRatingForWeek,
  calculateAverageRatingForWeekPb,
  calculateAverageRatingForMonth,
  calculateAverageRatingForYear,
} from "@/utills/RatingService";
import useAuthStore from "@/stores/AuthStateStore";
import {
  calculateAverageRatingForMonthPb,
  calculateAverageRatingForYearPb,
} from "@/utills/PocketBase";

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

  const { session } = useAuthStore();
  useEffect(() => {
    if (session) {
      switch (timerange) {
        case "Weekly":
          calculateAverageRatingForWeekPb(session.record.id).then(
            (avgRatings) => {
              setStats({
                averageRating: avgRatings.averageRating,
                highestRating: avgRatings.highestRating,
                lowestRating: avgRatings.lowestRating,
              });
            }
          );

          break;

        case "Monthly":
          calculateAverageRatingForMonthPb(session.record.id).then(
            (avgRatings) => {
              setStats({
                averageRating: avgRatings.averageRating,
                highestRating: avgRatings.highestRating,
                lowestRating: avgRatings.lowestRating,
              });
            }
          );
          break;

        case "Yearly":
          calculateAverageRatingForYearPb(session.record.id).then(
            (avgRatings) => {
              setStats({
                averageRating: avgRatings.averageRating,
                highestRating: avgRatings.highestRating,
                lowestRating: avgRatings.lowestRating,
              });
            }
          );
          break;
      }
    }
  }, [renderCondition, timerange]);

  return (
    <View className="justify-center items-center">
      <View className="flex items-center">
        <Text className="text-4xl text-sky-800">Average Rating</Text>
        <Text className="text-4xl font-bold text-sky-900 mt-4">
          {stats.averageRating ? stats.averageRating : 0}
        </Text>
      </View>
      <View className="mt-5 flex-row justify-between w-full px-4">
        <View className="flex items-center">
          <Text className="text-xl text-sky-800">Lowest Rating</Text>
          <Text className="text-2xl font-bold text-sky-900 mt-4">
            {stats.lowestRating ? stats.lowestRating : 0}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xl text-sky-800">Highest Rating</Text>
          <Text className="text-2xl font-bold text-sky-900 mt-4">
            {stats.highestRating ? stats.highestRating : 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StatisticsBox;
