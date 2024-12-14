import {
  Image,
  View,
  Text,
  Alert,
  StyleSheet,
  SafeAreaView
} from "react-native";
import Animated from 'react-native-reanimated';
import { getItem } from "@/utills/AsyncStorage";
import "../../global.css";
import AddRatingComponent from "@/components/AddRatingComponent";
import { useEffect, useState } from "react";
import { RMDColors, RMDTealColors } from "@/constants/Colors";

export default function AddRating() {
  const [rating, setRating] = useState<number | null>();

  return (
    <SafeAreaView className="flex-1 bg-emerald-200">
        <Animated.View className="bg-teal-900 p-32 gap-16 h-1/4"
                  >
                  {
                    <Image
                      source={require("@/assets/images/emojis.png")}
                      style={styles.reactLogo}
                    />
                  }
          </Animated.View>
        <View className="gap-4 pt-8">
          <View >
            <Text className="text-center text-4xl text-emerald-800">Add a daily rating!</Text>
          </View>
          <View className="gap-8 mb-8">
            <View>
              <Text className="text-center text-2xl">How has your day been?</Text>
            </View>
            <AddRatingComponent />
            <Text>{rating}</Text>
          </View>
        </View>
    </SafeAreaView>
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
