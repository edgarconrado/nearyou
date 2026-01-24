// services/clerk-supabase.service.ts
import { supabase } from '@/lib/supabase';
import type { UserResource } from '@clerk/types';

export class ClerkSupabaseService {
  /**
   * Sincronizar usuario de Clerk con Supabase
   */
  static async syncUserWithSupabase(clerkUser: UserResource) {
    try {
      const profile = {
        id: clerkUser.id,
        clerk_id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        full_name: clerkUser.fullName || '',
        avatar_url: clerkUser.imageUrl || null,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile, {
          onConflict: 'clerk_id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Crear configuración de usuario por defecto si no existe
      await this.ensureUserSettings(clerkUser.id);

      return { data, error: null };
    } catch (error) {
      console.error('Error syncing user with Supabase:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Asegurar que existan las configuraciones del usuario
   */
  static async ensureUserSettings(userId: string) {
    try {
      const { data: existing } = await supabase
        .from('user_settings')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (!existing) {
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

        const { error } = await supabase
          .from('user_settings')
          .insert(defaultSettings);

        if (error) throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error ensuring user settings:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Obtener perfil de usuario desde Supabase
   */
  static async getUserProfile(clerkId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_id', clerkId)
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
    clerkId: string,
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
        .eq('clerk_id', clerkId)
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
   * Obtener estadísticas del usuario
   */
  static async getUserStats(clerkId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', clerkId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Eliminar usuario (soft delete)
   */
  static async deactivateUser(clerkId: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('clerk_id', clerkId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deactivating user:', error);
      return { success: false, error: error as Error };
    }
  }
}