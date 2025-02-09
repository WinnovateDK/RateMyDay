import React, { useState } from 'react';
import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DocumentPicker from 'react-native-document-picker';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const FileTransferDialog = () => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const userData = { name: 'John Doe', age: 30, email: 'johndoe@example.com' };

  const saveUserData = async () => {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/user_data.json`;
      await RNFS.writeFile(path, JSON.stringify(userData, null, 2), 'utf8');
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
      await Share.open({
        url: `file://${filePath}`,
        type: 'application/json',
      });
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const content = await RNFS.readFile(result.uri, 'utf8');
      const data = JSON.parse(content);
      Alert.alert('Data Loaded', `Name: ${data.name}\nAge: ${data.age}\nEmail: ${data.email}`);
    } catch (error) {
      console.error('Error loading file:', error);
      Alert.alert('Error', 'Failed to load user data.');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Transfer User Data</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Data Transfer</DialogTitle>
        </DialogHeader>
        <Button className="w-full mb-2" onPress={saveUserData}>Save Data to File</Button>
        <Button className="w-full mb-2" onPress={shareUserData}>Share File</Button>
        <Button className="w-full" onPress={loadUserData}>Load Data from File</Button>
      </DialogContent>
    </Dialog>
  );
};

export default FileTransferDialog;