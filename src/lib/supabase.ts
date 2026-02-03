// lib/supabase.ts - VERSIÓN MEJORADA con Clerk

import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente base (sin auth)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Hook para obtener cliente Supabase autenticado con Clerk
export function useSupabaseClient() {
  const { getToken, userId } = useAuth();

  const getAuthenticatedClient = async () => {
    const token = await getToken({ template: 'supabase' });
    
    if (token) {
      // Crear cliente con el token de Clerk
      const authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });
      
      return authenticatedClient;
    }
    
    return supabase; // Fallback al cliente sin auth
  };

  return { getAuthenticatedClient, userId };
}