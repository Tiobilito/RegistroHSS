import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'
import { SupaLink, SupaAnonKey } from '../LocalV'

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
const supabaseUrl = SupaLink
//API Key
const supabaseAnonKey= SupaAnonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })