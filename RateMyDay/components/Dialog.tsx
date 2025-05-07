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
      <View className="flex-1 justify-center items-center">
        <View className="w-4/5 bg-transparent rounded-lg">
          {children}
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