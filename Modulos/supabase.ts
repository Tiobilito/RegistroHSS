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

//Project URL
const supabaseUrl = "https://jogjxpcmhnujrifsmqmt.supabase.co"
//API Key
const supabaseAnonKey= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZ2p4cGNtaG51anJpZnNtcW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2NDUwNzMsImV4cCI6MjAzNDIyMTA3M30._XBPuiPVslv5guX9vFaolx7mttxpT2jFQckprHlMpRk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })