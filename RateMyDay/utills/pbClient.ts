import PocketBase, { AsyncAuthStore } from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const pb = new PocketBase(
    'https://winnovate.pockethost.io',
    new AsyncAuthStore({
      save: async (data) => AsyncStorage.setItem('pb_auth', data),
      initial: AsyncStorage.getItem('pb_auth'),
    })
  );