// hooks/use-zone-details.ts
import type { Zone } from '@/services/zones.service';
import { ZonesService } from '@/services/zones.service';
import { useEffect, useState } from 'react';

export function useZoneDetails(zoneId: string | undefined) {
  const [zone, setZone] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!zoneId) {
      setLoading(false);
      return;
    }

    loadZoneDetails();
  }, [zoneId]);

  const loadZoneDetails = async () => {
    if (!zoneId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await ZonesService.getZoneById(zoneId);

      if (fetchError) {
        throw fetchError;
      }

      setZone(data);
    } catch (err) {
      console.error('Error loading zone details:', err);
      setError('Error al cargar información de la zona');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadZoneDetails();
  };

  return {
    zone,
    loading,
    error,
    refetch,
    hasDescription: Boolean(zone?.description),
    hasGallery: Boolean(zone?.gallery_urls && zone.gallery_urls.length > 0),
    galleryImages: zone?.gallery_urls || [],
  };
}