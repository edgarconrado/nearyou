// services/clerk-supabase.service.ts
import { supabase } from '@/lib/supabase';
import type { UserResource } from '@clerk/types';

export class ClerkSupabaseService {
  /**
   * Sincronizar usuario de Clerk con Supabase
   * Crea el perfil y las configuraciones por defecto
   */
  static async syncUserWithSupabase(clerkUser: UserResource) {
    try {
      // Validaciones previas
      if (!clerkUser) {
        console.error('❌ clerkUser es undefined o null');
        return { data: null, error: new Error('Usuario de Clerk no proporcionado') };
      }

      if (!clerkUser.id) {
        console.error('❌ clerkUser.id es undefined');
        return { data: null, error: new Error('ID de usuario no disponible') };
      }

      console.log('🔄 Iniciando sincronización de usuario:', clerkUser.id);

      // Validar que tengamos un email
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      if (!email) {
        console.error('❌ No se encontró email en el usuario de Clerk');
        return { data: null, error: new Error('Email no disponible') };
      }

      // 1. Preparar datos del perfil
      const profile = {
        id: clerkUser.id,
        email: email,
        full_name: clerkUser.fullName || clerkUser.firstName || '',
        avatar_url: clerkUser.imageUrl || null,
        is_active: true,
        is_verified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
      };

      console.log('📝 Datos del perfil a crear:', JSON.stringify(profile, null, 2));

      // 2. Verificar si el perfil ya existe
      console.log('🔍 Verificando si el perfil ya existe...');
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', clerkUser.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error verificando perfil existente:', checkError);
        throw checkError;
      }

      if (existingProfile) {
        console.log('ℹ️  El perfil ya existe:', existingProfile.email);
        console.log('🔄 Actualizando datos del perfil...');
        
        // Actualizar el perfil existente
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            is_verified: profile.is_verified,
          })
          .eq('id', clerkUser.id)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error actualizando perfil:', updateError);
          throw updateError;
        }

        console.log('✅ Perfil actualizado correctamente');

        // Asegurar que existan las configuraciones
        await this.ensureUserSettings(clerkUser.id);

        return { data: updatedProfile, error: null };
      }

      // 3. Crear nuevo perfil
      console.log('➕ Creando nuevo perfil en Supabase...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();

      if (profileError) {
        console.error('❌ Error creando perfil en Supabase:');
        console.error('  Código:', profileError.code);
        console.error('  Mensaje:', profileError.message);
        console.error('  Detalles:', profileError.details);
        console.error('  Hint:', profileError.hint);
        throw profileError;
      }

      console.log('✅ Perfil creado exitosamente:', profileData.email);

      // 4. Crear configuración de usuario por defecto
      console.log('⚙️  Creando configuraciones de usuario...');
      const { error: settingsError } = await this.ensureUserSettings(clerkUser.id);
      
      if (settingsError) {
        console.error('⚠️  Error creando configuraciones (el perfil fue creado):', settingsError);
        // No lanzamos error aquí porque el perfil sí se creó
      }

      console.log('🎉 Sincronización completada exitosamente!');
      return { data: profileData, error: null };
    } catch (error) {
      console.error('❌ Error fatal en syncUserWithSupabase:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Asegurar que existan las configuraciones del usuario
   */
  static async ensureUserSettings(userId: string) {
    try {
      console.log('🔍 Verificando configuraciones del usuario:', userId);

      // Verificar si ya existen configuraciones
      const { data: existing, error: checkError } = await supabase
        .from('user_settings')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error verificando configuraciones:', checkError);
        throw checkError;
      }

      if (existing) {
        console.log('✅ Las configuraciones ya existen para:', userId);
        return { success: true, error: null };
      }

      // Crear configuraciones por defecto
      const defaultSettings = {
        user_id: userId,
        language: 'es',
        push_enabled: true,
        email_enabled: true,
        notify_messages: true,
        notify_offers: true,
        notify_new_places: true,
        notify_reviews: true,
        notify_updates: true,
        profile_public: true,
        show_activity: true,
        show_email: false,
        show_phone: false,
        allow_messages: true,
        share_location: true,
      };

      console.log('➕ Creando configuraciones por defecto...');

      const { error: insertError } = await supabase
        .from('user_settings')
        .insert(defaultSettings);

      if (insertError) {
        console.error('❌ Error creando configuraciones:');
        console.error('  Código:', insertError.code);
        console.error('  Mensaje:', insertError.message);
        console.error('  Detalles:', insertError.details);
        throw insertError;
      }

      console.log('✅ Configuraciones creadas exitosamente');
      return { success: true, error: null };
    } catch (error) {
      console.error('❌ Error en ensureUserSettings:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Obtener perfil de usuario desde Supabase
   */
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Actualizar perfil de usuario
   */
  static async updateUserProfile(
    userId: string,
    updates: {
      full_name?: string;
      bio?: string;
      phone?: string;
      location?: string;
      city?: string;
      state?: string;
      country?: string;
      avatar_url?: string;
    }
  ) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener configuraciones del usuario
   */
  static async getUserSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error getting user settings:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Actualizar configuraciones del usuario
   */
  static async updateUserSettings(
    userId: string,
    updates: Partial<{
      language: string;
      push_enabled: boolean;
      email_enabled: boolean;
      notify_messages: boolean;
      notify_offers: boolean;
      notify_new_places: boolean;
      notify_reviews: boolean;
      notify_updates: boolean;
      profile_public: boolean;
      show_activity: boolean;
      show_email: boolean;
      show_phone: boolean;
      allow_messages: boolean;
      share_location: boolean;
    }>
  ) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating user settings:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener estadísticas del usuario
   */
  static async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Eliminar usuario (soft delete)
   */
  static async deactivateUser(userId: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deactivating user:', error);
      return { success: false, error: error as Error };
    }
  }
}
