// lib/supabase.ts — Cliente único de Supabase (auth + datos).
// Ya no existe cliente "autenticado aparte": la sesión de Supabase Auth
// viaja sola en cada request, así que RLS con auth.uid() funciona directo.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY en .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // Sin `lock`: en React Native hay un solo hilo de JS y una sola instancia
    // del cliente, así que processLock no aporta y sí provoca timeouts de
    // 10 s ("Lock acquisition timed out") cuando getSession, el refresh
    // automático y el listener de AppState se pisan entre sí.
  },
});

// Refrescar el token solo mientras la app está en primer plano.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});