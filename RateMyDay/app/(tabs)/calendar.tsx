import {
  View,
  Text,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useMemo, useState } from "react";
import StatisticsBox from "@/components/StatisticsBox";
import { CalendarColors, RMDColors } from "@/constants/Colors";
import { useRatingStore } from "@/stores/RatingStore";
import "../../global.css";
import { useStorageSavedDates } from '@/hooks/useStorageSavedDates';
import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';

const calendar = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const storedDateRatings = useRatingStore((state) => state.savedRatings);
  const isFocused = useIsFocused();
  const storageSavedDates = useStorageSavedDates(isFocused);
  const setStoredDateRatings = useRatingStore((state) => state.setSavedRatings);

  useEffect(()=>{
    setStoredDateRatings(storageSavedDates);
  }, [storageSavedDates])

  const getRatingForDate = useMemo(() => {
    const ratingForDate = selectedDate && storedDateRatings ? storedDateRatings[selectedDate]?.rating : null;
    
    return ratingForDate;
  }, [selectedDate]);

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    console.log("selected date: ", day.dateString);
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-teal-900">
      {/* Top Section */}
      <View className="h-1/6 justify-center items-center pt-10">
        <Text className="text-4xl font-bold text-teal-50">
          Overview of your days
        </Text>
        <Text className="text-xl text-teal-100">
          Track how your days have been
        </Text>
      </View>

      <View className="flex-1 ">
        <View className="flex-1/2 px-2">
          <Calendar
            markedDates={storedDateRatings}
            onDayPress={onDayPress}
            theme={{
              calendarBackground: "white",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: RMDColors.rmdMid,
              selectedDayTextColor: "#ffffff",
              todayTextColor: RMDColors.rmdLighter,
              dayTextColor: "#2d4150",
              dotColor: "red",
              arrowColor: RMDColors.rmdMid
            }}
            style={{
              borderRadius: 10,
              overflow: "hidden",
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              marginVertical: 10,
            }}
          />
        </View>
        <View className="flex-1 mt-4 max-h-full">
          <StatisticsBox
          />
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg items-center w-4/5">
            <Text className="text-lg font-bold text-gray-700 mb-4">
              {selectedDate ? `Rating for ${selectedDate}` : "No Date Selected"}
            </Text>
            <Text
              className="text-4xl font-bold mb-6"
              style={{
                color:
                  selectedDate && getRatingForDate !== null
                    ? CalendarColors[getRatingForDate - 1]
                    : "#3b82f6",
              }}
            >
              {selectedDate && getRatingForDate !== null
                ? getRatingForDate
                : "No rating"}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-teal-800 px-4 py-2 rounded-md"
            >
              <Text className="text-white text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default calendar;
