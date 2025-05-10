import React, { useRef } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
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
import { scale } from "react-native-size-matters";
import { useWindowDimensions } from "react-native";
import { Background } from "@/components/Background";

export default function AddRating() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const translateX = useSharedValue(300);
  const { width, height } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const aspectRatio = width / height;

  const widthArray = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Background>
      {aspectRatio < 0.6 ? (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            scrollRef.current?.scrollTo({ y: 0, animated: true });
          }}
        >
          <View className="flex-1">
            <View className=" h-1/4 w-full">
              <View className="flex-row items-center justify-between">
                <View className="w-6" />
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.reactLogo}
                  className="absolute left-1/2 -translate-x-1/2"
                />
                <TouchableOpacity
                  className="pb-16 pr-4"
                  onPress={() => setShowSidePanel(true)}
                >
                  <Ionicons name="settings" size={24} color="#0084c7" />
                </TouchableOpacity>
              </View>
            </View>
            {/* Main Content */}
            <View className="flex-1 p-6">
              <View className="flex-1 gap-3">
                <Text className="text-center text-3xl text-white font-semibold">
                  Add todays rating
                </Text>
                <View className="flex-1 gap-8 mb-8">
                  <Text className="text-center text-xl text-cyan-200 ">
                    How has your day been?
                  </Text>
                  {/* Emoji and Progress Bar */}
                  <View
                    className="bg-cyan-100 flex-row justify-around items-center p-4 rounded-lg shadow-md"
                    style={shadowStyle}
                  >
                    <Text className="text-3xl">😔</Text>
                    <View className="flex-1 mx-4 bg-cyan-300 h-2 rounded-full">
                      <View
                        className="h-2 bg-cyan-600 rounded-full"
                        style={{
                          width: `${
                            selectedScore ? widthArray[selectedScore] : 0
                          }%`,
                        }}
                      />
                    </View>
                    <Text className="text-3xl">😊</Text>
                  </View>
                  <AddRatingComponent
                    selectedScore={selectedScore}
                    setSelectedScore={setSelectedScore}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <ScrollView
          className="flex-1"
          scrollEnabled={aspectRatio < 0.6 || showSidePanel ? false : true}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              className="flex-1 "
              keyboardShouldPersistTaps="handled"
              scrollEnabled={keyboardVisible}
            >
              <View className=" h-1/4 w-full justify-center pt- pb-2 border-b-2 border-cyan-400">
                <View className="flex-row items-center justify-between px-4">
                  <View className="w-6" />
                  <Image
                    source={require("@/assets/images/logo.png")}
                    style={styles.reactLogo}
                    className="absolute left-1/2 -translate-x-1/2"
                  />
                  <TouchableOpacity
                    className="pt-10 pb-16"
                    onPress={() => setShowSidePanel(true)}
                  >
                    <Ionicons name="settings" size={24} color="#0084c7" />
                  </TouchableOpacity>
                </View>
                <View className="justify-center items-center">
                  <Text
                    className="text-5xl font-extrabold text-white"
                    style={{ fontSize: scale(30) }}
                  >
                    Rate My Day
                  </Text>
                </View>
              </View>
              {/* Main Content */}
              <View className="flexgrow p-12 mt-6">
                <View className="gap-3">
                  <Text className="text-center text-3xl text-white font-semibold">
                    Add todays rating
                  </Text>
                  <View className="gap-8 mb-8">
                    <Text className="text-center text-xl text-cyan-200 mb-6">
                      How has your day been?
                    </Text>
                    {/* Emoji and Progress Bar */}
                    <View
                      className="bg-cyan-100 flex-row justify-around items-center p-4 rounded-lg shadow-md"
                      style={shadowStyle}
                    >
                      <Text className="text-3xl">😔</Text>
                      <View className="flex-1 mx-4 bg-cyan-300 h-2 rounded-full">
                        <View className="w-1/2 h-2 bg-cyan-600 rounded-full" />
                      </View>
                      <Text className="text-3xl">😊</Text>
                    </View>
                    <View className="flex-row mt-2 mb-2">
                      <AddRatingComponent
                        selectedScore={selectedScore}
                        setSelectedScore={setSelectedScore}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </ScrollView>
      )}
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
    height: 200,
    width: 200,
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
