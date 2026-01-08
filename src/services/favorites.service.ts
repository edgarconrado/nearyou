// services/favorites.service.ts
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type Favorite = Database['public']['Tables']['favorites']['Row'];
export type FavoriteInsert = Database['public']['Tables']['favorites']['Insert'];

export interface FavoriteWithBusiness extends Favorite {
  business: {
    id: string;
    name: string;
    slug: string;
    main_image_url: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    average_rating: number | null;
    total_reviews: number | null;
  } | null;
}

export class FavoritesService {
  /**
   * Obtener todos los favoritos de un usuario
   */
  static async getUserFavorites(userId: string): Promise<{ data: Favorite[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener favoritos de un usuario con información del negocio
   */
  static async getUserFavoritesWithBusiness(userId: string): Promise<{ data: FavoriteWithBusiness[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          business:businesses(
            id,
            name,
            slug,
            main_image_url,
            address,
            city,
            state,
            average_rating,
            total_reviews
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as FavoriteWithBusiness[], error: null };
    } catch (error) {
      console.error('Error fetching favorites with business:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener IDs de negocios favoritos de un usuario (para búsquedas rápidas)
   */
  static async getUserFavoriteBusinessIds(userId: string): Promise<{ ids: string[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('business_id')
        .eq('user_id', userId);

      if (error) throw error;

      const ids = data?.map(fav => fav.business_id).filter(id => id !== null) as string[] || [];

      return { ids, error: null };
    } catch (error) {
      console.error('Error fetching favorite business ids:', error);
      return { ids: [], error: error as Error };
    }
  }

  /**
   * Verificar si un negocio está en favoritos
   */
  static async isFavorite(userId: string, businessId: string): Promise<{ isFavorite: boolean; favoriteId: string | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .maybeSingle();

      if (error) throw error;

      return { isFavorite: !!data, favoriteId: data?.id || null, error: null };
    } catch (error) {
      console.error('Error checking favorite:', error);
      return { isFavorite: false, favoriteId: null, error: error as Error };
    }
  }

  /**
   * Agregar un negocio a favoritos
   */
  static async addFavorite(userId: string, businessId: string): Promise<{ data: Favorite | null; error: Error | null }> {
    try {
      // Verificar si ya existe
      const { isFavorite } = await this.isFavorite(userId, businessId);
      if (isFavorite) {
        return { data: null, error: new Error('Already in favorites') };
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          business_id: businessId,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error adding favorite:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Remover un negocio de favoritos
   */
  static async removeFavorite(userId: string, businessId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('business_id', businessId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Remover un favorito por ID
   */
  static async removeFavoriteById(favoriteId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error removing favorite by id:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Toggle favorito (agregar si no existe, remover si existe)
   */
  static async toggleFavorite(userId: string, businessId: string): Promise<{ 
    isFavorite: boolean; 
    data: Favorite | null; 
    error: Error | null 
  }> {
    try {
      const { isFavorite, favoriteId } = await this.isFavorite(userId, businessId);

      if (isFavorite && favoriteId) {
        // Remover
        await this.removeFavoriteById(favoriteId);
        return { isFavorite: false, data: null, error: null };
      } else {
        // Agregar
        const { data, error } = await this.addFavorite(userId, businessId);
        return { isFavorite: true, data, error };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { isFavorite: false, data: null, error: error as Error };
    }
  }

  /**
   * Obtener cantidad de favoritos de un usuario
   */
  static async getUserFavoritesCount(userId: string): Promise<{ count: number; error: Error | null }> {
    try {
      const { count, error } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Error fetching favorites count:', error);
      return { count: 0, error: error as Error };
    }
  }

  /**
   * Obtener usuarios que marcaron un negocio como favorito
   */
  static async getBusinessFavoritesCount(businessId: string): Promise<{ count: number; error: Error | null }> {
    try {
      const { count, error } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId);

      if (error) throw error;

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Error fetching business favorites count:', error);
      return { count: 0, error: error as Error };
    }
  }

  /**
   * Eliminar todos los favoritos de un usuario
   */
  static async clearUserFavorites(userId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error clearing user favorites:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Suscribirse a cambios en favoritos de un usuario
   */
  static subscribeToUserFavorites(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<Favorite>) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`favorites-user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    return channel;
  }

  /**
   * Suscribirse a todos los cambios en favoritos
   */
  static subscribeToChanges(
    callback: (payload: RealtimePostgresChangesPayload<Favorite>) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel('favorites-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
        },
        callback
      )
      .subscribe();

    return channel;
  }

  /**
   * Cancelar suscripción
   */
  static unsubscribeFromChanges(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
  }
}