import { Platform } from 'react-native';

export const CalendarColors = [
  "#FF0000",
  "#FF4000",
  "#FF8000",
  "#FFBF00",
  "#FFFF00",
  "#BFFF00",
  "#80FF00",
  "#40FF00",
  "#00FF00",
  "#00BF00",
];

export const shadowStyle = Platform.OS === 'ios' ? {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
} : {
  elevation: 6,
};


