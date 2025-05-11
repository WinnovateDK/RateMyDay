import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useAuthStore from "@/stores/AuthStateStore";
import Toast from "react-native-toast-message";
import PocketBase from "pocketbase";
import { Router, useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, session, setIsGuest, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
    } catch (e: any) {
      showToast(e.message);
    }
  };
  const showToast = (text: string) => {
    Toast.show({
      type: "error",
      text1: text,
      position: "bottom",
    });
  };

  const handleGuest = () => {
    setIsGuest(true);
    router.replace("/");
  };

  useEffect(() => {
    if (session && !isLoading) {
      router.replace("/");
    }
  }, [session, isLoading]);

  return (
    <LinearGradient colors={["#034f84", "#3c6e71"]} style={{ flex: 1 }}>
      <View className="flex-1 justify-center items-center px-8">
        <View className="w-full bg-white p-4 rounded-lg justify-center items-center">
          <Text className="text-3xl font-bold mb-5">Login</Text>
          <TextInput
            className="w-full h-12 rounded-lg px-4 border-2 border-gray-300 text-base"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="w-full h-12 rounded-lg px-4 border-2 border-gray-300 text-base mt-7"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity className="mb-6" onPress={() => handleGuest()}>
            <Text className="underline text-sky-400 mt-2">
              Continue as guest.
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-between w-full">
            <TouchableOpacity
              className="w-2/5 h-12 bg-blue-500 rounded-lg justify-center items-center active:bg-blue-700 ml-6"
              onPress={() => {
                handleLogin(email, password);
              }}
            >
              {isLoading ? (
                <ActivityIndicator size="large" />
              ) : (
                <Text className="text-white text-lg font-semibold">Login</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="w-2/5 h-12 bg-blue-500 rounded-lg justify-center items-center active:bg-blue-700 mr-6"
              onPress={() => {
                router.replace("/SignUp");
              }}
            >
              <Text className="text-white text-lg font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default login;
