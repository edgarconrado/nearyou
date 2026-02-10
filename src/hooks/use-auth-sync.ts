// hooks/useAuthSync.ts
import { ClerkSupabaseService } from '@/services/clerk-supabase.service';
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useRef } from 'react';

/**
 * Hook para sincronizar automáticamente usuarios de Clerk con Supabase
 * Se ejecuta cuando el usuario inicia sesión
 */
export function useAuthSync() {
    const { user, isLoaded } = useUser();
    const hasSyncedRef = useRef(false);

    useEffect(() => {
        const syncUser = async () => {
            if (!isLoaded || !user || hasSyncedRef.current) {
                return;
            }

            try {
                hasSyncedRef.current = true;
                const { error } = await ClerkSupabaseService.syncUserWithSupabase(user);
            } catch (error) {
            }
        };

        syncUser();
    }, [user, isLoaded]);

    return { user, isLoaded };
}