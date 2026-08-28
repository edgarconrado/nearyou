// services/business-hours.service.ts
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

export type BusinessHour = Database['public']['Tables']['business_hours']['Row'];
export type BusinessHourInsert = Database['public']['Tables']['business_hours']['Insert'];
export type BusinessHourUpdate = Database['public']['Tables']['business_hours']['Update'];

export interface FormattedBusinessHours {
  day: string;
  dayOfWeek: number;
  opensAt: string | null;
  closesAt: string | null;
  isClosed: boolean;
  isToday: boolean;
}

export class BusinessHoursService {
  /**
   * Obtener nombres de días traducidos
   * @param t - Función de traducción del contexto useLanguage
   */
  private static getDayNames(t: (key: string) => string): string[] {
    return [
      t('detail.sunday'),    // 0
      t('detail.monday'),    // 1
      t('detail.tuesday'),   // 2
      t('detail.wednesday'), // 3
      t('detail.thursday'),  // 4
      t('detail.friday'),    // 5
      t('detail.saturday'),  // 6
    ];
  }

  /**
   * Obtener horarios de un negocio
   */
  static async getBusinessHours(businessId: string): Promise<{ 
    data: BusinessHour[] | null; 
    error: Error | null 
  }> {
    try {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('business_id', businessId)
        .order('day_of_week', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener horarios formateados para mostrar en UI
   * AHORA RECIBE LA FUNCIÓN DE TRADUCCIÓN
   */
  static async getFormattedBusinessHours(
    businessId: string,
    t: (key: string) => string // <-- NUEVO PARÁMETRO
  ): Promise<{ 
    data: FormattedBusinessHours[] | null; 
    error: Error | null 
  }> {
    try {
      const { data: hours, error } = await this.getBusinessHours(businessId);

      if (error) throw error;

      if (!hours) {
        return { data: null, error: null };
      }

      const today = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.
      const dayNames = this.getDayNames(t); // <-- USAR DÍAS TRADUCIDOS

      const formatted = hours.map(hour => ({
        day: dayNames[hour.day_of_week], // <-- NOMBRE TRADUCIDO
        dayOfWeek: hour.day_of_week,
        opensAt: hour.opens_at,
        closesAt: hour.closes_at,
        isClosed: hour.is_closed || false,
        isToday: hour.day_of_week === today,
      }));

      return { data: formatted, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Verificar si un negocio está abierto ahora
   */
  static async isBusinessOpen(businessId: string): Promise<{ 
    isOpen: boolean; 
    error: Error | null 
  }> {
    try {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

      const { data: hours, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('business_id', businessId)
        .eq('day_of_week', dayOfWeek)
        .maybeSingle();

      if (error) {
        return { isOpen: false, error: error as Error };
      }

      // Si no hay horarios definidos
      if (!hours) {
        return { isOpen: false, error: null };
      }

      // Si está marcado como cerrado
      if (hours.is_closed) {
        return { isOpen: false, error: null };
      }

      // Si no tiene horarios definidos
      if (!hours.opens_at || !hours.closes_at) {
        return { isOpen: false, error: null };
      }

      // Comparar horarios
      const isOpen = currentTime >= hours.opens_at && currentTime <= hours.closes_at;

      return { isOpen, error: null };
    } catch (error) {
      return { isOpen: false, error: error as Error };
    }
  }

  /**
   * Obtener horario de hoy
   */
  static async getTodayHours(businessId: string): Promise<{ 
    data: BusinessHour | null; 
    error: Error | null 
  }> {
    try {
      const dayOfWeek = new Date().getDay();

      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('business_id', businessId)
        .eq('day_of_week', dayOfWeek)
        .maybeSingle();

      if (error) {
        return { data: null, error: error as Error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener hora de cierre de hoy
   */
  static async getTodayClosingTime(businessId: string): Promise<{ 
    closingTime: string | null; 
    error: Error | null 
  }> {
    try {
      const { data: todayHours, error } = await this.getTodayHours(businessId);

      if (error || !todayHours) {
        return { closingTime: null, error: error };
      }

      if (todayHours.is_closed || !todayHours.closes_at) {
        return { closingTime: null, error: null };
      }

      return { closingTime: todayHours.closes_at, error: null };
    } catch (error) {
      return { closingTime: null, error: error as Error };
    }
  }

  /**
   * Formatear hora de 24h a 12h con AM/PM
   * AHORA RECIBE LA FUNCIÓN DE TRADUCCIÓN
   */
  static formatTime(time: string | null, t: (key: string) => string): string {
    if (!time) return t('common.closed'); // <-- TRADUCIDO

    try {
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch {
      return time;
    }
  }

  /**
   * Formatear rango de horas para mostrar
   * AHORA RECIBE LA FUNCIÓN DE TRADUCCIÓN
   */
  static formatHoursRange(
    opensAt: string | null, 
    closesAt: string | null, 
    isClosed: boolean,
    t: (key: string) => string // <-- NUEVO PARÁMETRO
  ): string {
    if (isClosed) return t('common.closed'); // <-- TRADUCIDO
    if (!opensAt || !closesAt) return t('detail.noSchedule'); // <-- TRADUCIDO
    
    return `${this.formatTime(opensAt, t)} - ${this.formatTime(closesAt, t)}`;
  }

  /**
   * Crear horarios para un negocio
   */
  static async createBusinessHours(
    businessId: string,
    hours: Omit<BusinessHourInsert, 'business_id'>[]
  ): Promise<{ data: BusinessHour[] | null; error: Error | null }> {
    try {
      const hoursWithBusinessId = hours.map(hour => ({
        ...hour,
        business_id: businessId,
      }));

      const { data, error } = await supabase
        .from('business_hours')
        .insert(hoursWithBusinessId)
        .select();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Actualizar horarios de un día específico
   */
  static async updateDayHours(
    id: string,
    updates: BusinessHourUpdate
  ): Promise<{ data: BusinessHour | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('business_hours')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Eliminar horarios de un negocio
   */
  static async deleteBusinessHours(businessId: string): Promise<{ 
    success: boolean; 
    error: Error | null 
  }> {
    try {
      const { error } = await supabase
        .from('business_hours')
        .delete()
        .eq('business_id', businessId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Crear horarios estándar (Lun-Vie 9-6, Sáb 10-4, Dom cerrado)
   */
  static async createStandardHours(
    businessId: string,
    weekdayHours: { opensAt: string; closesAt: string } = { opensAt: '09:00', closesAt: '18:00' },
    saturdayHours: { opensAt: string; closesAt: string } = { opensAt: '10:00', closesAt: '16:00' }
  ): Promise<{ data: BusinessHour[] | null; error: Error | null }> {
    const standardHours: Omit<BusinessHourInsert, 'business_id'>[] = [
      // Domingo - Cerrado
      { day_of_week: 0, opens_at: null, closes_at: null, is_closed: true },
      // Lunes a Viernes
      ...Array.from({ length: 5 }, (_, i) => ({
        day_of_week: i + 1,
        opens_at: weekdayHours.opensAt,
        closes_at: weekdayHours.closesAt,
        is_closed: false,
      })),
      // Sábado
      { day_of_week: 6, opens_at: saturdayHours.opensAt, closes_at: saturdayHours.closesAt, is_closed: false },
    ];

    return this.createBusinessHours(businessId, standardHours);
  }
}