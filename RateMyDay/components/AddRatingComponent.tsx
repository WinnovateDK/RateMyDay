import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { setItem } from "@/utills/AsyncStorage";
import { useRatingStore } from "@/stores/RatingStore";
import { CalendarColors, RMDColors } from "@/constants/Colors";

const AddRatingComponent: React.FC = () => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const updateSavedRating = useRatingStore((state) => state.updateSavedRating);

  const setScore = async (score: Number) => {
    const dateObject = new Date();
    const day = dateObject.getUTCDate() < 10 ? `0${dateObject.getUTCDate()}` : dateObject.getUTCDate();
    const yearMonthDate = `${dateObject.getUTCFullYear()}-${
      dateObject.getUTCMonth() + 1
    }-${day}`;
    await setItem(`${yearMonthDate}`, selectedScore);
    const key = yearMonthDate;
    const newRating = {
      rating: selectedScore!,
      selected: true,
      selectedColor: CalendarColors[selectedScore! - 1],
    };
    
    updateSavedRating(key, newRating);
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
          selectedScore === index ? "bg-emerald-900" : "bg-emerald-700"
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
    <View className="flex-1 justify-center items-center p-5 pt-10">
      <View className="flex-row justify-center items-center mb-5">
        {renderScale()}
      </View>
      <View className="pt-8">
        <TouchableOpacity 
          className="w-32 h-12 bg-emerald-900 rounded-md items-center justify-center" 
          onPress={handleSubmit}
          >
          <Text className="text-white">Add</Text>
        </TouchableOpacity>
      </View>
      <Text>{selectedScore}</Text>
    </View>
  );
};

export default AddRatingComponent;
