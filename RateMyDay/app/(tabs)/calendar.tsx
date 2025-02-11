import {
  View,
  Text,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useMemo, useState } from "react";
import StatisticsBox from "@/components/StatisticsBox";
import { CalendarColors } from "@/constants/Colors";
import { useRatingStore } from "@/stores/RatingStore";
import "../../global.css";
import { useStorageSavedDates } from "@/hooks/useStorageSavedDates";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import GraphComponent from "@/components/GraphComponent";

const calendar = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const storedDateRatings = useRatingStore((state) => state.savedRatings);
  const isFocused = useIsFocused();
  const storageSavedDates = useStorageSavedDates(isFocused);
  const setStoredDateRatings = useRatingStore((state) => state.setSavedRatings);
  const [timerange, setTimerange] = useState("Monthly");
  const [statsType, setStatsType] = useState("Numbers");

  useEffect(() => {
    setStoredDateRatings(storageSavedDates);
  }, [storageSavedDates]);

  const getRatingForDate = useMemo(() => {
    const ratingForDate =
      selectedDate && storedDateRatings
        ? storedDateRatings[selectedDate]?.rating
        : null;

    return ratingForDate;
  }, [selectedDate]);

  const getNoteForDate = useMemo(() => {
    return selectedDate && storedDateRatings
      ? storedDateRatings[selectedDate]?.note
      : null;
  }, [selectedDate]);

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleLeftArrowPress = () => {
    setTimerange((prev) =>
      prev === "Yearly" ? "Monthly" : prev === "Monthly" ? "Weekly" : "Yearly"
    );
  };

  const handleRightArrowPress = () => {
    setTimerange((prev) =>
      prev === "Weekly" ? "Monthly" : prev === "Monthly" ? "Yearly" : "Weekly"
    );
  };

  const handleIconPress = () => {
    setStatsType((prev) => (prev === "Numbers" ? "Graph" : "Numbers"));
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-900">
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
            firstDay={1}
            theme={{
              calendarBackground: "white",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: "#037A4B",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#00D382",
              dayTextColor: "#2d4150",
              dotColor: "red",
              arrowColor: "#0084c7",
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
        <View className="flex-1 px-4 py-3.5 rounded-t-3xl shadow-gray-800 max-w-full max-h-full items-center bg-white">
          <View className="flex-row w-full relative justify-center">
            <View className="absolute left-0 ">
              <TouchableOpacity className="w-8" onPress={handleIconPress}>
                <Octicons
                  name={statsType === "Numbers" ? "graph" : "number"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-center self-center">
              <TouchableOpacity className="mr-4" onPress={handleLeftArrowPress}>
                <AntDesign name="left" size={24} color="black" />
              </TouchableOpacity>
              <Text className="align-middle w-20 text-center text-xl">
                {timerange}
              </Text>
              <TouchableOpacity
                className="ml-4"
                onPress={handleRightArrowPress}
              >
                <AntDesign name="right" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          {statsType === "Numbers" ? (
            <StatisticsBox
              renderCondition={storedDateRatings}
              timerange={timerange}
            />
          ) : (
            <GraphComponent timerange={timerange} />
          )}
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
              className="text-4xl font-bold mb-4"
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
            <ScrollView style={{ maxHeight: 150, marginBottom: 4 }}>
              <Text className="text-lg text-gray-600">
                {selectedDate && getNoteForDate !== null ? getNoteForDate : ""}
              </Text>
            </ScrollView>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSelectedDate(null);
              }}
              className="bg-sky-800 px-4 py-2 rounded-md"
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
