import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { useStorageSavedDates } from "@/hooks/useStorageSavedDates";
import { useIsFocused } from "@react-navigation/native";
import { setItem } from "@/utills/AsyncStorage";
import { MotiView } from "moti";
import { shadowStyle } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import useAuthStore from "@/stores/AuthStateStore";
import { LinearGradient } from "expo-linear-gradient";

const ExportFileComponent = ({ onClose }: { onClose: () => void }) => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const isFocused = useIsFocused();
  const userData = useStorageSavedDates(isFocused);
  const { signOut } = useAuthStore();

  const saveUserData = async () => {
    try {
      const path = `${FileSystem.documentDirectory}user_data.json`;
      await FileSystem.writeAsStringAsync(
        path,
        JSON.stringify(userData, null, 2),
        {
          encoding: FileSystem.EncodingType.UTF8,
        }
      );
      setFilePath(path);
      Alert.alert("Success", "User data saved successfully.");
    } catch (error) {
      console.error("Error saving file:", error);
      Alert.alert("Error", "Failed to save user data.");
    }
  };

  const shareUserData = async () => {
    if (!filePath) {
      Alert.alert("Error", "No file available to share.");
      return;
    }

    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, { mimeType: "application/json" });
      } else {
        Alert.alert("Error", "Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const loadUserData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.canceled) return;

      const content = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const data = JSON.parse(content);

      for (const [key, value] of Object.entries(data)) {
        const userValue = value as { rating: any; note: string };
        await setItem(key, userValue.rating, userValue.note);
      }

      Alert.alert(
        "Data Loaded",
        `Name: ${data.name}\nAge: ${data.age}\nEmail: ${data.email}`
      );
    } catch (error) {
      console.error("Error loading file:", error);
      Alert.alert("Error", "Failed to load user data.");
    }
  };

  return (
    <LinearGradient colors={["#034f84", "#3c6e71"]} className="flex-1">
      <View className="h-16 w-full justify-center items-center border-b-2 border-cyan-400">
        <Text className="font-bold text-xl text-white">User Data Transfer</Text>
      </View>
      <View className="flex-1 w-full items-center justify-between">
        <View className="w-full">
          <TouchableOpacity
            className=" w-fit flex-row items-center rounded-md my-1 mx-2"
            onPress={saveUserData}
          >
            <Feather
              name="download"
              size={25}
              className="m-4 mr-6"
              color="#67e8f9"
            />
            <Text className="text-xl text-white ">Save Data to File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className=" w-fit flex-row items-center rounded-md my-1 mx-2"
            onPress={shareUserData}
          >
            <Feather
              name="share-2"
              size={25}
              className="m-4 mr-6"
              color="#67e8f9"
            />
            <Text className=" text-xl text-white">Share File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className=" w-fit flex-row items-center rounded-md my-1 mx-2"
            onPress={loadUserData}
          >
            <Feather
              name="upload"
              size={25}
              className="m-4 mr-6"
              color="#67e8f9"
            />
            <Text className="text-white text-xl ">Load Data from File</Text>
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
    </LinearGradient>
  );
};

export default ExportFileComponent;
