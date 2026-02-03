// hooks/useUserStats.ts
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface UserStats {
  favorites: number;
  reviews: number;
  visits: number;
}

export function useUserStats(userId: string | null) {
  const [stats, setStats] = useState<UserStats>({
    favorites: 0,
    reviews: 0,
    visits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      if (!userId) return;

      // Obtener favoritos
      const { count: favoritesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Obtener reseñas
      const { count: reviewsCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Obtener visitas
      const { count: visitsCount } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      setStats({
        favorites: favoritesCount || 0,
        reviews: reviewsCount || 0,
        visits: visitsCount || 0,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
}