// services/moderation.service.ts
//
// Reporte y bloqueo de contenido — requisito de la guía 1.2 de App Store para
// apps con contenido generado por usuarios. Apple exige tres cosas:
//   1. Un método para filtrar contenido objetable
//   2. Un mecanismo para reportar, con respuesta oportuna
//   3. La capacidad de bloquear usuarios abusivos

import { supabase } from '@/lib/supabase';

export const REPORT_REASONS = [
  { key: 'spam', label: 'Spam o publicidad' },
  { key: 'offensive', label: 'Lenguaje ofensivo o discurso de odio' },
  { key: 'inappropriate', label: 'Contenido sexual o inapropiado' },
  { key: 'false', label: 'Información falsa o engañosa' },
  { key: 'harassment', label: 'Acoso o ataque personal' },
  { key: 'other', label: 'Otro motivo' },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]['key'];

export class ModerationService {
  /** Registra un reporte sobre una reseña. */
  static async reportReview(params: {
    reviewId: string;
    reason: ReportReason;
    description?: string;
  }) {
    try {
      const { data: session } = await supabase.auth.getUser();
      const reporterId = session.user?.id;

      if (!reporterId) {
        return { success: false, error: new Error('Debes iniciar sesión') };
      }

      const { error } = await supabase.from('reported_content').insert({
        content_type: 'review',
        content_id: params.reviewId,
        reporter_id: reporterId,
        reason: params.reason,
        description: params.description?.trim() || null,
        status: 'pending',
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Bloquea a un usuario: sus reseñas dejan de mostrarse para quien bloquea.
   * Es unilateral y reversible.
   */
  static async blockUser(blockedUserId: string) {
    try {
      const { data: session } = await supabase.auth.getUser();
      const blockerId = session.user?.id;

      if (!blockerId) {
        return { success: false, error: new Error('Debes iniciar sesión') };
      }

      if (blockerId === blockedUserId) {
        return { success: false, error: new Error('No puedes bloquearte a ti mismo') };
      }

      const { error } = await supabase
        .from('blocked_users')
        .insert({ blocker_id: blockerId, blocked_id: blockedUserId });

      // 23505 = ya existe; bloquear dos veces no es un error para el usuario
      if (error && error.code !== '23505') throw error;

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  static async unblockUser(blockedUserId: string) {
    try {
      const { data: session } = await supabase.auth.getUser();
      const blockerId = session.user?.id;
      if (!blockerId) return { success: false, error: new Error('Debes iniciar sesión') };

      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', blockerId)
        .eq('blocked_id', blockedUserId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /** IDs que el usuario actual ha bloqueado, para filtrar reseñas en pantalla. */
  static async getBlockedIds(): Promise<Set<string>> {
    try {
      const { data: session } = await supabase.auth.getUser();
      const blockerId = session.user?.id;
      if (!blockerId) return new Set();

      const { data, error } = await supabase
        .from('blocked_users')
        .select('blocked_id')
        .eq('blocker_id', blockerId);

      if (error || !data) return new Set();
      return new Set(data.map((r) => r.blocked_id as string));
    } catch {
      return new Set();
    }
  }
}
