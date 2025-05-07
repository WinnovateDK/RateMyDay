import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Text,
  ScrollView,
  NativeScrollEvent,
  Animated,
} from "react-native";
import { setItem } from "@/utills/AsyncStorage";
import { useRatingStore } from "@/stores/RatingStore";
import { CalendarColors } from "@/constants/Colors";
import { formatDate, isRatingSetToday } from "@/utills/CalendarUtills";
import AntDesign from "@expo/vector-icons/AntDesign";
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
import {
  decryptData,
  getOrCreateEncryptionKey,
} from "@/utills/EncryptionService";
import { Dialog, DialogContent } from "./Dialog";

const AddRatingComponent: React.FC = () => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const updateSavedRating = useRatingStore((state) => state.updateSavedRating);
  const [noteText, setNoteText] = useState<string>("");
  const [scrollEnd, setScrollEnd] = useState(false);
  const [scrollStart, setScrollStart] = useState(false);
  const [updateOrAdd, setUpdateOrAdd] = useState("Add");
  const [showNote, setShowNote] = useState(false);
  const [scoreSet, setScoreSet] = useState<boolean>();
  const { width, height } = useWindowDimensions();
  const { session, isGuest, encryptionKey, setEncryptionKey } = useAuthStore();
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [currentAddIcon, setCurrentAddIcon] = useState('check');
  const [currentNoteIcon, setCurrentNoteIcon] = useState('edit');
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [todaysRating, setTodaysRating] = useState<RecordModel | null>(null);
  const buttonSize = Math.ceil(width * 0.15);
  const contentOffsetX = width / 2 + buttonSize / 2;
  const aspectRatio = width / height;

  const setScore = async (score: Number) => {
    const dateObject = new Date();
    const formattedDate = formatDate(dateObject);
    await setItem(`${formattedDate}`, selectedScore, noteText);
    const key = formattedDate;
    const newRating = {
      rating: selectedScore!,
      note: noteText,
      selected: true,
      selectedColor: CalendarColors[selectedScore! - 1],
    };
    updateSavedRating(key, newRating);
  };

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

  const fetchTodaysRating = async () => {
    if (session) {
      const todaysRating = await getRatingByDate(session.record.id, today);
      if (todaysRating) {
        setTodaysRating(todaysRating);
        decryptNote(todaysRating.note).then((decrypted) => {
          setNoteText(decrypted);
        });
      } else {
        setTodaysRating(null);
        setNoteText("");
      }
    }
  };

  const setRatingPb = async () => {
    if (session && selectedScore !== null) {
      await createRating(
        session?.record.id,
        selectedScore,
        noteText,
        encryptionKey
      );
    }
  };

  const updateRatingPb = async (userId: string, todaysRating: RecordModel) => {
    if (session && selectedScore !== null) {
      console.log("score", selectedScore);
      await updateRating(
        userId,
        todaysRating.id,
        selectedScore,
        noteText,
        encryptionKey
      );
    }
  };

  const animateAddIcon = (toCheck: boolean) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setCurrentAddIcon(toCheck ? 'check' : 'check');    }, 200);
  };

  const handleSubmit = () => {
    if (selectedScore === null) {
      Alert.alert("Error", "Please select a value before submitting.");
    } else {
      setIsNoteDialogOpen(true);
    }
  };

  const handleSubmitPb = async () => {
    if (session && selectedScore) {
      setIsNoteDialogOpen(true);
    }
  };

  const handleFinalSubmit = async () => {
    setIsNoteDialogOpen(false);
    if(session && selectedScore){
      if (!isGuest) {
        setIsLoading(true);
        const todaysRating = await getRatingByDate(session.record.id, today);
        if (!todaysRating) setRatingPb();
        else updateRatingPb(session.record.id, todaysRating);
        await setWeeklyRatings(session.record.id);
        await setMonthlyRatings(session.record.id);
        await setYearlyRatings(session.record.id);
        await setGraphWeeklyRatings(session.record.id);
        await setGraphMonthlyRatings(session.record.id);
        await setGraphYearlyRatings(session.record.id);
        setRatingUpdated();
        setIsLoading(false);
      } else {
        setScore(selectedScore);
        Alert.alert("Success", `You submitted: ${selectedScore}`);
        setScoreSet(true);
      }
      setIsSubmitted(true);
      animateAddIcon(true);
      setTimeout(() => {
        setIsSubmitted(false);
        animateAddIcon(false);
      }, 3000);
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

  const handleNote = () => {
    setShowNote(!showNote);
  }

  useEffect(() => {
    isRatingSetToday().then((isSet) => {
      if (isSet === true) {
        setUpdateOrAdd("Update");
      } else {
        setUpdateOrAdd("Add");
      }
    });
  }, [scoreSet]);

  useEffect(() => {
    fetchTodaysRating();
  }, []);

  const renderScale = () => {
    const totalCircles = 11;
    return Array.from({ length: totalCircles }, (_, index) => (
      <TouchableOpacity
        key={index}
        className={`aspect-square rounded-full justify-center items-center mx-2 ${
          selectedScore === index ? "bg-cyan-700" : "bg-cyan-300"
        } shadow-lg`}
        onPress={() => {
          setSelectedScore(index);
          setShowNote(true);
        }}
        style={{ width: buttonSize, height: buttonSize }}
      >
        <Text className="text-3xl text-white font-bold">{index}</Text>
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
      <View
        className="justify-center w-full items-center "
        style={{ height: aspectRatio < 0.6 ? "80%" : 90 }}
      >
        <TouchableOpacity
          className={`w-1/5 aspect-square rounded-full items-center justify-center m-6 ${
            isSubmitted ? 'bg-green-300' : 'bg-[#67e8f9]'
          }`}
          onPress={!isGuest ? handleSubmitPb : handleSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Animated.View style={{ opacity: fadeAnim }}>
              <AntDesign 
                name={currentAddIcon as any} 
                size={40} 
                color="white" 
              />
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>
      <Dialog
        visible={isNoteDialogOpen}
        onClose={() => setIsNoteDialogOpen(false)}
      >
        <DialogContent>
          <View className="w-full bg-[#034f84] p-6 rounded-3xl">
            <Text className="text-white text-2xl font-bold mb-4 text-center">
              Add a note for today
            </Text>

            <TextInput
              className="h-32 bg-white/90 border-2 border-cyan-300 rounded-3xl p-4 text-lg text-gray-700"
              placeholder="Enter a note for the day (optional)"
              placeholderTextColor="#94a3b8"
              value={noteText}
              onChangeText={txt => {
                setNoteText(txt);
              }}
              multiline
              style={[shadowStyle, { elevation: 2 }]}
            />

            <View className="flex-row justify-end space-x-3 mt-6">
              <TouchableOpacity
                className="flex-1 p-3 rounded-2xl bg-gray-500/20"
                onPress={() => setIsNoteDialogOpen(false)}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, fontWeight: '600' }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 p-3 rounded-2xl bg-white"
                onPress={handleFinalSubmit}
              >
                <Text style={{ color: '#034f84', textAlign: 'center', fontSize: 18, fontWeight: '600' }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default AddRatingComponent;
