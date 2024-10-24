import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';


const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
 
      return Promise.resolve(window.localStorage.getItem(key));
    } else if (Platform.OS !== 'web') {
      return SecureStore.getItemAsync(key);
    } else {
      return Promise.resolve(null); 
    }
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      return Promise.resolve(window.localStorage.setItem(key, value));
    } else if (Platform.OS !== 'web') {
      return SecureStore.setItemAsync(key, value);
    } else {
      return Promise.resolve(); 
    }
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      return Promise.resolve(window.localStorage.removeItem(key));
    } else if (Platform.OS !== 'web') {
      return SecureStore.deleteItemAsync(key);
    } else {
      return Promise.resolve(); 
    }
  },
};

const supabaseUrl = 'https://rnuwbqqeutbciuqzcymd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudXdicXFldXRiY2l1cXpjeW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2OTA5MTAsImV4cCI6MjA0NTI2NjkxMH0.6pXG1J3VU8v2zkirM_RUP3mWrM0Nz2OHjx9Vl_uYXsI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});



/*import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';


const ExpoSecureStoreAdapter = {
    getItem: async (key: string) => {
      return await SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string) => {
      await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key: string) => {
      await SecureStore.deleteItemAsync(key);
    },
  };

const supabaseUrl = 'https://rnuwbqqeutbciuqzcymd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudXdicXFldXRiY2l1cXpjeW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2OTA5MTAsImV4cCI6MjA0NTI2NjkxMH0.6pXG1J3VU8v2zkirM_RUP3mWrM0Nz2OHjx9Vl_uYXsI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});*/