// services/businesses.service.ts
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type Business = Database['public']['Tables']['businesses']['Row'];
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert'];
export type BusinessUpdate = Database['public']['Tables']['businesses']['Update'];
export type BusinessFull = Database['public']['Views']['businesses_full']['Row'];

export class BusinessesService {
  /**
   * Obtener todos los negocios activos
   */
  static async getAllActiveBusinesses(): Promise<{ data: Business[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching businesses:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener negocios con información completa (usando la vista businesses_full)
   */
  static async getAllBusinessesFull(): Promise<{ data: BusinessFull[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses_full')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching businesses full:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener un negocio por ID
   */
  static async getBusinessById(id: string): Promise<{ data: Business | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching business by id:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener un negocio completo por ID
   */
  static async getBusinessFullById(id: string): Promise<{ data: BusinessFull | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses_full')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching business full by id:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener un negocio por slug
   */
  static async getBusinessBySlug(slug: string): Promise<{ data: Business | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching business by slug:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener negocios por zona
   */
  static async getBusinessesByZone(zoneId: string): Promise<{ data: Business[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('zone_id', zoneId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching businesses by zone:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener negocios completos por zona
   */
  static async getBusinessesFullByZone(zoneId: string): Promise<{ data: BusinessFull[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses_full')
        .select('*')
        .eq('zone_id', zoneId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching businesses full by zone:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener negocios por categoría
   */
  static async getBusinessesByCategory(categoryId: string): Promise<{ data: Business[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching businesses by category:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener negocios por zona y categoría
   */
  static async getBusinessesByZoneAndCategory(
    zoneId: string,
    categoryId: string
  ): Promise<{ data: Business[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('zone_id', zoneId)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching businesses by zone and category:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Buscar negocios por nombre
   */
  static async searchBusinesses(query: string): Promise<{ data: Business[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .ilike('name', `%${query}%`)
        .eq('is_active', true)
        .order('name', { ascending: true })
        .limit(20);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error searching businesses:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener negocios cercanos (por coordenadas)
   */
  static async getNearbyBusinesses(
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): Promise<{ data: Business[] | null; error: Error | null }> {
    try {
      // Nota: Esta es una búsqueda simple. Para búsquedas geoespaciales más precisas,
      // considera usar PostGIS con ST_DWithin
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;

      // Filtrar por distancia en el cliente (para una solución simple)
      const nearby = data?.filter(business => {
        if (!business.latitude || !business.longitude) return false;
        const distance = this.calculateDistance(
          latitude,
          longitude,
          business.latitude,
          business.longitude
        );
        return distance <= radiusKm;
      });

      return { data: nearby || [], error: null };
    } catch (error) {
      console.error('Error fetching nearby businesses:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener negocios mejor calificados
   */
  static async getTopRatedBusinesses(limit: number = 10): Promise<{ data: Business[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true)
        .not('average_rating', 'is', null)
        .order('average_rating', { ascending: false })
        .order('total_reviews', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching top rated businesses:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Crear un nuevo negocio
   */
  static async createBusiness(business: BusinessInsert): Promise<{ data: Business | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert(business)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating business:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Actualizar un negocio
   */
  static async updateBusiness(id: string, updates: BusinessUpdate): Promise<{ data: Business | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating business:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Incrementar contador de visitas
   */
  static async incrementVisitCount(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Intentar usar la función RPC si existe
      const { error: rpcError } = await supabase.rpc('increment_visit_count', { business_id: id });

      if (!rpcError) {
        return { success: true, error: null };
      }

      // Si la función RPC no existe o falla, hacerlo manualmente
      console.log('RPC no disponible, incrementando manualmente');

      // Primero obtener el negocio actual
      const { data: business, error: fetchError } = await supabase
        .from('businesses')
        .select('total_visits')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.warn('No se pudo obtener el negocio para incrementar visitas:', fetchError);
        // No lanzar error, solo loguear - no es crítico
        return { success: false, error: fetchError as Error };
      }

      // Actualizar el contador
      const { error: updateError } = await supabase
        .from('businesses')
        .update({
          total_visits: (business?.total_visits || 0) + 1
        })
        .eq('id', id);

      if (updateError) {
        console.warn('No se pudo incrementar el contador de visitas:', updateError);
        return { success: false, error: updateError as Error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.warn('Error incrementando visitas:', error);
      // No lanzar error, solo retornar - no queremos que esto bloquee la carga
      return { success: false, error: error as Error };
    }
  }

  /**
   * Desactivar un negocio
   */
  static async deactivateBusiness(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deactivating business:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Eliminar permanentemente un negocio
   */
  static async deleteBusiness(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting business:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Calcular distancia entre dos puntos (fórmula de Haversine)
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Suscribirse a cambios en tiempo real
   */
  static subscribeToChanges(
    callback: (payload: RealtimePostgresChangesPayload<Business>) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel('businesses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'businesses',
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