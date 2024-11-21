import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { getItem, setItem } from "@/utills/AsyncStorage";

const AddRatingComponent: React.FC = () => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const setScore = async (score: Number) => {
    const dateObject = new Date();
    const dateMonthYear = `${dateObject.getUTCDate()}${
      dateObject.getUTCMonth() + 1
    }${dateObject.getUTCFullYear()}`;
    await setItem(`rating${dateMonthYear}`, selectedScore);
  };

  const handleSubmit = () => {
    if (selectedScore === null) {
      Alert.alert("Error", "Please select a value before submitting.");
    } else {
      setScore(selectedScore);
      Alert.alert("Success", `You submitted: ${selectedScore}`);
    }
  };

  const renderScale = () => {
    const totalCircles = 11;
    return Array.from({ length: 11 }, (_, index) => (
      <TouchableOpacity
        key={index}
        className={`aspect-square rounded-full justify-center items-center mx-1 ${
          selectedScore === index ? "bg-blue-500" : "bg-gray-300"
        }`}
        style={{
          width: `${100 / totalCircles}%`,
        }}
        onPress={() => setSelectedScore(index)}
      >
        <Text className="text-base text-white font-bold">{index}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className="text-xl font-bold mb-5">How has your day been?</Text>
      <View className="flex-1 flex-row justify-center items-center mb-5 max-w-full">
        {renderScale()}
      </View>
      <Button title="Add" onPress={handleSubmit} />
      <Text>{selectedScore}</Text>
    </View>
  );
};

export default AddRatingComponent;
