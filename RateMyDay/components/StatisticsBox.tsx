import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import useAuthStore from "@/stores/AuthStateStore";
import { useRatingStorePb } from "@/stores/RatingStorePb";
import useStore from "@/stores/isRatingSetStore";

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
  const { width, height } = useWindowDimensions();
  const aspectRatio = width / height;
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
    }
  }, [renderCondition, timerange, isRatingUpdated]);

  return (
    <View className="justify-center items-center">
      <View className="flex items-center pb-6">
        <Text
          className=" text-sky-800"
          style={{
            fontFamily: "Fredoka_400Regular",
            fontSize: 20 / aspectRatio,
          }}
        >
          Average Rating
        </Text>
        <Text
          className=" text-sky-900 mt-4"
          style={{ fontFamily: "Fredoka_700Bold", fontSize: 18 / aspectRatio }}
        >
          {stats.averageRating ? stats.averageRating : 0}
        </Text>
      </View>
      <View className="mt-5 flex-row justify-between w-full px-4">
        <View className="flex items-center">
          <Text
            className=" text-sky-800"
            style={{
              fontFamily: "Fredoka_400Regular",
              fontSize: 12 / aspectRatio,
            }}
          >
            Lowest Rating
          </Text>
          <Text
            className=" text-sky-900 mt-4"
            style={{
              fontFamily: "Fredoka_700Bold",
              fontSize: 12 / aspectRatio,
            }}
          >
            {stats.lowestRating ? stats.lowestRating : 0}
          </Text>
        </View>
        <View className="items-center">
          <Text
            className=" text-sky-800"
            style={{
              fontFamily: "Fredoka_400Regular",
              fontSize: 12 / aspectRatio,
            }}
          >
            Highest Rating
          </Text>
          <Text
            className=" text-sky-900 mt-4"
            style={{
              fontFamily: "Fredoka_700Bold",
              fontSize: 12 / aspectRatio,
            }}
          >
            {stats.highestRating ? stats.highestRating : 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StatisticsBox;
