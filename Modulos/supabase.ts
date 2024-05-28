import Constants from 'expo-constants';
//import 'react-native-url-polyfill/auto'
import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'
const url="https://fvrbxlqmqpxrjrsqtlnw.supabase.co/storage/v1/object/public/prueba/cr7.jpg"

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
const supabaseUrl="https://abgspujwyujtccknqenr.supabase.co"
const supabaseAnonKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZ3NwdWp3eXVqdGNja25xZW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0MzU5NzgsImV4cCI6MjAyNjAxMTk3OH0.NOjPxUVPBYztUlLCl6CBYg9vIrl9I58zD6bolUzqYfs"
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })