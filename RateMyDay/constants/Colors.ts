import { Platform } from "react-native";

export const CalendarColors = [
  "#FF0000",
  "#ff3300",
  "#ff6600",
  "#ff9900",
  "#ffcc00",
  "#ffff00",
  "#ccff00",
  "#99ff00",
  "#66ff00",
  "#33ff00",
  "#00ff00",
];

export const shadowStyle =
  Platform.OS === "ios"
    ? {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }
    : {
        elevation: 6,
      };
