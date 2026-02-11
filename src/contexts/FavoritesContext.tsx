// contexts/FavoritesContext.tsx
import { FavoritesService, type FavoriteWithBusiness } from '@/services/favorites.service';
import { useAuth } from '@clerk/clerk-expo';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface FavoritesContextType {
    favorites: FavoriteWithBusiness[];
    favoriteIds: Set<string>;
    loading: boolean;
    error: Error | null;
    isFavorite: (businessId: string) => boolean;
    toggleFavorite: (businessId: string) => Promise<boolean>;
    removeFavorite: (businessId: string) => Promise<boolean>;
    refetch: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { userId, isSignedIn } = useAuth();

    const [favorites, setFavorites] = useState<FavoriteWithBusiness[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Derivado: IDs de negocios favoritos
    const favoriteIds = useMemo(
        () => new Set(favorites.map(f => f.business_id).filter(Boolean)),
        [favorites]
    );

    // Fetch principal
    const fetchFavorites = useCallback(async () => {
        if (!userId || !isSignedIn) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const { data, error } = await FavoritesService.getUserFavoritesWithBusiness(userId);

        if (error) {
            setError(error);
            setFavorites([]);
        } else {
            setFavorites(data ?? []);
        }

        setLoading(false);
    }, [userId, isSignedIn]);

    // Load inicial
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // Helper: verificar si es favorito
    const isFavorite = useCallback(
        (businessId: string) => favoriteIds.has(businessId),
        [favoriteIds]
    );

    // Toggle favorito (optimista)
    const toggleFavorite = useCallback(
        async (businessId: string): Promise<boolean> => {
            if (!userId || !isSignedIn) return false;

            // Update optimista
            const wasIsFavorite = favoriteIds.has(businessId);

            if (wasIsFavorite) {
                // Remover localmente primero (optimista)
                setFavorites(prev => prev.filter(f => f.business_id !== businessId));
            }

            // Hacer el toggle en el servidor
            const result = await FavoritesService.toggleFavorite(userId, businessId);

            if (result.error) {
                // Revertir cambio optimista
                await fetchFavorites();
                return false;
            }

            // Si se agregó, refrescar para obtener los datos completos del negocio
            if (result.isFavorite) {
                await fetchFavorites();
            }

            return true;
        },
        [userId, isSignedIn, favoriteIds, fetchFavorites]
    );

    // Remover favorito (optimista)
    const removeFavorite = useCallback(
        async (businessId: string): Promise<boolean> => {
            if (!userId || !isSignedIn) return false;

            // Update optimista
            setFavorites(prev => prev.filter(f => f.business_id !== businessId));

            const { success } = await FavoritesService.removeFavorite(userId, businessId);

            if (!success) {
                // Revertir cambio optimista
                await fetchFavorites();
                return false;
            }

            return true;
        },
        [userId, isSignedIn, fetchFavorites]
    );

    const value = {
        favorites,
        favoriteIds,
        loading,
        error,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        refetch: fetchFavorites,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavoritesContext must be used within a FavoritesProvider');
    }
    return context;
}