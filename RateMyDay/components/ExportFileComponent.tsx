import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { Feather } from "@expo/vector-icons";
import useAuthStore from "@/stores/AuthStateStore";
import { LinearGradient } from "expo-linear-gradient";
import NotificationComponent from "./NotificationComponent";
import { useRatingStorePb } from "@/stores/RatingStorePb";
import pb from "@/utills/pbClient";

export default function ExportFileComponent({ onClose }: { onClose: () => void }) {
  const [filePath, setFilePath] = useState<string | null>(null);
  const { signOut } = useAuthStore();

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { allRatings, setAllRatings } = useRatingStorePb();
  const { session } = useAuthStore();

  // Export allRatings to JSON and share
  const exportUserData = async () => {
    try {
      const path = `${FileSystem.documentDirectory}user_data.json`;
      await FileSystem.writeAsStringAsync(
        path,
        JSON.stringify(allRatings, null, 2),
        {
          encoding: FileSystem.EncodingType.UTF8,
        }
      );
      setFilePath(path);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, { mimeType: "application/json" });
      } else {
        Alert.alert("Error", "Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error exporting file:", error);
      Alert.alert("Error", "Failed to export user data.");
    }
  };

  // Import JSON, set allRatings, and sync with PocketBase
  const loadUserData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.canceled) return;

      const content = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const importedRatings = JSON.parse(content);

      if (Array.isArray(importedRatings)) {
        if (session?.record?.id) {
          for (const rating of importedRatings) {
            await pb.collection("ratings").create({
              userId: session.record.id,
              rating: rating.Rating,
              date: rating.fullDate ? new Date(rating.fullDate).toISOString() : undefined,
            });
          }
        }

        if (session?.record?.id) {
          setAllRatings(session.record.id);
        }

        Alert.alert("Success", "User data loaded and synced.");
      } else {
        Alert.alert("Error", "Invalid data format.");
      }
    } catch (error) {
      console.error("Error loading file:", error);
      Alert.alert("Error", "Failed to load user data.");
    }
  };

  return (
    <LinearGradient
      colors={["#034f84", "#3c6e71"]}
      className="flex-1 overflow-hidden"
    >
      <Image
        source={require("@/assets/newcloud.png")}
        style={{
          position: "absolute",
          top: 450,
          left: 70,
          width: 230,
          height: 150,
          opacity: 0.5,
        }}
      />
      <Image
        source={require("@/assets/newcloud.png")}
        style={{
          position: "absolute",
          top: 320,
          right: 70,
          width: 230,
          height: 150,
          opacity: 0.5,
        }}
      />
      <View className="h-16 w-full justify-center items-center border-b-2 border-white">
        <Text className="font-bold text-xl text-white">Settings</Text>
      </View>
      <View className="flex-1 w-full items-center justify-between">
        <View className="w-full">
          <TouchableOpacity
            className="w-fit flex-row items-center rounded-md my-1 mx-2"
            onPress={exportUserData}
          >
            <Feather
              name="download"
              size={25}
              className="m-4 mr-6"
              color="white"
            />
            <Text className="text-xl text-white ">Export Data to File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-fit flex-row items-center rounded-md my-1 mx-2"
            onPress={loadUserData}
          >
            <Feather
              name="upload"
              size={25}
              className="m-4 mr-6"
              color="white"
            />
            <Text className="text-white text-xl ">Load Data from File</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-fit flex-row items-center rounded-md my-1 mx-2"
            onPress={() => setShowNotificationModal(true)}
          >
            <Feather name="bell" size={25} className="m-4 mr-6" color="white" />
            <Text className="text-white text-xl">Notification Reminder</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full">
          <TouchableOpacity
            className="bg-red-500 flex-row items-center w-fit m-2 rounded-md"
            onPress={() => signOut()}
          >
            <Feather name="log-out" size={25} className="m-4 mr-6" />
            <Text className=" text-lg font-bold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      <NotificationComponent
        showModal={showNotificationModal}
        onCloseModal={() => setShowNotificationModal(false)}
      />
    </LinearGradient>
  );
}
