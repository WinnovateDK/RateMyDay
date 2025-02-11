import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useStorageSavedDates } from '@/hooks/useStorageSavedDates';
import { useIsFocused } from '@react-navigation/native';
import { setItem } from '@/utills/AsyncStorage';
import { MotiView } from 'moti';


const ExportFileComponent = ({ onClose }: { onClose: () => void }) => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const isFocused = useIsFocused();
  const userData = useStorageSavedDates(isFocused);
  
  const saveUserData = async () => {
    try {
      const path = `${FileSystem.documentDirectory}user_data.json`;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(userData, null, 2), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setFilePath(path);
      Alert.alert('Success', 'User data saved successfully.');
    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'Failed to save user data.');
    }
  };

  const shareUserData = async () => {
    if (!filePath) {
      Alert.alert('Error', 'No file available to share.');
      return;
    }

    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, { mimeType: 'application/json' });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.canceled) return;

      const content = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const data = JSON.parse(content);

      for (const [key, value] of Object.entries(data)) {
        const userValue = value as { rating: any; note: string };
        await setItem(key, userValue.rating, userValue.note);
      }

      Alert.alert('Data Loaded', `Name: ${data.name}\nAge: ${data.age}\nEmail: ${data.email}`);
    } catch (error) {
      console.error('Error loading file:', error);
      Alert.alert('Error', 'Failed to load user data.');
    }
  };

  return (
      <View className='flex-1 justify-center items-center bg-sky-100 shadow-slate-800'>
        <View className='flex-1 justify-center items-center bg-sky-100'>
        <Text className='font-bold text-xl'>User Data Transfer</Text>
        <Text className='text-m p-4'>Here you can export your ratings and notes to a file that can be sent or loaded again on another device</Text>
        <TouchableOpacity className="bg-sky-800 px-6 py-3 m-4 rounded" onPress={saveUserData}>
          <Text className="text-sky-100 text-lg font-bold">Save Data to File</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-sky-800 px-6 py-3 m-4 rounded" onPress={shareUserData}>
          <Text className="text-sky-100 text-lg font-bold">Share File</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-sky-800 px-6 py-3 m-4 rounded" onPress={loadUserData}>
          <Text className="text-sky-100 text-m font-bold">Load Data from File</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-red-500 px-4 py-2 m-2 rounded" onPress={onClose}>
          <Text className="text-white text-lg font-bold">Close</Text>
        </TouchableOpacity>
        </View>
      </View>
  );
};

export default ExportFileComponent;