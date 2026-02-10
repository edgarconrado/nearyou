import { supabase } from '@/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

// Tipos derivados de la base de datos
export type UserSettings = Tables<'user_settings'>;
type UserSettingsInsert = TablesInsert<'user_settings'>;
type UserSettingsUpdate = TablesUpdate<'user_settings'>;

// Valores por defecto para nuevos usuarios
const defaultSettings: Omit<UserSettingsInsert, 'user_id'> = {
  push_enabled: true,
  email_enabled: true,
  notify_new_places: true,
  notify_offers: true,
  notify_reviews: true,
  notify_messages: false,
  notify_updates: true,
  profile_public: true,
  show_email: false,
  show_phone: false,
  allow_messages: true,
  share_location: true,
  show_activity: true,
  language: 'es',
};

// ✨ Función para comparar objetos profundamente
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}

export function useUserSettings(userId: string | null | undefined) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ✨ Referencia al valor anterior para detectar cambios REALES
  const prevSettingsRef = useRef<UserSettings | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isMountedRef = useRef(true);

  // Cargar configuraciones
  const fetchSettings = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!isMountedRef.current) return;

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          await createDefaultSettings(userId);
          return;
        }
        throw fetchError;
      }

      // ✨ Solo actualizar si los datos REALMENTE cambiaron
      if (!deepEqual(prevSettingsRef.current, data)) {

        prevSettingsRef.current = data;
        setSettings(data);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Error al cargar configuraciones'));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [userId]);

  // Crear configuración por defecto
  const createDefaultSettings = async (uid: string) => {
    try {
      const newSettings: UserSettingsInsert = {
        user_id: uid,
        ...defaultSettings,
      };

      const { data, error: insertError } = await supabase
        .from('user_settings')
        .insert(newSettings)
        .select()
        .single();

      if (insertError) throw insertError;

      if (isMountedRef.current) {
        prevSettingsRef.current = data;
        setSettings(data);
      }
    } catch (err) {
      console.error('❌ Error creating settings:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Error al crear configuraciones'));
      }
    }
  };

  // Actualizar una configuración específica
  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ): Promise<boolean> => {
    if (!userId || !settings) return false;

    try {

      // Actualización en Supabase primero
      const updates: UserSettingsUpdate = { [key]: value };

      const { error: updateError } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar la configuración');
      return false;
    }
  };

  // Actualizar múltiples configuraciones
  const updateSettings = async (updates: UserSettingsUpdate): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error: updateError } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      Alert.alert('Error', 'No se pudieron actualizar las configuraciones');
      return false;
    }
  };

  // Resetear a valores por defecto
  const resetToDefaults = async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      const updates: UserSettingsUpdate = defaultSettings;

      const { error: updateError } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      Alert.alert('Éxito', 'Configuraciones restauradas a valores por defecto');
      return true;
    } catch (err) {
      Alert.alert('Error', 'No se pudieron resetear las configuraciones');
      return false;
    }
  };

  // ✨ Suscripción en tiempo real con manejo mejorado
  useEffect(() => {
    if (!userId) return;

    let channel: RealtimeChannel;

    const setupChannel = () => {
      channel = supabase
        .channel(`user_settings:${userId}:${Date.now()}`) // ✨ Unique channel per mount
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_settings',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {

            if (!isMountedRef.current) {
              return;
            }

            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const newData = payload.new as UserSettings;

              // ✨ Solo actualizar si realmente cambió
              if (!deepEqual(prevSettingsRef.current, newData)) {


                prevSettingsRef.current = newData;
                setSettings(newData);
              }
            } else if (payload.eventType === 'DELETE') {
              prevSettingsRef.current = null;
              setSettings(null);
            }
          }
        )
        .subscribe((status, err) => {
        });
    };

    // Cargar datos iniciales
    fetchSettings();

    // Configurar canal de tiempo real
    setupChannel();

    // Cleanup
    return () => {
      isMountedRef.current = false;

      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, fetchSettings]);

  // ✨ Marcar como mounted
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    settings,
    loading,
    error,
    updateSetting,
    updateSettings,
    resetToDefaults,
    refetch: fetchSettings,
  };
}