// services/zones.service.ts
import type { Zone } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export class ZonesService {
  /**
   * Obtener todas las zonas activas ordenadas alfabéticamente
   */
  static async getAllActiveZones(): Promise<{ data: Zone[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching zones:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener una zona por ID
   */
  static async getZoneById(id: string): Promise<{ data: Zone | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching zone by id:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener una zona por slug
   */
  static async getZoneBySlug(slug: string): Promise<{ data: Zone | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching zone by slug:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener zonas por estado
   */
  static async getZonesByState(state: string): Promise<{ data: Zone[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('state', state)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching zones by state:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Crear una nueva zona
   */
  static async createZone(zone: Omit<Zone, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Zone | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .insert(zone)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating zone:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Crear una zona con imagen (sube la imagen primero y luego crea la zona)
   */
  static async createZoneWithImage(
    zone: Omit<Zone, 'id' | 'created_at' | 'updated_at' | 'image_url'>,
    imageFile: string
  ): Promise<{ data: Zone | null; error: Error | null }> {
    try {
      // Importar StorageService aquí para evitar dependencias circulares
      const { StorageService } = await import('./storage.service');

      // Subir imagen primero
      const { url, error: uploadError } = await StorageService.uploadZoneImage(
        imageFile,
        zone.name
      );

      if (uploadError) throw uploadError;

      // Crear zona con la URL de la imagen
      const zoneWithImage = {
        ...zone,
        image_url: url,
      };

      return await this.createZone(zoneWithImage);
    } catch (error) {
      console.error('Error creating zone with image:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Actualizar una zona existente
   */
  static async updateZone(id: string, updates: Partial<Zone>): Promise<{ data: Zone | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating zone:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Actualizar zona con nueva imagen (elimina la anterior)
   */
  static async updateZoneWithImage(
    id: string,
    updates: Partial<Zone>,
    imageFile: string,
    oldImageUrl?: string | null
  ): Promise<{ data: Zone | null; error: Error | null }> {
    try {
      const { StorageService } = await import('./storage.service');

      // Subir nueva imagen (y eliminar la anterior)
      const { url, error: uploadError } = await StorageService.updateZoneImage(
        imageFile,
        updates.name || 'zone',
        oldImageUrl
      );

      if (uploadError) throw uploadError;

      // Actualizar zona con nueva URL
      const updatesWithImage = {
        ...updates,
        image_url: url,
      };

      return await this.updateZone(id, updatesWithImage);
    } catch (error) {
      console.error('Error updating zone with image:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Eliminar una zona (soft delete - marcar como inactiva)
   */
  static async deactivateZone(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('zones')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deactivating zone:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Eliminar permanentemente una zona
   */
  static async deleteZone(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('zones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting zone:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Suscribirse a cambios en tiempo real de la tabla zones
   */
  static subscribeToChanges(
    callback: (payload: RealtimePostgresChangesPayload<Zone>) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel('zones-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'zones',
        },
        callback
      )
      .subscribe();

    return channel;
  }

  /**
   * Cancelar suscripción a cambios en tiempo real
   */
  static unsubscribeFromChanges(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
  }
}