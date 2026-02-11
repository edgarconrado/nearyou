// hooks/useOffers.ts
import type { Offer, OfferWithBusiness } from '@services/offers.service';
import { OffersService } from '@services/offers.service';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface UseOffersOptions {
  businessId?: string;
  zoneId?: string;
  withBusiness?: boolean;
  autoRefresh?: boolean;
}

export function useOffers(options: UseOffersOptions = {}) {
  const { businessId, zoneId, withBusiness = true, autoRefresh = false } = options;
  
  const [offers, setOffers] = useState<OfferWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();

    if (autoRefresh) {
      const channel = businessId
        ? OffersService.subscribeToBusinessOffers(businessId, handleRealtimeChange)
        : OffersService.subscribeToChanges(handleRealtimeChange);

      return () => {
        OffersService.unsubscribeFromChanges(channel);
      };
    }
  }, [businessId, zoneId, autoRefresh]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: OfferWithBusiness[] | Offer[] | null = null;
      let fetchError: Error | null = null;

      if (businessId) {
        const result = await OffersService.getValidOffersByBusiness(businessId);
        data = result.data;
        fetchError = result.error;
      } else if (zoneId) {
        const result = await OffersService.getOffersByZone(zoneId);
        data = result.data;
        fetchError = result.error;
      } else if (withBusiness) {
        const result = await OffersService.getValidOffersWithBusiness();
        data = result.data;
        fetchError = result.error;
      } else {
        const result = await OffersService.getValidOffers();
        data = result.data;
        fetchError = result.error;
      }

      if (fetchError) throw fetchError;

      setOffers(data as OfferWithBusiness[] || []);
    } catch (err) {
      setError('Error al cargar las ofertas');
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeChange = (payload: RealtimePostgresChangesPayload<Offer>) => {
    switch (payload.eventType) {
      case 'INSERT':
        if (OffersService.isOfferValid(payload.new)) {
          fetchOffers(); // Refetch para obtener datos completos con join
        }
        break;

      case 'UPDATE':
        if (OffersService.isOfferValid(payload.new)) {
          fetchOffers();
        } else {
          // Remover si ya no es válida
          setOffers(current => current.filter(o => o.id !== payload.new.id));
        }
        break;

      case 'DELETE':
        setOffers(current => current.filter(o => o.id !== payload.old.id));
        break;
    }
  };

  const refetch = () => {
    fetchOffers();
  };

  return {
    offers,
    loading,
    error,
    refetch,
  };
}

// Hook especializado para ofertas de un negocio
export function useBusinessOffers(businessId: string, autoRefresh = false) {
  return useOffers({ businessId, withBusiness: false, autoRefresh });
}

// Hook especializado para ofertas de una zona
export function useZoneOffers(zoneId: string, autoRefresh = false) {
  return useOffers({ zoneId, withBusiness: true, autoRefresh });
}