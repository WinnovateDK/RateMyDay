import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

interface DialogProps {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
}

export const Dialog = ({ children, visible, onClose }: DialogProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-4/5 bg-white p-6 rounded-lg">
          {children}
          <TouchableOpacity className="mt-4 bg-red-500 p-2 rounded" onPress={onClose}>
            <Text className="text-white text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export const DialogTrigger = ({ children, onOpen }: {children: React.ReactNode, onOpen: ()=> void}) => (
  <TouchableOpacity onPress={onOpen}>{children}</TouchableOpacity>
);

export const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <View>{children}</View>
);

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-lg font-bold">{children}</Text>
);