import {
  View,
  Text,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useState } from "react";
import StatisticsBox from "@/components/StatisticsBox";
import { CalendarColors } from "@/constants/Colors";
import "../../global.css";
import { useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import GraphComponent from "@/components/GraphComponent";
import { getAllRatingsForUser } from "@/utills/PocketBase";
import useAuthStore from "@/stores/AuthStateStore";
import useStore from "@/stores/isRatingSetStore";
import {
  decryptData,
  getOrCreateEncryptionKey,
} from "@/utills/EncryptionService";

const calendar = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateRatings, setDateRatings] = useState<
    Record<
      string,
      {
        note: string;
        rating: number;
        selected: boolean;
        selectedColor: string;
      }
    >
  >({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const [timerange, setTimerange] = useState("Monthly");
  const [statsType, setStatsType] = useState("Numbers");
  const { session, encryptionKey, setEncryptionKey } = useAuthStore();
  const { isRatingUpdated } = useStore();
  const { width, height } = Dimensions.get("window");
  const aspectRatio = width / height;

  const decryptNote = async (note: string) => {
    if (!session) return note;
    if (!encryptionKey) {
      console.log("No encryption key found, Getting from backup...");
      const key = await getOrCreateEncryptionKey(session?.record.id);
      if (!key) return note;
      setEncryptionKey(key);
    }

    const decryptedNote = await decryptData(note, encryptionKey!);
    return decryptedNote;
  };

  const transformRatingsData = async () => {
    if (!session) return {};

    const ratingsData = await getAllRatingsForUser(session.record.id);

    const entries = await Promise.all(
      ratingsData.map(async (rating) => {
        const decrypted = await decryptNote(rating.note);
        const date = rating.date.split(" ")[0];
        return [
          date,
          {
            note: decrypted,
            rating: rating.rating,
            selected: true,
            selectedColor: CalendarColors[rating.rating],
          },
        ];
      })
    );

    const Data = Object.fromEntries(entries);
    return Data;
  };

  useEffect(() => {
    const fetchRatings = async () => {
      const transformedData = await transformRatingsData();
      setDateRatings(transformedData);
    };

    fetchRatings().then(() => {
      setHasLoaded(true);
    });
  }, [isRatingUpdated]);

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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="justify-center items-center pt-4">
          <Text
            className="text-teal-50 text-4xl"
            style={{
              fontFamily: "Fredoka_700Bold",
            }}
          >
            Overview of your days
          </Text>
          <Text
            className="text-xl text-teal-100"
            style={{ fontFamily: "Fredoka_400Regular" }}
          >
            Track how your days have been
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-shrink px-2">
            {hasLoaded ? (
              <Calendar
                markedDates={dateRatings}
                onDayPress={onDayPress}
                firstDay={1}
                hideDayNames={aspectRatio < 0.6 ? false : true}
                theme={{
                  calendarBackground: "#f1f5f9",
                  textSectionTitleColor: "#b6c1cd",
                  selectedDayBackgroundColor: "#037A4B",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#00D382",
                  dayTextColor: "#0369a1",
                  monthTextColor: "#075985",
                  dotColor: "red",
                  arrowColor: "#0084c7",
                  textDayFontFamily: "Fredoka_400Regular",
                  textMonthFontFamily: "Fredoka_700Bold",
                  textDayHeaderFontFamily: "Fredoka_400Regular",
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                style={{
                  borderRadius: 10,
                  marginVertical: 10,
                  paddingBottom: 1,
                }}
              />
            ) : (
              <View
                className="bg-white rounded-lg my-2.5 p-4 flex items-center justify-center"
                style={{ height: 350 }}
              >
                <ActivityIndicator size={60} color="#0084c7" />
              </View>
            )}
          </View>
          <View className="flex-1 px-4 py-3.5 rounded-t-3xl items-center bg-slate-100">
            <View className="flex-row w-full justify-center">
              <View className="absolute left-0 ">
                <TouchableOpacity className="w-8" onPress={handleIconPress}>
                  <Octicons
                    name={statsType === "Numbers" ? "graph" : "number"}
                    size={24}
                    color="#075985"
                  />
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-center self-center">
                <TouchableOpacity
                  className="mr-4 w-12 items-center"
                  onPress={handleLeftArrowPress}
                >
                  <AntDesign name="left" size={24} color="#0369a1" />
                </TouchableOpacity>
                <Text
                  className="align-middle w-20 text-center text-xl text-sky-900"
                  style={{
                    fontFamily: "Fredoka_700Bold",
                  }}
                >
                  {timerange}
                </Text>
                <TouchableOpacity
                  className="ml-4 w-12 items-center"
                  onPress={handleRightArrowPress}
                >
                  <AntDesign name="right" size={24} color="#0369a1" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-1 justify-center w-full">
              {statsType === "Numbers" && hasLoaded ? (
                <StatisticsBox
                  renderCondition={dateRatings}
                  timerange={timerange}
                />
              ) : statsType === "Graph" && hasLoaded ? (
                <GraphComponent timerange={timerange} />
              ) : (
                <ActivityIndicator size={60} />
              )}
            </View>
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
              <Text
                className="text-2xl text-sky-900 mb-4"
                style={{ fontFamily: "Fredoka_700Bold" }}
              >
                {selectedDate
                  ? `Rating for ${selectedDate}`
                  : "No Date Selected"}
              </Text>
              <Text
                className="text-4xl mb-4"
                style={{
                  fontFamily: "Fredoka_700Bold",
                  color:
                    selectedDate && dateRatings[selectedDate] !== undefined
                      ? CalendarColors[dateRatings[selectedDate].rating]
                      : "#3b82f6",
                }}
              >
                {selectedDate && dateRatings[selectedDate] !== undefined
                  ? dateRatings[selectedDate].rating
                  : "No rating"}
              </Text>
              <ScrollView style={{ maxHeight: 150, marginBottom: 4 }}>
                <Text
                  style={{ fontFamily: "Fredoka_400Regular" }}
                  className="text-lg text-gray-600"
                >
                  {selectedDate &&
                    dateRatings[selectedDate] !== undefined &&
                    dateRatings[selectedDate].note !== ""
                    ? dateRatings[selectedDate].note
                    : "No note was given for this day"}
                </Text>
              </ScrollView>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedDate(null);
                }}
                className="bg-sky-800 px-4 py-2 rounded-md mt-4"
              >
                <Text
                  className="text-white text-lg"
                  style={{ fontFamily: "Fredoka_400Regular" }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default calendar;
