// services/reviews.service.ts
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type Review = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

export interface ReviewWithUser extends Review {
  user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface ReviewWithBusiness extends Review {
  business: {
    id: string;
    name: string;
    slug: string;
    main_image_url: string | null;
  } | null;
}

export class ReviewsService {
  /**
   * Obtener todas las reseñas visibles
   */
  static async getAllVisibleReviews(): Promise<{ data: Review[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener una reseña por ID
   */
  static async getReviewById(id: string): Promise<{ data: Review | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener reseñas de un negocio específico
   */
  static async getReviewsByBusiness(businessId: string): Promise<{ data: Review[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener reseñas de un negocio con información del usuario
   */
  static async getReviewsByBusinessWithUser(businessId: string): Promise<{ data: ReviewWithUser[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:profiles(id, full_name, avatar_url)
        `)
        .eq('business_id', businessId)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as ReviewWithUser[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener reseñas de un usuario específico
   */
  static async getReviewsByUser(userId: string): Promise<{ data: Review[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener reseñas de un usuario con información del negocio
   */
  static async getReviewsByUserWithBusiness(userId: string): Promise<{ data: ReviewWithBusiness[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          business:businesses(id, name, slug, main_image_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as ReviewWithBusiness[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Verificar si un usuario ya dejó una reseña en un negocio
   */
  static async hasUserReviewedBusiness(
    userId: string,
    businessId: string
  ): Promise<{ hasReviewed: boolean; review: Review | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .maybeSingle();

      if (error) throw error;

      return { hasReviewed: !!data, review: data, error: null };
    } catch (error) {
      return { hasReviewed: false, review: null, error: error as Error };
    }
  }

  /**
   * Obtener estadísticas de reseñas de un negocio
   */
  static async getBusinessReviewStats(businessId: string): Promise<{
    stats: {
      total: number;
      average: number;
      ratings: { [key: number]: number };
    } | null;
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('business_id', businessId)
        .eq('is_visible', true);

      if (error) throw error;

      const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let total = 0;
      let sum = 0;

      data?.forEach((review) => {
        ratings[review.rating as keyof typeof ratings]++;
        sum += review.rating;
        total++;
      });

      const average = total > 0 ? sum / total : 0;

      return {
        stats: { total, average, ratings },
        error: null,
      };
    } catch (error) {
      return { stats: null, error: error as Error };
    }
  }

  /**
   * Crear una nueva reseña
   */
  static async createReview(review: ReviewInsert): Promise<{ data: Review | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();

      if (error) throw error;

      // Actualizar estadísticas del negocio
      if (data && review.business_id) {
        await this.updateBusinessRating(review.business_id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Actualizar una reseña
   */
  static async updateReview(id: string, updates: ReviewUpdate): Promise<{ data: Review | null; error: Error | null }> {
    try {
      // Marcar como editada
      const updatesWithFlag = {
        ...updates,
        is_edited: true,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('reviews')
        .update(updatesWithFlag)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Actualizar estadísticas del negocio si cambió el rating
      if (data && updates.rating && data.business_id) {
        await this.updateBusinessRating(data.business_id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Eliminar una reseña
   */
  static async deleteReview(id: string, businessId?: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar estadísticas del negocio
      if (businessId) {
        await this.updateBusinessRating(businessId);
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Ocultar una reseña (soft delete)
   */
  static async hideReview(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_visible: false })
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Incrementar contador de "útil"
   */
  static async incrementHelpfulCount(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: review } = await this.getReviewById(id);
      if (!review) throw new Error('Review not found');

      const { error } = await supabase
        .from('reviews')
        .update({ helpful_count: (review.helpful_count || 0) + 1 })
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Incrementar contador de reportes
   */
  static async incrementReportedCount(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: review } = await this.getReviewById(id);
      if (!review) throw new Error('Review not found');

      const { error } = await supabase
        .from('reviews')
        .update({ reported_count: (review.reported_count || 0) + 1 })
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Actualizar calificación promedio de un negocio
   */
  private static async updateBusinessRating(businessId: string): Promise<void> {
    try {
      const { stats } = await this.getBusinessReviewStats(businessId);

      if (stats) {
        const { BusinessesService } = await import('./businesses.service');
        await BusinessesService.updateBusiness(businessId, {
          average_rating: stats.average,
          total_reviews: stats.total,
        });
      }
    } catch (error) {
    }
  }

  /**
   * Suscribirse a cambios en tiempo real
   */
  static subscribeToChanges(
    callback: (payload: RealtimePostgresChangesPayload<Review>) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
        },
        callback
      )
      .subscribe();

    return channel;
  }

  /**
   * Suscribirse a reseñas de un negocio específico
   */
  static subscribeToBusinessReviews(
    businessId: string,
    callback: (payload: RealtimePostgresChangesPayload<Review>) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`reviews-business-${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `business_id=eq.${businessId}`,
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