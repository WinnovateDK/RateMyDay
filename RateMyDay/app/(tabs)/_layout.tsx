import { Tabs, Redirect } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/stores/AuthStateStore";
import "../../global.css";
import pb from "@/utills/pbClient";

export default function TabLayout() {
  const { session } = useAuthStore();

  useEffect(() => {
    const pbSession = useAuthStore.getState().session;
    if (pbSession && pbSession.token && pbSession.record) {
      pb.authStore.save(pbSession.token, pbSession.record);
      console.log("Rehydrated Auth");
    }
  }, []);

  if (!session) return <Redirect href="/login" />;

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
