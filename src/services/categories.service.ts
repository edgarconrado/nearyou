// services/categories.service.ts
import type { Database } from '@/types/database.types';
import { supabase } from '@lib/supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export class CategoriesService {
  /**
   * Obtener todas las categorías activas
   */
  static async getAllActiveCategories(): Promise<{ data: Category[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener todas las categorías (incluidas inactivas)
   */
  static async getAllCategories(): Promise<{ data: Category[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching all categories:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener una categoría por ID
   */
  static async getCategoryById(id: string): Promise<{ data: Category | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching category by id:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obtener una categoría por slug
   */
  static async getCategoryBySlug(slug: string): Promise<{ data: Category | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Crear una nueva categoría
   */
  static async createCategory(category: CategoryInsert): Promise<{ data: Category | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating category:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Actualizar una categoría
   */
  static async updateCategory(id: string, updates: CategoryUpdate): Promise<{ data: Category | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating category:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Desactivar una categoría
   */
  static async deactivateCategory(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deactivating category:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Eliminar permanentemente una categoría
   */
  static async deleteCategory(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Suscribirse a cambios en tiempo real
   */
  static subscribeToChanges(
    callback: (payload: RealtimePostgresChangesPayload<Category>) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
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