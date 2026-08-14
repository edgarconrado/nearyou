// services/account.service.ts
// Eliminación de cuenta con 30 días de gracia — requisito de App Store 5.1.1(v).
//
// Pedir la eliminación NO borra nada de inmediato: marca el perfil y cierra
// sesión. Si el usuario vuelve a entrar dentro de la ventana, puede cancelar.
// La purga real la hace un job diario (pg_cron) en la base.

import { supabase } from '@/lib/supabase';

export const GRACE_PERIOD_DAYS = 30;

export type DeletionStatus = {
    pending: boolean;
    requestedAt: Date | null;
    /** Días que faltan para la purga. Null si no hay eliminación pendiente. */
    daysRemaining: number | null;
};

export class AccountService {
    /** Marca la cuenta para eliminación y cierra sesión. */
    static async requestDeletion() {
        try {
            const { error } = await supabase.rpc('request_account_deletion');
            if (error) throw error;

            await supabase.auth.signOut();
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    /** Cancela una eliminación pendiente y reactiva el perfil. */
    static async cancelDeletion() {
        try {
            const { error } = await supabase.rpc('cancel_account_deletion');
            if (error) throw error;
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    /** Consulta si hay una eliminación pendiente y cuánto falta. */
    static async getDeletionStatus(userId: string): Promise<DeletionStatus> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('deletion_requested_at')
                .eq('id', userId)
                .maybeSingle();

            if (error || !data?.deletion_requested_at) {
                return { pending: false, requestedAt: null, daysRemaining: null };
            }

            const requestedAt = new Date(data.deletion_requested_at);
            const purgeAt = new Date(requestedAt);
            purgeAt.setDate(purgeAt.getDate() + GRACE_PERIOD_DAYS);

            const msLeft = purgeAt.getTime() - Date.now();
            const daysRemaining = Math.max(0, Math.ceil(msLeft / 86400000));

            return { pending: true, requestedAt, daysRemaining };
        } catch {
            return { pending: false, requestedAt: null, daysRemaining: null };
        }
    }
}