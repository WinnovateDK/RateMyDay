import {
  View,
  Text,
  SafeAreaView,
  Modal,
  Button,
  TouchableOpacity,
} from "react-native";
import { Calendar, CalendarList } from "react-native-calendars";
import { useState } from "react";
import StatisticsBox from "@/components/StatisticsBox";

const calendar = () => {
  const colors = [
    "#FF0000",
    "#FF4000",
    "#FF8000",
    "#FFBF00",
    "#FFFF00",
    "#BFFF00",
    "#80FF00",
    "#40FF00",
    "#00FF00",
    "#00BF00",
  ];

  const markedDates: Record<
    string,
    { rating: number; selected: boolean; selectedColor: string }
  > = {
    "2024-11-18": { rating: 10, selected: true, selectedColor: colors[9] },
    "2024-11-17": { rating: 5, selected: true, selectedColor: colors[4] },
    "2024-11-16": { rating: 1, selected: true, selectedColor: colors[0] },
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getRatingForDate = (date: string) => markedDates[date]?.rating;

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-300">
      {/* Top Section */}
      <View className="h-1/6 justify-center items-center pt-10">
        <Text className="text-4xl font-bold text-gray-500">
          Overview of your days
        </Text>
        <Text className="text-xl text-gray-300">
          Track how your days have been
        </Text>
      </View>

      <View className="flex-1 ">
        <View className="flex-1/2 px-2">
          <Calendar
            markedDates={markedDates}
            onDayPress={onDayPress}
            theme={{
              calendarBackground: "white",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#00adf5",
              dayTextColor: "#2d4150",
              dotColor: "red",
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
            averageRating={6.4}
            lowestRating={1}
            highestRating={10}
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
                  selectedDate && getRatingForDate(selectedDate) !== undefined
                    ? colors[getRatingForDate(selectedDate) - 1]
                    : "#3b82f6",
              }}
            >
              {selectedDate && getRatingForDate(selectedDate) !== undefined
                ? getRatingForDate(selectedDate)
                : "No rating"}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-blue-500 px-4 py-2 rounded-md"
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
