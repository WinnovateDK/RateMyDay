import { View, Text } from "react-native";
import { Calendar, CalendarList } from "react-native-calendars";
import StatisticsBox from "@/components/StatisticsBox";
import "../../global.css";

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

  const markedDates = {
    "2024-11-18": {
      rating: 10,
      selected: true,
      selectedColor: colors[9],
    },
    "2024-11-17": {
      rating: 5,
      selected: true,
      selectedColor: colors[4],
    },
    "2024-11-16": {
      rating: 1,
      selected: true,
      selectedColor: colors[2],
    },
  };
  return (
    <View className="flex-1 bg-white px-4 py-6">
      <View className="h-1/6 mb-4 justify-center items-center">
        <Text className="text-xl font-bold text-gray-800">
          Overview of your days
        </Text>
        <Text className="text-sm text-gray-500">
          Track how you days have been
        </Text>
      </View>
      <View className="flex-1">
        <Calendar
          markedDates={markedDates}
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

      <StatisticsBox averageRating={6.4} lowestRating={1} highestRating={10} />
    </View>
  );
};

export default calendar;
