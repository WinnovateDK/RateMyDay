import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useAuthStore from "@/stores/AuthStateStore";
import PocketBase from "pocketbase";
import { Router, useRouter } from "expo-router";
import { createUser } from "@/utills/PocketBase";
import { Alert } from "react-native";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signIn, signOut, session, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignUp = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email adress");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    try {
      await createUser(email, password, confirmPassword);
      Alert.alert("Seccess", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (e) {
      Alert.alert("Sign Up Failed", "Something went wrong.");
      return;
    }
  };

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);

  return (
    <LinearGradient colors={["#034f84", "#3c6e71"]} style={{ flex: 1 }}>
      <View className="flex-1 justify-center items-center px-8">
        <View className="w-full bg-white p-4 rounded-lg justify-center items-center">
          <Text className="text-3xl font-bold mb-5">Create new user</Text>
          <TextInput
            className="w-full h-12 rounded-lg px-4 border-2 border-gray-300 text-base"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput />
          <TextInput
            className="w-full h-12 rounded-lg px-4 border-2 border-gray-300 text-base"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput />
          <TextInput
            className="w-full h-12 rounded-lg px-4 border-2 border-gray-300 text-base"
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TextInput />
          <View className="flex-row">
            <TouchableOpacity
              className="w-2/5 h-12 bg-blue-500 rounded-lg justify-center items-center active:bg-blue-700 mr-2"
              onPress={() => {
                handleSignUp(email, password, confirmPassword);
              }}
            >
              <Text className="text-white text-lg font-semibold">Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-2/5 h-12 bg-red-400 rounded-lg justify-center items-center active:bg-blue-700"
              onPress={() => router.replace("/login")}
            >
              <Text className="text-white text-lg font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SignUp;
