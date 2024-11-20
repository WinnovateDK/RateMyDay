import React, { useState } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

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
          <Text className="text-4xl text-gray-600">Average Rating</Text>
          <Text className="text-4xl font-bold text-gray-900 mt-4">
            {averageRating}
          </Text>
        </View>
        <View className="mt-5 flex-row justify-between w-full px-4">
          <View className="flex items-center">
            <Text className="text-xl text-gray-600">Lowest Rating</Text>
            <Text className="text-2xl font-bold text-gray-900 mt-4">
              {lowestRating}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xl text-gray-600">Highest Rating</Text>
            <Text className="text-2xl font-bold text-gray-900 mt-4">
              {highestRating}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StatisticsBox;
