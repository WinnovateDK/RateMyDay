import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddRatingComponent from "@/components/AddRatingComponent";
import ExportFileComponent from "@/components/ExportFileComponent";
import "../../global.css";

export default function AddRating() {
  const [showSidePanel, setShowSidePanel] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-sky-100">
      <View className="bg-sky-200 h-1/4 w-full justify-center pt-4 pb-2 flex-col">
        <View className="flex-row justify-between px-4">
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.reactLogo}
          />
          <TouchableOpacity className="pt-10" onPress={() => setShowSidePanel(true)}>
            <Ionicons name="settings" size={24} color="#0084c7" />
          </TouchableOpacity>
        </View>
        <View className="justify-center items-center">
          <Text className="text-5xl text-sky-800">Rate My Day</Text>
        </View>
      </View>
      {/* Main Content */}
      <View className="flexgrow-1 p-6">
        <View className="gap-4 pt-8">
          <View>
            <Text className="text-center text-5xl font-bold text-sky-800">
              Add todays rating!
            </Text>
          </View>
          <View className="gap-8 mb-8">
            <View>
              <Text className="text-sky-800 text-center text-2xl font-medium">
                How has your day been?
              </Text>
            </View>
            {/* Emoji and Progress Bar */}
            <View className="bg-sky-100 flex-row justify-around items-center">
              <Text className="text-3xl">😔</Text>
              <View className="flex-1 mx-4 bg-sky-400 h-2 rounded-full">
                <View className="w-1/2 h-2 bg-sky-600 rounded-full" />
              </View>
              <Text className="text-3xl">😊</Text>
            </View>
            <View className="flex-row">
              <AddRatingComponent />
            </View>
          </View>
        </View>
      </View>
      {showSidePanel && (
        <View style={styles.sidePanel}>
          <ExportFileComponent onClose={() => setShowSidePanel(false)} />
        </View>
      )}
    </SafeAreaView>
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
  sidePanel: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
});