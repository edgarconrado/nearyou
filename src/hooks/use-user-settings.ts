import { supabase } from '@/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/types/database_types';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
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

export function useUserSettings(userId: string | null | undefined) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Cargar configuraciones
  const fetchSettings = async () => {
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

      if (fetchError) {
        // Si no existe, crear configuración por defecto
        if (fetchError.code === 'PGRST116') {
          await createDefaultSettings(userId);
          return;
        }
        throw fetchError;
      }

      setSettings(data);
    } catch (err) {
      console.error('Error fetching user settings:', err);
      setError(err instanceof Error ? err : new Error('Error al cargar configuraciones'));
    } finally {
      setLoading(false);
    }
  };

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

      setSettings(data);
    } catch (err) {
      console.error('Error creating default settings:', err);
      setError(err instanceof Error ? err : new Error('Error al crear configuraciones'));
    }
  };

  // Actualizar una configuración específica
  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ): Promise<boolean> => {
    if (!userId || !settings) return false;

    try {
      const updates: UserSettingsUpdate = { [key]: value };

      const { error: updateError } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Actualizar estado local inmediatamente (optimistic update)
      setSettings(prev => prev ? { ...prev, [key]: value } : null);
      return true;
    } catch (err) {
      console.error(`Error updating setting ${String(key)}:`, err);
      Alert.alert('Error', 'No se pudo actualizar la configuración');
      // Revertir cambio optimista si falla
      await fetchSettings();
      return false;
    }
  };

  // Actualizar múltiples configuraciones
  const updateSettings = async (updates: UserSettingsUpdate): Promise<boolean> => {
    if (!userId || !settings) return false;

    try {
      const { error: updateError } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Actualizar estado local inmediatamente (optimistic update)
      setSettings(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      Alert.alert('Error', 'No se pudieron actualizar las configuraciones');
      // Revertir cambio optimista si falla
      await fetchSettings();
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

      setSettings(prev => prev ? { ...prev, ...defaultSettings } : null);
      Alert.alert('Éxito', 'Configuraciones restauradas a valores por defecto');
      return true;
    } catch (err) {
      console.error('Error resetting settings:', err);
      Alert.alert('Error', 'No se pudieron resetear las configuraciones');
      return false;
    }
  };

  // ✨ NUEVO: Suscripción en tiempo real
  useEffect(() => {
    if (!userId) return;

    let channel: RealtimeChannel;

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel(`user_settings:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*', // Escuchar INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'user_settings',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log('🔄 Cambio en tiempo real detectado:', payload);

            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              // Actualizar estado con los nuevos datos
              setSettings(payload.new as UserSettings);
            } else if (payload.eventType === 'DELETE') {
              // Si se elimina, volver a valores por defecto
              setSettings(null);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Suscrito a cambios en tiempo real de user_settings');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Error en suscripción en tiempo real');
          }
        });
    };

    // Cargar datos iniciales
    fetchSettings();

    // Configurar suscripción en tiempo real
    setupRealtimeSubscription();

    // Cleanup: Remover suscripción al desmontar
    return () => {
      if (channel) {
        console.log('🔌 Desuscribiendo de cambios en tiempo real');
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

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