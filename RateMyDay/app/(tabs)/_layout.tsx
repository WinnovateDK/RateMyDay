import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { RMDColors } from "@/constants/Colors";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../../global.css";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
   
    <Tabs
      
      screenOptions={{
        tabBarStyle: {
          backgroundColor: RMDColors.rmdDark,
        },
        tabBarActiveTintColor: RMDColors.rmdLightest,
        tabBarInactiveTintColor: "#99f6e4",
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
      <Tabs.Screen
        name="chartScreen"
        options={{
          title: "Chart",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "linechart" : "linechart"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>

  );
}
