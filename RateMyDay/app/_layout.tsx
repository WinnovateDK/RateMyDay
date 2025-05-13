import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast, { ErrorToast } from "react-native-toast-message";
import { configureNotifications } from '@/utills/ConfigureNotifications';
import {
  Fredoka_400Regular,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';

SplashScreen.preventAutoHideAsync();
configureNotifications();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  
  const router = useRouter();
  
  const toastConfig = {
    error: (props: any) => (
      <ErrorToast {...props} style={{ borderLeftColor: "#bae6fd" }} />
    ),
  };

  const [loaded] = useFonts({ Fredoka_400Regular, Fredoka_700Bold });
  useEffect(() => {

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ title: "Main App" }} />
        </Stack>
        <Toast config={toastConfig} />
    </ThemeProvider>
  );
}
