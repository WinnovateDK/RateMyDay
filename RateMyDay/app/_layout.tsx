import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useRef } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast, { ErrorToast } from "react-native-toast-message";
import { configureNotifications } from '@/utills/ConfigureNotifications';
import {
  Fredoka_400Regular,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import { View, Text, Animated, StyleSheet, ImageRequireSource, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();
configureNotifications();

// Get device dimensions for responsive sizing
const { width: screenWidth } = Dimensions.get('window');
const logoSize = screenWidth * 0.5;            // 50% of screen width
const titleFontSize = screenWidth * 0.08;       // ~8% of screen width
const creditFontSize = screenWidth * 0.05;      // ~5% of screen width
const verticalSpacing = screenWidth * 0.02;     // ~2% of screen width

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const logoOpacity = useRef<Animated.Value>(new Animated.Value(0)).current;
  const textOpacity = useRef<Animated.Value>(new Animated.Value(0)).current;
  const [fontsLoaded] = useFonts({ Fredoka_400Regular, Fredoka_700Bold });

  useEffect(() => {

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const loadingScreen = async (): Promise<void> => {
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }).start();
      });

      await new Promise<void>((res) => setTimeout(res, 2000));
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    loadingScreen();
  }, [logoOpacity, textOpacity]);

  // Optionally, show a blank screen or a simple loading indicator
  if (!fontsLoaded) {
    return null;
  }

  // Now it's safe to use your custom fonts everywhere, including the loading screen
  if (isLoading) {
    const logoSource: ImageRequireSource = require('@/assets/images/logo.png');

    return (
      <SafeAreaProvider>
        <View style={styles.container} className="bg-cyan-500">
          <Text style={[styles.title, { fontSize: titleFontSize }]}>Rate My Day</Text>
          <View style={styles.content}>
            <Animated.Image
              source={logoSource}
              style={[
                { width: logoSize, height: logoSize, opacity: logoOpacity },
              ]}
              resizeMode="contain"
            />
            <Animated.Text
              style={[
                styles.credit,
                { opacity: textOpacity, marginTop: verticalSpacing, fontSize: creditFontSize },
              ]}
            >
              by Winnovate
            </Animated.Text>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  const toastConfig = {
    error: (props: any) => (
      <ErrorToast {...props} style={{ borderLeftColor: "#bae6fd" }} />
    ),
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ title: "Main App" }} />
        </Stack>
        <Toast config={toastConfig} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    top: '30%',
    color: '#FFFFFF',
    fontFamily: 'Fredoka_700Bold',
  },
  content: {
    alignItems: 'center',
  },
  credit: {
    color: '#FFFFFF',
    fontFamily: 'Fredoka_400Regular',
  },
});
