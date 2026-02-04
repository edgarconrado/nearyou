import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook simplificado para favoritos con Clerk (SIN necesidad de configurar JWT)
 * NOTA: Requiere que RLS esté deshabilitado en la tabla favorites
 * Para producción, habilita RLS y configura Auth Hook en Supabase
 */
export function useBusinessFavorite(businessId: string) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Obtener userId desde Clerk
    const { userId, isSignedIn } = useAuth();

    // Log del estado
    useEffect(() => {
        console.log('[useBusinessFavorite] Auth:', { 
            userId, 
            isSignedIn, 
            businessId 
        });
    }, [userId, isSignedIn, businessId]);

    // Verificar si es favorito
    useEffect(() => {
        const checkFavorite = async () => {
            if (!userId || !isSignedIn || !businessId) {
                console.log('[useBusinessFavorite] Skipping - not signed in or no business');
                setLoading(false);
                return;
            }

            console.log('[useBusinessFavorite] Checking favorite');

            try {
                const { data, error: queryError } = await supabase
                    .from('favorites')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('business_id', businessId)
                    .maybeSingle();

                if (queryError) {
                    console.error('[useBusinessFavorite] Query error:', queryError);
                    setError(queryError.message);
                    setIsFavorite(false);
                } else {
                    const isFav = !!data;
                    console.log('[useBusinessFavorite] Is favorite:', isFav);
                    setIsFavorite(isFav);
                    setError(null);
                }
            } catch (err) {
                console.error('[useBusinessFavorite] Exception:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
                setIsFavorite(false);
            } finally {
                setLoading(false);
            }
        };

        checkFavorite();
    }, [userId, businessId, isSignedIn]);

    // Toggle favorito
    const toggle = async (): Promise<boolean> => {
        if (!userId || !isSignedIn) {
            console.error('[useBusinessFavorite] Cannot toggle - not signed in');
            setError('Usuario no autenticado');
            return false;
        }

        if (!businessId) {
            console.error('[useBusinessFavorite] Cannot toggle - no business ID');
            setError('ID de negocio inválido');
            return false;
        }

        console.log('[useBusinessFavorite] Toggling favorite');
        setToggling(true);
        setError(null);

        try {
            if (isFavorite) {
                // Eliminar de favoritos
                console.log('[useBusinessFavorite] Removing favorite');
                
                const { error: deleteError } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', userId)
                    .eq('business_id', businessId);

                if (deleteError) {
                    console.error('[useBusinessFavorite] Delete error:', deleteError);
                    setError(deleteError.message);
                    return false;
                }

                console.log('[useBusinessFavorite] Favorite removed');
                setIsFavorite(false);
            } else {
                // Agregar a favoritos
                console.log('[useBusinessFavorite] Adding favorite');
                
                const { error: insertError } = await supabase
                    .from('favorites')
                    .insert({
                        user_id: userId,
                        business_id: businessId,
                    });

                if (insertError) {
                    console.error('[useBusinessFavorite] Insert error:', insertError);
                    setError(insertError.message);
                    return false;
                }

                console.log('[useBusinessFavorite] Favorite added');
                setIsFavorite(true);
            }

            return true;
        } catch (err) {
            console.error('[useBusinessFavorite] Exception toggling:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
            return false;
        } finally {
            setToggling(false);
        }
    };

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

/**
 * Hook para obtener todos los favoritos del usuario
 */
export function useFavorites() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    
    const { userId, isSignedIn } = useAuth();

    const fetchFavorites = useCallback(async () => {
        if (!userId || !isSignedIn) {
            console.log('[useFavorites] User not signed in');
            setLoading(false);
            return;
        }

        console.log('[useFavorites] Fetching favorites for user:', userId);

        try {
            const { data, error } = await supabase
                .from('favorites')
                .select(`
                    id,
                    business_id,
                    created_at,
                    business:businesses (
                        id,
                        name,
                        slug,
                        main_image_url,
                        address,
                        city,
                        state,
                        average_rating,
                        total_reviews,
                        category:categories (
                            name
                        )
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('[useFavorites] Error fetching favorites:', error);
                return;
            }

            console.log('[useFavorites] Fetched favorites:', data?.length || 0);

            if (data) {
                setFavorites(data);
                
                const ids = new Set(
                    data
                        .map(fav => fav.business_id)
                        .filter((id): id is string => id !== null)
                );
                setFavoriteIds(ids);
            }
        } catch (error) {
            console.error('[useFavorites] Exception:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, isSignedIn]);

    useEffect(() => {
        if (isSignedIn && userId) {
            fetchFavorites();
        } else {
            setLoading(false);
        }
    }, [isSignedIn, userId, fetchFavorites]);

    const isFavorite = useCallback((businessId: string): boolean => {
        return favoriteIds.has(businessId);
    }, [favoriteIds]);

    const removeFavorite = useCallback(async (businessId: string): Promise<boolean> => {
        if (!userId || !isSignedIn) {
            console.error('[useFavorites] Cannot remove: User not signed in');
            return false;
        }

        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', userId)
                .eq('business_id', businessId);

            if (error) {
                console.error('[useFavorites] Error removing favorite:', error);
                return false;
            }

            setFavoriteIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(businessId);
                return newSet;
            });

            setFavorites(prev => prev.filter(fav => fav.business_id !== businessId));
            
            return true;
        } catch (error) {
            console.error('[useFavorites] Exception removing favorite:', error);
            return false;
        }
    }, [userId, isSignedIn]);

    return {
        favorites,
        favoriteIds,
        loading,
        userId,
        isSignedIn,
        isFavorite,
        removeFavorite,
        refetch: fetchFavorites,
    };
}