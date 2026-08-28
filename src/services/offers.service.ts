// services/offers.service.ts
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type Offer = Database['public']['Tables']['offers']['Row'];
export type OfferInsert = Database['public']['Tables']['offers']['Insert'];
export type OfferUpdate = Database['public']['Tables']['offers']['Update'];

export interface OfferWithBusiness extends Offer {
  business: {
    id: string;
    name: string;
    slug: string;
    main_image_url: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
  } | null;
}

export class OffersService {
  /**
   * Obtener todas las ofertas activas
   */
  static async getAllActiveOffers(): Promise<{ data: Offer[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener ofertas vigentes (activas y dentro del rango de fechas)
   */
  static async getValidOffers(): Promise<{ data: Offer[] | null; error: Error | null }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .or(`valid_from.is.null,valid_from.lte.${today}`)
        .or(`valid_until.is.null,valid_until.gte.${today}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener ofertas vigentes con información del negocio
   */
  static async getValidOffersWithBusiness(): Promise<{ data: OfferWithBusiness[] | null; error: Error | null }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          business:businesses(
            id,
            name,
            slug,
            main_image_url,
            address,
            city,
            state
          )
        `)
        .eq('is_active', true)
        .or(`valid_from.is.null,valid_from.lte.${today}`)
        .or(`valid_until.is.null,valid_until.gte.${today}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as OfferWithBusiness[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener una oferta por ID
   */
  static async getOfferById(id: string): Promise<{ data: Offer | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('offers')
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
   * Obtener una oferta por ID con información del negocio
   */
  static async getOfferByIdWithBusiness(id: string): Promise<{ data: OfferWithBusiness | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          business:businesses(
            id,
            name,
            slug,
            main_image_url,
            address,
            city,
            state
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data: data as OfferWithBusiness, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener ofertas de un negocio específico
   */
  static async getOffersByBusiness(businessId: string): Promise<{ data: Offer[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener ofertas vigentes de un negocio
   */
  static async getValidOffersByBusiness(businessId: string): Promise<{ data: Offer[] | null; error: Error | null }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .or(`valid_from.is.null,valid_from.lte.${today}`)
        .or(`valid_until.is.null,valid_until.gte.${today}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener ofertas por zona (a través de los negocios)
   */
  static async getOffersByZone(zoneId: string): Promise<{ data: OfferWithBusiness[] | null; error: Error | null }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          business:businesses!inner(
            id,
            name,
            slug,
            main_image_url,
            address,
            city,
            state,
            zone_id
          )
        `)
        .eq('is_active', true)
        .eq('business.zone_id', zoneId)
        .or(`valid_from.is.null,valid_from.lte.${today}`)
        .or(`valid_until.is.null,valid_until.gte.${today}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as OfferWithBusiness[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener ofertas que están por vencer (próximos N días)
   */
  static async getExpiringSoonOffers(days: number = 7): Promise<{ data: Offer[] | null; error: Error | null }> {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      const todayStr = today.toISOString().split('T')[0];
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .not('valid_until', 'is', null)
        .gte('valid_until', todayStr)
        .lte('valid_until', futureDateStr)
        .order('valid_until', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener ofertas con descuento específico o mayor
   */
  static async getOffersByMinDiscount(minDiscount: number): Promise<{ data: Offer[] | null; error: Error | null }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .not('discount_percentage', 'is', null)
        .gte('discount_percentage', minDiscount)
        .or(`valid_from.is.null,valid_from.lte.${today}`)
        .or(`valid_until.is.null,valid_until.gte.${today}`)
        .order('discount_percentage', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Buscar ofertas por título o descripción
   */
  static async searchOffers(query: string): Promise<{ data: Offer[] | null; error: Error | null }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .or(`valid_from.is.null,valid_from.lte.${today}`)
        .or(`valid_until.is.null,valid_until.gte.${today}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Verificar si una oferta está vigente
   */
  static isOfferValid(offer: Offer): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!offer.is_active) return false;

    if (offer.valid_from) {
      const validFrom = new Date(offer.valid_from);
      validFrom.setHours(0, 0, 0, 0);
      if (today < validFrom) return false;
    }

    if (offer.valid_until) {
      const validUntil = new Date(offer.valid_until);
      validUntil.setHours(23, 59, 59, 999);
      if (today > validUntil) return false;
    }

    return true;
  }

  /**
   * Obtener días restantes de una oferta
   */
  static getDaysRemaining(offer: Offer): number | null {
    if (!offer.valid_until) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validUntil = new Date(offer.valid_until);
    validUntil.setHours(0, 0, 0, 0);

    const diffTime = validUntil.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : 0;
  }

  /**
   * Crear una nueva oferta
   */
  static async createOffer(offer: OfferInsert): Promise<{ data: Offer | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .insert(offer)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Actualizar una oferta
   */
  static async updateOffer(id: string, updates: OfferUpdate): Promise<{ data: Offer | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Desactivar una oferta
   */
  static async deactivateOffer(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Eliminar permanentemente una oferta
   */
  static async deleteOffer(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Desactivar ofertas vencidas automáticamente
   */
  static async deactivateExpiredOffers(): Promise<{ count: number; error: Error | null }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('offers')
        .update({ is_active: false })
        .eq('is_active', true)
        .not('valid_until', 'is', null)
        .lt('valid_until', today)
        .select('id');

      if (error) throw error;

      return { count: data?.length || 0, error: null };
    } catch (error) {
      return { count: 0, error: error as Error };
    }
  }

  /**
   * Contar ofertas vigentes de un negocio
   */
  static async countValidOffersByBusiness(businessId: string): Promise<{ count: number; error: Error | null }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { count, error } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('is_active', true)
        .or(`valid_from.is.null,valid_from.lte.${today}`)
        .or(`valid_until.is.null,valid_until.gte.${today}`);

      if (error) throw error;

      return { count: count || 0, error: null };
    } catch (error) {
      return { count: 0, error: error as Error };
    }
  }

  /**
   * Suscribirse a cambios en ofertas
   */
  static subscribeToChanges(
    callback: (payload: RealtimePostgresChangesPayload<Offer>) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel('offers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
        },
        callback
      )
      .subscribe();

    return channel;
  }

  /**
   * Suscribirse a ofertas de un negocio específico
   */
  static subscribeToBusinessOffers(
    businessId: string,
    callback: (payload: RealtimePostgresChangesPayload<Offer>) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`offers-business-${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
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