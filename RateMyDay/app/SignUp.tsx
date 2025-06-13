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

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signIn, signOut, session, isLoading } = useAuthStore();
  const [localChecked, setLocalChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
                onPress={() => setModalVisible(true)}
              >
                Terms and Conditions
              </Text>{" "}
              and{" "}
              <Text
                className="text-blue-600 underline"
                onPress={() => setModalVisible(true)}
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white rounded-xl p-4 w-full max-h-[80%]">
            <Text className="text-lg font-bold mb-2 text-center">
              Terms and Conditions
            </Text>
            <ScrollView showsVerticalScrollIndicator={true}>
              <Text className="text-xl font-bold mb-2 text-center">
                Privacy Policy - Rate My Day
              </Text>

              <Text className="text-sm text-gray-500 mb-4 text-center">
                Last updated: June 9, 2025
              </Text>

              <Text className="text-base text-gray-700 mb-4">
                {"\n"}1. Introduction{"\n"}
                Welcome to Rate My Day (“we,” “us,” or “our”). This Privacy
                Policy explains how we collect, use, share, and protect your
                personal data when you use our mobile application (available on
                Google Play Store and Apple App Store) and associated services.
                {"\n\n"}2. Data Controller{"\n"}
                Winnovate (unregistered trading name){"\n"}
                Responsible person: Sebastian Bo Sørensen{"\n"}
                Postal address: Holbergsgade 35, st., tv., 8000 Aarhus C{"\n"}
                Email: winnovatedk@gmail.com{"\n"}
                We are the “Data Controller” under the EU General Data
                Protection Regulation (GDPR) and the Danish Data Protection Act.
                {"\n\n"}3. Data We Collect{"\n"}
                When you register and use the App, we collect:
                {"\n"}● Email address (required at signup)
                {"\n"}● Daily rating (self–reported score, e.g. 1–10)
                {"\n"}● Daily note (free-text journal entry; stored encrypted at
                rest)
                {"\n\n"}4. How We Use Your Data{"\n"}
                Email address: Account creation, authentication, support
                {"\n"}Legal basis: Performance of contract; legitimate interest
                to secure your account
                {"\n\n"}Daily rating & note: Personal tracking of your mood &
                reflections
                {"\n"}Legal basis: Explicit consent (you tick “I agree…”)
                {"\n\n"}5. Data Processing & Storage{"\n"}● We host all personal
                data on servers in Denmark, operated by Webdock A/S
                (GDPR-compliant; DPA signed).{"\n"}● Daily notes are encrypted
                at rest with AES-256; all traffic in transit is protected via
                HTTPS.{"\n"}● Webdock acts as our “Data Processor” under a
                signed Data Processing Agreement (DPA), in accordance with GDPR
                Article 28.
                {"\n\n"}6. Data Sharing & Third Parties{"\n"}● We do not sell or
                rent your data.{"\n"}● Only our processor (Webdock) and its
                sub-processors (e.g. Let's Encrypt for SSL) ever see your
                data—and only under the instructions of this Policy and our DPA.
                {"\n"}● If required by law (court order, regulatory request), we
                may disclose data to comply.
                {"\n\n"}7. Data Retention{"\n"}● We retain your email and daily
                entries only for as long as your account is active.{"\n"}● If
                you delete your account or withdraw consent, we permanently
                erase all your data within 30 days.
                {"\n\n"}8. Your Rights Under GDPR{"\n"}
                You have the right to:
                {"\n"}● Access your data (request a copy)
                {"\n"}● Rectify inaccurate or incomplete data
                {"\n"}● Erase your data (“right to be forgotten”)
                {"\n"}● Restrict processing in certain circumstances
                {"\n"}● Portability (receive your data in a structured format)
                {"\n"}● Object to processing based on legitimate interests
                {"\n"}To exercise any right, email us at winnovatedk@gmail.com.
                We will respond within one month.
                {"\n\n"}9. Consent{"\n"}
                By creating an account, you explicitly consent to this Policy
                and to our processing of your data as described. You may
                withdraw consent at any time via your account settings, after
                which your data will be erased as above.
                {"\n\n"}10. Security{"\n"}
                We implement technical and organizational measures to protect
                your data, including:
                {"\n"}● AES-256 encryption at rest
                {"\n"}● TLS (HTTPS) in transit
                {"\n"}● Regular security audits of our infrastructure provider
                (Webdock)
                {"\n\n"}11. International Transfers{"\n"}
                All processing occurs within the European Economic Area (EEA).
                We do not transfer your data outside the EEA.
                {"\n\n"}12. Changes to This Policy{"\n"}
                We may update this Privacy Policy occasionally. If we make
                material changes, we will notify you in-app and update the “Last
                updated” date here.
                {"\n\n"}13. Contact Us{"\n"}
                If you have any questions about this policy or your data, please
                contact:
                {"\n"}The Winnovate Team
                {"\n"}Email: winnovatedk@gmail.com
              </Text>
            </ScrollView>
            <TouchableOpacity
              className="bg-blue-500 rounded-md py-2 px-4 items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-base font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default SignUp;
