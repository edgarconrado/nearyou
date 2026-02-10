// hooks/useProfile.ts
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';
import { useEffect, useState } from 'react';

type Profile = Tables<'profiles'>;

export function useProfile(userId: string | null) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        fetchProfile();

        // Suscribirse a cambios en el perfil
        const subscription = supabase
            .channel('profile-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
                        setProfile(payload.new as Profile);
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [userId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!userId) {
                throw new Error('No hay usuario autenticado');
            }

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (fetchError) throw fetchError;

            setProfile(data);
        } catch (err) {
            console.error('Error al cargar perfil:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        try {
            if (!userId) {
                throw new Error('No hay usuario autenticado');
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId);

            if (updateError) throw updateError;

            // Recargar el perfil después de actualizar
            await fetchProfile();

            return { success: true };
        } catch (err) {
            console.error('Error al actualizar perfil:', err);
            return { success: false, error: err as Error };
        }
    };

    return {
        profile,
        loading,
        error,
        refetch: fetchProfile,
        updateProfile,
    };
}