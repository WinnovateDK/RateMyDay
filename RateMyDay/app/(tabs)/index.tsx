import React from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import ExportFileComponent from "@/components/ExportFileComponent";
import { shadowStyle } from "@/constants/Colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

export default function AddRating() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const translateX = useSharedValue(300);

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
    <LinearGradient colors={["#034f84", "#3c6e71"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flexgrow-1 "
            keyboardShouldPersistTaps="handled"
            scrollEnabled={keyboardVisible}
          >
            <View className=" h-1/4 w-full justify-center pt-4 pb-2 border-b-2 border-cyan-400">
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
                <Text className="text-5xl font-extrabold text-white">
                  Rate My Day
                </Text>
              </View>
            </View>
            {/* Main Content */}
            <View className="flexgrow p-6">
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
                    <AddRatingComponent />
                  </View>
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
              className={"h-screen"}
            >
              <ExportFileComponent onClose={() => setShowSidePanel(false)} />
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 100,
    width: 100,
    alignSelf: "center",
    position: "relative",
    resizeMode: "center",
    marginTop: 12,
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
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
