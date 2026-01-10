// hooks/useBusinesses.ts
import type { Business, BusinessFull } from '@/services/businesses.service';
import { BusinessesService } from '@/services/businesses.service';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface UseBusinessesOptions {
  zoneId?: string;
  categoryId?: string;
  searchQuery?: string;
  useFull?: boolean; // Si queremos usar businesses_full view
  autoRefresh?: boolean;
}

export function useBusinesses(options: UseBusinessesOptions = {}) {
  const { 
    zoneId, 
    categoryId, 
    searchQuery, 
    useFull = true, 
    autoRefresh = false 
  } = options;
  
  const [businesses, setBusinesses] = useState<BusinessFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinesses();

    if (autoRefresh) {
      const channel = BusinessesService.subscribeToChanges(handleRealtimeChange);

      return () => {
        BusinessesService.unsubscribeFromChanges(channel);
      };
    }
  }, [zoneId, categoryId, searchQuery, autoRefresh]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: BusinessFull[] | Business[] | null = null;
      let fetchError: Error | null = null;

      // Si hay búsqueda, priorizar eso
      if (searchQuery && searchQuery.trim().length > 0) {
        const result = await BusinessesService.searchBusinesses(searchQuery);
        data = result.data;
        fetchError = result.error;
      }
      // Si hay zona y categoría
      else if (zoneId && categoryId) {
        const result = await BusinessesService.getBusinessesByZoneAndCategory(zoneId, categoryId);
        data = result.data;
        fetchError = result.error;
      }
      // Si solo hay zona
      else if (zoneId) {
        if (useFull) {
          const result = await BusinessesService.getBusinessesFullByZone(zoneId);
          data = result.data;
          fetchError = result.error;
        } else {
          const result = await BusinessesService.getBusinessesByZone(zoneId);
          data = result.data;
          fetchError = result.error;
        }
      }
      // Si solo hay categoría
      else if (categoryId) {
        const result = await BusinessesService.getBusinessesByCategory(categoryId);
        data = result.data;
        fetchError = result.error;
      }
      // Si no hay filtros, traer todos
      else {
        if (useFull) {
          const result = await BusinessesService.getAllBusinessesFull();
          data = result.data;
          fetchError = result.error;
        } else {
          const result = await BusinessesService.getAllActiveBusinesses();
          data = result.data;
          fetchError = result.error;
        }
      }

      if (fetchError) throw fetchError;

      setBusinesses(data as BusinessFull[] || []);
    } catch (err) {
      console.error('Error in useBusinesses:', err);
      setError('Error al cargar los negocios');
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeChange = (payload: RealtimePostgresChangesPayload<Business>) => {
    console.log('Cambio en negocios:', payload);

    switch (payload.eventType) {
      case 'INSERT':
        if (payload.new.is_active) {
          fetchBusinesses(); // Refetch para obtener datos completos
        }
        break;

      case 'UPDATE':
        if (payload.new.is_active) {
          fetchBusinesses();
        } else {
          // Remover si ya no está activo
          setBusinesses(current => current.filter(b => b.id !== payload.new.id));
        }
        break;

      case 'DELETE':
        setBusinesses(current => current.filter(b => b.id !== payload.old.id));
        break;
    }
  };

  const refetch = () => {
    fetchBusinesses();
  };

  return {
    businesses,
    loading,
    error,
    refetch,
  };
}

// Hook especializado para negocios de una zona
export function useZoneBusinesses(zoneId: string, autoRefresh = false) {
  return useBusinesses({ zoneId, useFull: true, autoRefresh });
}

// Hook especializado para negocios por categoría
export function useCategoryBusinesses(categoryId: string, autoRefresh = false) {
  return useBusinesses({ categoryId, useFull: true, autoRefresh });
}

// Hook especializado para búsqueda
export function useSearchBusinesses(searchQuery: string) {
  return useBusinesses({ searchQuery, useFull: false, autoRefresh: false });
}

// Hook especializado para negocios de zona y categoría
export function useZoneCategoryBusinesses(
  zoneId: string, 
  categoryId: string, 
  autoRefresh = false
) {
  return useBusinesses({ zoneId, categoryId, useFull: false, autoRefresh });
}