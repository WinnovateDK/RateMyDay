import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../../global.css";

export default function TabLayout() {
  return (
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
      {/*<Tabs.Screen
        name="chartScreen2"
        options={{
          title: "Chart2",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "linechart" : "linechart"}
              color={color}
            />
          ),
        }}
      />*/}
    </Tabs>
  );
}
