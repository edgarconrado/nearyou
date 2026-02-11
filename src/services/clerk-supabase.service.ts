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
        return { data: null, error: new Error('Usuario de Clerk no proporcionado') };
      }

      if (!clerkUser.id) {
        return { data: null, error: new Error('ID de usuario no disponible') };
      }

      // Validar que tengamos un email
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      if (!email) {
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

      // 2. Verificar si el perfil ya existe
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', clerkUser.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingProfile) {
        
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
          throw updateError;
        }

        // Asegurar que existan las configuraciones
        await this.ensureUserSettings(clerkUser.id);

        return { data: updatedProfile, error: null };
      }

      // 3. Crear nuevo perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();

      if (profileError) {
        throw profileError;
      }

      // 4. Crear configuración de usuario por defecto
      const { error: settingsError } = await this.ensureUserSettings(clerkUser.id);
      

      return { data: profileData, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Asegurar que existan las configuraciones del usuario
   */
  static async ensureUserSettings(userId: string) {
    try {

      // Verificar si ya existen configuraciones
      const { data: existing, error: checkError } = await supabase
        .from('user_settings')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
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


      const { error: insertError } = await supabase
        .from('user_settings')
        .insert(defaultSettings);

      return { success: true, error: null };
    } catch (error) {
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
      return { success: false, error: error as Error };
    }
  }
}
