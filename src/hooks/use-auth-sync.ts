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
                console.log('Sincronizando usuario con Supabase...');
                hasSyncedRef.current = true;

                const { error } = await ClerkSupabaseService.syncUserWithSupabase(user);

                if (error) {
                    console.error('Error sincronizando usuario:', error);
                    // No lanzamos el error para no interrumpir el flujo
                } else {
                    console.log('Usuario sincronizado exitosamente');
                }
            } catch (error) {
                console.error('Error en useAuthSync:', error);
            }
        };

        syncUser();
    }, [user, isLoaded]);

    return { user, isLoaded };
}