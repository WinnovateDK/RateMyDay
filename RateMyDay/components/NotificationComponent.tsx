import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, Modal } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';

interface NotificationComponentProps {
  showModal: boolean;
  onCloseModal: () => void;
}

const NotificationComponent = ({ showModal, onCloseModal }: NotificationComponentProps) => {
  const [reminderTime, setReminderTime] = useState(new Date());
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  useEffect(() => {
    // Request permissions on component mount
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'You need to enable notifications to receive reminders'
        );
      }
    };
    requestPermissions();
  }, []);

  const scheduleNotification = async (time: Date) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      const trigger = new Date();
      trigger.setHours(time.getHours());
      trigger.setMinutes(time.getMinutes());
      trigger.setSeconds(0);
      
      if (trigger < new Date()) {
        trigger.setDate(trigger.getDate() + 1);
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Rate My Day Reminder',
          body: "Don't forget to rate your day!",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: time.getHours(),
          minute: time.getMinutes(),
          repeats: true,
        },
      });

      console.log('Scheduled notification:', identifier);
      Alert.alert(
        'Success',
        `Daily reminder set for ${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`
      );
      onCloseModal();
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to set notification reminder');
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setIsTimePickerVisible(Platform.OS === 'ios');
    if (selectedTime) {
      setReminderTime(selectedTime);
      if (Platform.OS === 'android') {
        scheduleNotification(selectedTime);
      }
    }
  };

  return (
    <>
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={onCloseModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-cyan-600 p-6 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4 text-white">Set Daily Reminder</Text>
            <Text className="mb-4 text-white">
              Choose when you'd like to be reminded to rate your day:
            </Text>

            {Platform.OS === 'ios' ? (
              <>
                <DateTimePicker
                  value={reminderTime}
                  mode="time"
                  display="spinner"
                  onChange={onTimeChange}
                />
                <View className="flex-row justify-end gap-4 mt-4">
                  <TouchableOpacity
                    className="px-4 py-2 rounded-md bg-gray-300"
                    onPress={onCloseModal}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-4 py-2 rounded-md bg-blue-500"
                    onPress={() => scheduleNotification(reminderTime)}
                  >
                    <Text className="text-white">Set Reminder</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <TouchableOpacity
                className="px-4 py-2 rounded-md bg-cyan-950"
                onPress={() => setIsTimePickerVisible(true)}
              >
                <Text className="text-white text-center">Select Time</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
      {Platform.OS === 'android' && isTimePickerVisible && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </>
  );
};

export default NotificationComponent;