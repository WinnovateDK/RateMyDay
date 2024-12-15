import {
  Image,
  View,
  Text,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView
  
} from "react-native";
import Animated from 'react-native-reanimated';
import "../../global.css";
import AddRatingComponent from "@/components/AddRatingComponent";
import { useState } from "react";


export default function AddRating() {
  const [rating ] = useState<number | null>();

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
        <View className="bg-teal-900 py-4 px-6 flex-row justify-between items-center">
                
              </View>        
              {/* Main Content */}
              <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
                <View className="gap-4 pt-8">
                  <View >
                    <Text className="text-center text-5xl font-bold text-emerald-800">Add todays rating!</Text>
                  </View>
                  <View className="gap-8 mb-8">
                    <View>
                      <Text className="text-teal-900 text-center text-2xl font-medium">How has your day been?</Text>
                    </View>
                    {/* Emoji and Progress Bar */}
                    <View className="bg-emerald-200 flex-row justify-around items-center">
                      <Text className="text-3xl">😔</Text>
                      <View className="flex-1 mx-4 bg-emerald-400 h-2 rounded-full">
                        <View className="w-1/2 h-2 bg-emerald-600 rounded-full" />
                      </View>
                      <Text className="text-3xl">😊</Text>
                    </View>
                    <View className="flex-row">
                    <AddRatingComponent />
                    </View>
                  </View>
                </View>
              </ScrollView>
                
                
        
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
