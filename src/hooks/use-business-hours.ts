// hooks/use-business-hours.ts
import { useLanguage } from '@/contexts/LanguageContext';
import { BusinessHoursService } from '@/services/business-hours.service';
import { useEffect, useState } from 'react';

export interface FormattedHour {
  day: string;
  opensAt: string | null;
  closesAt: string | null;
  isClosed: boolean;
  isToday: boolean;
  dayOfWeek: number;
}

export function useBusinessHours(businessId: string | undefined) {
  const { t, language } = useLanguage(); // <-- Obtener idioma actual
  const [hours, setHours] = useState<FormattedHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [closingTimeFormatted, setClosingTimeFormatted] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setHours([]);
      setLoading(false);
      return;
    }

    loadBusinessHours();
  }, [businessId, language]); // <-- IMPORTANTE: Agregar language como dependencia

  const loadBusinessHours = async () => {
    if (!businessId) return;

    try {
      setLoading(true);

      // Obtener horarios formateados con traducción
      const { data, error } = await BusinessHoursService.getFormattedBusinessHours(
        businessId,
        t // <-- Pasar la función de traducción
      );

      if (error || !data) {
        setHours([]);
        setIsOpen(false);
        setClosingTimeFormatted(null);
        return;
      }

      setHours(data);

      // Verificar si está abierto
      const { isOpen: businessIsOpen } = await BusinessHoursService.isBusinessOpen(businessId);
      setIsOpen(businessIsOpen);

      // Obtener hora de cierre
      const { closingTime } = await BusinessHoursService.getTodayClosingTime(businessId);
      if (closingTime) {
        const formatted = BusinessHoursService.formatTime(closingTime, t);
        setClosingTimeFormatted(formatted);
      } else {
        setClosingTimeFormatted(null);
      }

    } catch (error) {
      console.error('Error loading business hours:', error);
      setHours([]);
      setIsOpen(false);
      setClosingTimeFormatted(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    hours,
    loading,
    isOpen,
    closingTimeFormatted,
    refresh: loadBusinessHours,
  };
}