import PocketBase, { AsyncAuthStore } from "pocketbase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const pb = new PocketBase(
  Constants.expoConfig?.extra?.EXPO_PUBLIC_POCKETBASE_URL,
  new AsyncAuthStore({
    save: async (data) => AsyncStorage.setItem("pb_auth", data),
    initial: AsyncStorage.getItem("pb_auth"),
  })
);

export default pb;
