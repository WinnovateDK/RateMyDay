import React from "react";
import { View, Text } from "react-native";

type Stats = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
};

const StatisticsBox = ({
  averageRating,
  highestRating,
  lowestRating,
}: Stats) => {
  return (
    <View className="mt-4 p-4 rounded-lg border-2 border-gray-200 max-w-full max-h-full justify-center items-center">
      <Text className="text-xl font-semibold text-gray-800">Your stats</Text>
      <View className="mt-2">
        <Text className="text-sm text-gray-600">
          Average Rating:{" "}
          <Text className="font-bold text-gray-900">{averageRating}</Text>
        </Text>
        <Text className="text-sm text-gray-600">
          Highest Rating:{" "}
          <Text className="font-bold text-gray-900">{highestRating}</Text>
        </Text>
        <Text className="text-sm text-gray-600">
          Lowest Rating:{" "}
          <Text className="font-bold text-gray-900">{lowestRating}</Text>
        </Text>
      </View>
    </View>
  );
};

export default StatisticsBox;
