import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useAuthStore from "@/stores/AuthStateStore";
import { Router, useRouter } from "expo-router";
import { createUser } from "@/utills/PocketBase";
import { Alert } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import TermsAndConditionsModal from "@/components/TermsAndConditionsModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signIn, signOut, session, isLoading } = useAuthStore();
  const [localChecked, setLocalChecked] = useState(false);
  const [ppModalVisible, setPPModalVisible] = useState(false);
  const [tcModalVisible, setTCModalVisible] = useState(false);
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
    if (localChecked === false) {
      Alert.alert(
        "Terms and conditions and Privacy policy",
        "You must agree to the Terms and conditions and Privacy policy to create an account."
      );
      return;
    }

    try {
      await createUser(email, password, confirmPassword);
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (error) {
      console.error("Sign Up Error: ", error);
      Alert.alert("Sign Up Failed", `Something went wrong: ${error}`);
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
          <View className="w-full flex-row align-middle h-20 -mt-4">
            <BouncyCheckbox
              size={25}
              fillColor="#034f84"
              iconStyle={{ borderColor: "#034f84" }}
              textStyle={{
                color: "#000",
                fontSize: 15,
              }}
              isChecked={localChecked}
              onPress={(isChecked) => setLocalChecked(isChecked)}
              className="-mt-4 mb-3"
            />
            <Text className="flex-1 text-black text-sm flex-wrap">
              By checking this box, I confirm that I have read and agree to the{" "}
              <Text
                className="text-blue-600 underline"
                onPress={() => setTCModalVisible(true)}
              >
                Terms and Conditions
              </Text>{" "}
              and{" "}
              <Text
                className="text-blue-600 underline"
                onPress={() => setPPModalVisible(true)}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>

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
      <PrivacyPolicyModal
        ppModalVisible={ppModalVisible}
        setPPModalVisible={setPPModalVisible}
      />
      <TermsAndConditionsModal
        ppModalVisible={tcModalVisible}
        setPPModalVisible={setTCModalVisible}
      />
    </LinearGradient>
  );
};

export default SignUp;
