import { Tabs, Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar, View } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/stores/AuthStateStore";
import PocketBase from "pocketbase";
import "../../global.css";
import Toast, { ErrorToast } from "react-native-toast-message";
import { useRatingStorePb } from "@/stores/RatingStorePb";

const pb = new PocketBase("https://winnovate.pockethost.io");

export default function TabLayout() {
  const { session, isGuest } = useAuthStore();

  useEffect(() => {
    const pbSession = useAuthStore.getState().session;
    if (pbSession && pbSession.token && pbSession.record) {
      pb.authStore.save(pbSession.token, pbSession.record);
      console.log("Rehydrated Auth");
    }
  }, []);

  if (!session && !isGuest) return <Redirect href="/login" />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <StatusBar animated={true} backgroundColor="white" />
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: "#005482",
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "#acc5fd",
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Add",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "pluscircle" : "pluscircle"}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="calendar"
            options={{
              title: "Calendar",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "calendar" : "calendar"}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
