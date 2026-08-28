// services/profile.service.ts
// Sustituye a clerk-supabase.service.ts. Ahora el id del perfil es el
// auth.users.id de Supabase, así que RLS con auth.uid() aplica directo.

import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export const DEFAULT_USER_SETTINGS = {
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

export class ProfileService {
  /**
   * Crea el perfil y sus settings si no existen, o refresca nombre/avatar.
   * Se llama una sola vez por sesión desde AuthContext.
   *
   * Si además dejaste activo el trigger `handle_new_user` en la base,
   * esta llamada solo actúa como red de seguridad y es idempotente.
   */
  static async ensureProfile(user: User) {
    try {
      const meta = user.user_metadata ?? {};
      const email = user.email ?? meta.email ?? null;

      if (!email) {
        return { data: null, error: new Error('El proveedor no entregó email') };
      }

      const fullName: string | null = meta.full_name ?? meta.name ?? null;
      const avatarUrl: string | null = meta.avatar_url ?? meta.picture ?? null;

      const { data: existing } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (existing) {
        // No pisar datos que el usuario ya editó a mano.
        const patch: Record<string, unknown> = {};
        if (!existing.full_name && fullName) patch.full_name = fullName;
        if (!existing.avatar_url && avatarUrl) patch.avatar_url = avatarUrl;

        if (Object.keys(patch).length > 0) {
          await supabase.from('profiles').update(patch).eq('id', user.id);
        }

        await this.ensureUserSettings(user.id);
        return { data: existing, error: null };
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email,
          full_name: fullName ?? '',
          avatar_url: avatarUrl,
          is_active: true,
          is_verified: !!user.email_confirmed_at,
        })
        .select()
        .single();

      if (error) throw error;

      await this.ensureUserSettings(user.id);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async ensureUserSettings(userId: string) {
    try {
      const { data: existing } = await supabase
        .from('user_settings')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) return { success: true, error: null };

      const { error } = await supabase
        .from('user_settings')
        .insert({ user_id: userId, ...DEFAULT_USER_SETTINGS });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  static async getProfile(userId: string) {
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

  static async updateProfile(
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
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

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

  static async updateUserSettings(
    userId: string,
    updates: Partial<typeof DEFAULT_USER_SETTINGS>
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

  static async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

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
