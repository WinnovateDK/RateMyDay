import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key: string, rating: any, note: string = "") => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ rating, note }));
  } catch (error) {
    console.error("Error setting item:", error);
  }
};

export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error getting item:", error);
    return null;
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

export const mergeItem = async (
  key: string,
  rating: any,
  note: string = ""
) => {
  try {
    await AsyncStorage.mergeItem(key, JSON.stringify({ rating, note }));
  } catch (error) {
    console.error("Error merging item:", error);
  }
};

export const clear = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error("Error getting all keys:", error);
    return [];
  }
};

export const getAllItems = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);

    return items.reduce((accumulator: { [key: string]: any }, [key, value]) => {
      if (value) {
        try {
          const parsedValue = JSON.parse(value);
          accumulator[key] = {
            value1: parsedValue.rating || "No Rating",
            value2: parsedValue.note || "",
          };
        } catch (e) {
          console.error(`Error parsing value for key ${key}:`, e);
          accumulator[key] = { rating: value, note: "" };
        }
      } else {
        accumulator[key] = { rating: "No Rating", note: "" };
      }
      return accumulator;
    }, {});
  } catch (error) {
    console.error("Error getting all items:", error);
    return {};
  }
};
