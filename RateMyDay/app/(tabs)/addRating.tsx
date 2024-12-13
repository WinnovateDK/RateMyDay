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
import { getItem } from "@/utills/AsyncStorage";
import "../../global.css";
import AddRatingComponent from "@/components/AddRatingComponent";
import { useEffect, useState } from "react";
import { RMDColors, RMDTealColors } from "@/constants/Colors";

export default function AddRating() {
  const [isGetRatingPressed, setIsGetRatingPressed] = useState<Boolean>(false);
  const [rating, setRating] = useState<number | null>();

  const handleGetRating = async () => {
    const dateObject = new Date();
    const day = dateObject.getUTCDate() < 10 ? `0${dateObject.getUTCDate()}` : dateObject.getUTCDate();
    const yearMonthDate = `${dateObject.getUTCFullYear()}-${
      dateObject.getUTCMonth() + 1
    }-${day}`;
    const rating = await getItem(`${yearMonthDate}`).then((rating) => {
      const stringRating = '' + rating;
      Alert.alert("Rating for: " + yearMonthDate, stringRating);
      return rating;
    });
    return rating;
  };

  useEffect(() => {
    if (isGetRatingPressed) {
      const rating = handleGetRating().then((rating) => {
        setRating(rating);
        setIsGetRatingPressed(false);
      });
    }
  }, [isGetRatingPressed]);

  return (
    <View className="bg-teal-950">
    <ParallaxScrollView
      headerBackgroundColor={{ light: RMDTealColors.rmdTeal900, dark: RMDTealColors.rmdTeal900 }}
      headerImage={
        <Image
          source={require("@/assets/images/emojis.png")}
          style={styles.reactLogo}
        />
      }
    >
      
        <View className="flex-row align-middle gap-8" >
          <ThemedText className="flex-row align-middle gap-8" type="title">Add a daily rating!</ThemedText>
          <HelloWave />
        </View>
        <View className="gap-8 mb-8">
          <View>
            <ThemedText type="subtitle">How has your day been?</ThemedText>
          </View>
          <AddRatingComponent />
          <Button
            color={RMDColors.rmdDark}
            title="GetRating"
            onPress={() => {
              setIsGetRatingPressed(true);
            }}
          />
          <Text>{rating}</Text>
        </View>
      
    </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
