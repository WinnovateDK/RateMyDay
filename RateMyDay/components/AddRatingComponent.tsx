import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  NativeScrollEvent,
} from "react-native";
import { setItem, removeItem } from "@/utills/AsyncStorage";
import { useRatingStore } from "@/stores/RatingStore";
import { CalendarColors } from "@/constants/Colors";
import { formatDate, isRatingSetToday } from "@/utills/CalendarUtills";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useIsFocused } from "@react-navigation/native";
import { shadowStyle } from "@/constants/Colors";
import { useWindowDimensions, ActivityIndicator } from "react-native";
import {
  createRating,
  getRatingByDate,
  updateRating,
} from "@/utills/PocketBase";
import useAuthStore from "@/stores/AuthStateStore";
import { RecordModel } from "pocketbase";
import useStore from "@/stores/isRatingSetStore";
import { useRatingStorePb } from "@/stores/RatingStorePb";

const AddRatingComponent: React.FC = () => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const updateSavedRating = useRatingStore((state) => state.updateSavedRating);
  const [noteText, setNoteText] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [scrollEnd, setScrollEnd] = useState(false);
  const [scrollStart, setScrollStart] = useState(false);
  const [updateOrAdd, setUpdateOrAdd] = useState("Add");
  const isFocused = useIsFocused();
  const [scoreSet, setScoreSet] = useState<boolean>();
  const { width, height } = useWindowDimensions();
  const { session, isGuest } = useAuthStore();
  const {
    setWeeklyRatings,
    setMonthlyRatings,
    setYearlyRatings,
    setGraphWeeklyRatings,
    setGraphMonthlyRatings,
    setGraphYearlyRatings,
  } = useRatingStorePb();
  const today = new Date();
  const { setRatingUpdated } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const buttonSize = Math.ceil(width * 0.14);
  const contentOffsetX = width / 2 + buttonSize / 2;
  const aspectRatio = width / height;

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
    updateSavedRating(key, newRating);
  };

  const setRatingPb = async () => {
    if (session && selectedScore) {
      await createRating(session?.record.id, selectedScore, note);
    }
  };

  const updateRatingPb = async (todaysRating: RecordModel) => {
    if (session && selectedScore) {
      await updateRating(todaysRating.id, selectedScore, note);
    }
  };

  const handleSubmitPb = async () => {
    if (session && selectedScore) {
      setIsLoading(true);
      const todaysRating = await getRatingByDate(session.record.id, today);
      if (!todaysRating) setRatingPb();
      else updateRatingPb(todaysRating);
      await setWeeklyRatings(session.record.id);
      await setMonthlyRatings(session.record.id);
      await setYearlyRatings(session.record.id);
      await setGraphWeeklyRatings(session.record.id);
      await setGraphMonthlyRatings(session.record.id);
      await setGraphYearlyRatings(session.record.id);
      setRatingUpdated();
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedScore === null) {
      Alert.alert("Error", "Please select a value before submitting.");
    } else {
      setScore(selectedScore);
      Alert.alert("Success", `You submitted: ${selectedScore}`);
      setScoreSet(true);
    }
  };

  const handleScroll = ({
    nativeEvent,
  }: {
    nativeEvent: NativeScrollEvent;
  }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isEndReached =
      contentOffset.x + layoutMeasurement.width >= contentSize.width - 5;
    const isStartReached = contentOffset.x <= 5;

    if (scrollEnd !== isEndReached) {
      setScrollEnd(isEndReached);
    }
    if (scrollStart !== isStartReached) {
      setScrollStart(isStartReached);
    }
  };
  // useEffect(() => {
  //   const date = new Date();
  //   const formatteddate = formatDate(date);
  //   removeItem(`${formatteddate}`);

  //   console.log("removed item");
  // }, []);

  useEffect(() => {
    isRatingSetToday().then((isSet) => {
      if (isSet === true) {
        setUpdateOrAdd("Update");
      } else {
        setUpdateOrAdd("Add");
      }
    });
  }, [isFocused, scoreSet]);

  const renderScale = () => {
    const totalCircles = 11;
    return Array.from({ length: totalCircles }, (_, index) => (
      <TouchableOpacity
        key={index}
        className={`aspect-square rounded-full justify-center items-center mx-2 ${
          selectedScore === index ? "bg-cyan-700" : "bg-cyan-300"
        } shadow-lg`}
        onPress={() => setSelectedScore(index)}
        style={{ width: buttonSize, height: buttonSize }}
      >
        <Text className="text-2xl text-white font-bold">{index}</Text>
      </TouchableOpacity>
    ));
  };
  return (
    <View className="flex-1 items-center px-4 pb-8">
      <View style={{ height: aspectRatio < 0.6 ? "50%" : 130 }}>
        <View className="flex-row w-full justify-between px-2.5">
          <AntDesign
            name="arrowleft"
            size={18}
            color={scrollStart === true ? "transparent" : "#0a9396"}
          />

          <AntDesign
            name="arrowright"
            size={18}
            color={scrollEnd === true ? "transparent" : "#0a9396"}
          />
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4 py-2"
          contentOffset={{ x: contentOffsetX, y: 0 }}
          fadingEdgeLength={80}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className="flex-row justify-center items-center pb-6">
            {renderScale()}
          </View>
        </ScrollView>
      </View>

      <View className="w-full">
        <TextInput
          className="h-32  bg-cyan-200 border border-gray-300 rounded-3xl p-4 text-lg text-gray-700"
          placeholder="Enter a note for the day (optional)"
          value={noteText}
          onChangeText={(txt) => {
            setNoteText(txt);
            setNote(txt);
          }}
          multiline={true}
          style={shadowStyle}
        />
      </View>

      <View
        className="justify-center w-full items-center"
        style={{ height: aspectRatio < 0.6 ? "40%" : 90 }}
      >
        <TouchableOpacity
          className="w-1/6 aspect-square rounded-full items-center justify-center bg-[#67e8f9]"
          onPress={!isGuest ? handleSubmitPb : handleSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <AntDesign name="plus" size={40} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddRatingComponent;
