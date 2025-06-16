import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddRatingComponent from "@/components/AddRatingComponent";
import { useState, useEffect } from "react";
import ExportFileComponent from "@/components/ExportFileComponent";
import { shadowStyle } from "@/constants/Colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Background } from "@/components/Background";
import { useRatingStorePb } from "@/stores/RatingStorePb";

const { width, height } = Dimensions.get("window");
const aspectRatio = width / height;

export default function AddRating() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const translateX = useSharedValue(300);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const { streak, setAllRatings } = useRatingStorePb();

  const widthArray = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const barWidth = useSharedValue(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    translateX.value = withTiming(showSidePanel ? 0 : 300, { duration: 300 });
  }, [showSidePanel, translateX]);

  useEffect(() => {
    barWidth.value = withTiming(
      selectedScore ? widthArray[selectedScore] : 0,
      { duration: 400 } // 0.3 seconds
    );
  }, [selectedScore]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  return (
    <Background streak={streak} >
      <View className="h-1/4 w-full">
        <View className="flex-row items-center justify-between">
          <View className="w-6" />
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.reactLogo}
            className="absolute left-1/2 -translate-x-1/2"
          />
          <TouchableOpacity
            className="pb-48 pr-4"
            onPress={() => setShowSidePanel(true)}
          >
            <Ionicons name="settings" size={24} color="#0084c7" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 p-6">
        <View className="flex-1 gap-3">
          <Text
            className="text-center text-3xl text-white font-semibold"
            style={{
              fontSize: 14 / aspectRatio,
              fontFamily: "Fredoka_700Bold",
            }}
          >
            Add todays rating
          </Text>
          <View className="flex-1 gap-8 mb-8">
            <Text
              className="text-center text-cyan-200 "
              style={{
                fontSize: 9 / aspectRatio,
                fontFamily: "Fredoka_400Regular",
              }}
            >
              How has your day been?
            </Text>
            <View
              className="bg-cyan-100 flex-row items-center p-4 rounded-lg shadow-md"
              style={shadowStyle}
            >
              <Text style={{ fontSize: 14 / aspectRatio }}>😔</Text>
              <View className="flex-1 mx-4 bg-cyan-300 h-2 rounded-full">
                <Animated.View
                  className="h-2 bg-cyan-600 rounded-full"
                  style={animatedBarStyle}
                />
              </View>
              <Text style={{ fontSize: 14 / aspectRatio }}>😊</Text>
            </View>
            <AddRatingComponent
              selectedScore={selectedScore}
              setSelectedScore={setSelectedScore}
            />
          </View>
        </View>
      </View>
      <Pressable
        style={[showSidePanel ? styles.overlay : styles.overlayOff]}
        onPress={() => {
          translateX.value = withTiming(300, { duration: 300 }, () => {
            runOnJS(setShowSidePanel)(false); // 👈 Wrap it with runOnJS
          });
        }}
      ></Pressable>
      <Animated.View
        style={[styles.sidePanel, animatedStyle]}
        className="h-full"
      >
        <ExportFileComponent onClose={() => setShowSidePanel(false)} />
      </Animated.View>
    </Background>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 110 / aspectRatio,
    width: 110 / aspectRatio,
    alignSelf: "center",
    position: "relative",
    resizeMode: "center",
    marginTop: 18,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  overlayOff: {
    width: 0,
    height: 0,
  },
  sidePanel: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "70%",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
