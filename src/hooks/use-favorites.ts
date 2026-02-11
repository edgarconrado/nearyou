// hooks/use-favorites.ts
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { FavoritesService } from '@/services/favorites.service';
import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook principal que usa el contexto global de favoritos
 * Todos los cambios se sincronizan automáticamente
 */
export function useFavorites() {
  return useFavoritesContext();
}

/**
 * Hook simplificado para manejar favorito de un solo negocio
 * Útil para pantallas de detalle
 * Usa el contexto para sincronizar cambios
 */
export function useBusinessFavorite(businessId: string | null) {
  const { userId, isSignedIn } = useAuth();
  const { isFavorite: checkIsFavorite, toggleFavorite: globalToggle } = useFavoritesContext();

  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Estado local derivado del contexto global
  const isFavorite = businessId ? checkIsFavorite(businessId) : false;

  // Verificar estado inicial
  useEffect(() => {
    const checkFavorite = async () => {
      if (!userId || !isSignedIn || !businessId) {
        setLoading(false);
        return;
      }


      const result = await FavoritesService.isFavorite(userId, businessId);

      setLoading(false);
    };

    checkFavorite();
  }, [userId, isSignedIn, businessId]);

  // Toggle favorito usando el contexto global
  const toggle = useCallback(async (): Promise<boolean> => {
    if (!userId || !isSignedIn || !businessId) {
      return false;
    }

    setToggling(true);
    setError(null);

    // Usar el toggle del contexto global (sincroniza con todas las pantallas)
    const success = await globalToggle(businessId);

    if (!success) {
      setError(new Error('Failed to toggle favorite'));
    }

    setToggling(false);
    return success;
  }, [userId, isSignedIn, businessId, globalToggle]);

  return {
    isFavorite,
    loading,
    toggling,
    toggle,
    error,
    userId,
    isSignedIn,
  };
}