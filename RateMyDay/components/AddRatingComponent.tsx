import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  TextInput,
} from "react-native";
import { setItem, removeItem } from "@/utills/AsyncStorage";
import { useRatingStore } from "@/stores/RatingStore";
import { CalendarColors, RMDColors } from "@/constants/Colors";
import {
  formatDate,
  getDatesInCurrentMonth,
  getDatesInCurrentYear,
} from "@/utills/CalendarUtills";

const AddRatingComponent: React.FC = () => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const updateSavedRating = useRatingStore((state) => state.updateSavedRating);
  const [note, setNote] = useState<string>("");

  const setScore = async (score: Number) => {
    const dateObject = new Date();
    const formattedDate = formatDate(dateObject);
    await setItem(`${formattedDate}`, selectedScore, note);
    const key = formattedDate;
    const newRating = {
      rating: selectedScore!,
      note: note,
      selected: true,
      selectedColor: CalendarColors[selectedScore! - 1],
    };
    //removeItem("2024-12-05");
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
        className={`aspect-square rounded-full  justify-center items-center mx-auto ${
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
    <View className="flex-1 justify-center items-center">
      <View className="flex-row justify-center items-center mb-5">
        {renderScale()}
      </View>
      <View className="flex-1 w-full items-center justify-items-center">
        <TextInput
          className="w-full h-36  bg-emerald-100 border border-gray-300 rounded-md my-2 px-2 text-center mb-5"
          placeholder="Enter a note for the day (optional)"
          value={note}
          onChangeText={setNote}
          multiline={true}
        />
        <TouchableOpacity
          className="w-32 h-12 bg-emerald-900 rounded-md items-center justify-center mt-2"
          onPress={handleSubmit}
        >
          <Text className="text-white">Add Rating</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddRatingComponent;
