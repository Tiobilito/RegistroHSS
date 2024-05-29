import Constants from 'expo-constants';
//import 'react-native-url-polyfill/auto'
import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

//const supabaseUrl = Constants?.expoConfig?.extra?.supabaseUrl;

//const supabaseAnonKey = Constants?.expoConfig?.extra?.supabaseAnonKey;
const supabaseUrl="https://lpxsgoriiklrtkyfoxtk.supabase.co"
const supabaseAnonKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxweHNnb3JpaWtscnRreWZveHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5MzkyNDUsImV4cCI6MjAzMjUxNTI0NX0.HSSUL1zoy944xHop9X36WGHDvdE4zUe9Y7Fb0GNVUj0"
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })