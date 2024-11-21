import {
  Image,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getItem } from "@/utills/AsyncStorage";

import AddRatingComponent from "@/components/AddRatingComponent";
import { useEffect, useState } from "react";

export default function AddRating() {
  const [isGetRatingPressed, setIsGetRatingPressed] = useState<Boolean>(false);
  const [rating, setRating] = useState<String>("");

  const handleGetRating = async () => {
    const dateObject = new Date();
    const dateMonthYear = `${dateObject.getUTCDate()}${
      dateObject.getUTCMonth() + 1
    }${dateObject.getUTCFullYear()}`;
    const rating = await getItem(`rating${dateMonthYear}`).then((rating) => {
      return rating;
    });
    return rating;
  };

  useEffect(() => {
    if (isGetRatingPressed) {
      const rating = handleGetRating().then((rating) => {
        setRating(`${rating}`);
      });
    }
  }, [isGetRatingPressed]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/emojis.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Add a daily rating!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: "cmd + d", android: "cmd + m" })}
          </ThemedText>{" "}
          to open developer toolssdsd.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">How has your day been?</ThemedText>
        <AddRatingComponent />
        <Button
          title="GetRating"
          onPress={() => {
            setIsGetRatingPressed(true);
          }}
        />
        <Text>{rating}</Text>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
