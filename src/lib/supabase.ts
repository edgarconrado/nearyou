import { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Variable global para almacenar la sesión
let globalSession: any = null;

// Función para crear el cliente con la sesión actual
export const getSupabaseClient = (session: any) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        const clerkToken = await session?.getToken({
          template: 'supabase',
        });

        const headers = new Headers(options?.headers);
        if (clerkToken) {
          headers.set('Authorization', `Bearer ${clerkToken}`);
        }

        return fetch(url, { ...options, headers });
      },
    },
  });
};

// Función para establecer la sesión global
export const setSupabaseSession = (session: any) => {
  globalSession = session;
};

// Cliente supabase que usa la sesión global
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (url, options = {}) => {
      const clerkToken = await globalSession?.getToken({
        template: 'supabase',
      });

      const headers = new Headers(options?.headers);
      if (clerkToken) {
        headers.set('Authorization', `Bearer ${clerkToken}`);
      }

      return fetch(url, { ...options, headers });
    },
  },
});

// Exportar tipos útiles
export type { Database };
export type Zone = Database['public']['Tables']['zones']['Row'];