// hooks/useBusinessHours.ts
import type { FormattedBusinessHours } from '@/services/business-hours.service';
import { BusinessHoursService } from '@/services/business-hours.service';
import { useEffect, useState } from 'react';

export function useBusinessHours(businessId: string | undefined) {
  const [hours, setHours] = useState<FormattedBusinessHours[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [closingTime, setClosingTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    loadBusinessHours();
  }, [businessId]);

  const loadBusinessHours = async () => {
    if (!businessId) return;

    try {
      setLoading(true);
      setError(null);

      // Cargar horarios formateados
      const { data: hoursData, error: hoursError } =
        await BusinessHoursService.getFormattedBusinessHours(businessId);
      setHours(hoursData || []);

      // Verificar si está abierto (solo si hay horarios)
      if (hoursData && hoursData.length > 0) {
        const { isOpen: openStatus, error: openError } =
          await BusinessHoursService.isBusinessOpen(businessId);

        if (!openError) {
          setIsOpen(openStatus);
        }

        // Obtener hora de cierre de hoy
        const { closingTime: closeTime, error: closeError } =
          await BusinessHoursService.getTodayClosingTime(businessId);

        if (!closeError && closeTime) {
          setClosingTime(closeTime);
        }
      }
    } catch (err) {
      // No establecer error - solo loguearlo
      // setError('Error al cargar horarios');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadBusinessHours();
  };

  return {
    hours,
    isOpen,
    closingTime,
    closingTimeFormatted: closingTime ? BusinessHoursService.formatTime(closingTime) : null,
    loading,
    error,
    refetch,
  };
}