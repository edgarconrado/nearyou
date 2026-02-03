// hooks/useZones.ts
import type { Zone } from '@/lib/supabase';
import { ZonesService } from '@/services/zones.service';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchZones();

    // Suscribirse a cambios en tiempo real
    const channel = ZonesService.subscribeToChanges(handleRealtimeChange);

    // Cleanup: cancelar suscripción
    return () => {
      ZonesService.unsubscribeFromChanges(channel);
    };
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await ZonesService.getAllActiveZones();
      console.log("Data zones:", data);
      console.log("Error:", error);

      if (error) throw error;

      setZones(data || []);
    } catch (err) {
      console.error('Error in useZones:', err);
      setError('Error al cargar las zonas');
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeChange = (payload: RealtimePostgresChangesPayload<Zone>) => {
    console.log('Cambio en tiempo real:', payload);

    switch (payload.eventType) {
      case 'INSERT':
        // Solo agregar si está activa
        if (payload.new.is_active) {
          setZones((currentZones) => {
            // Evitar duplicados
            const exists = currentZones.some(z => z.id === payload.new.id);
            if (exists) return currentZones;

            // Insertar en orden alfabético
            const newZones = [...currentZones, payload.new];
            return newZones.sort((a, b) => a.name.localeCompare(b.name));
          });
        }
        break;

      case 'UPDATE':
        setZones((currentZones) => {
          // Si la zona se desactivó, removerla
          if (!payload.new.is_active) {
            return currentZones.filter(z => z.id !== payload.new.id);
          }

          // Actualizar la zona existente
          const updated = currentZones.map(zone =>
            zone.id === payload.new.id ? payload.new : zone
          );

          // Reordenar alfabéticamente
          return updated.sort((a, b) => a.name.localeCompare(b.name));
        });
        break;

      case 'DELETE':
        setZones((currentZones) =>
          currentZones.filter(zone => zone.id !== payload.old.id)
        );
        break;
    }
  };

  const refetch = () => {
    fetchZones();
  };

  return {
    zones,
    loading,
    error,
    refetch,
  };
}
