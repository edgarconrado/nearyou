import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserSettings } from '@/hooks/use-user-settings';
import { ModerationService, type BlockedUser } from '@/services/moderation.service';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Privacidad y seguridad.
 *
 * Se quitaron los interruptores de perfil público, mostrar email, mostrar
 * teléfono, permitir mensajes y compartir ubicación: ninguno tenía efecto
 * real, porque no existe pantalla de perfil público ni mensajería, y el
 * permiso de ubicación lo gobierna el sistema operativo. Una opción que no
 * hace nada es motivo de rechazo bajo la guía 2.1 de App Store.
 *
 * Queda «Mostrar actividad», que sí controla si las estadísticas se ven en
 * el perfil, más la lista de usuarios bloqueados (guía 1.2).
 */
export default function PrivacySettingsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { userId } = useAuth();
  const { settings, loading, updateSetting } = useUserSettings(userId);

  const [blocked, setBlocked] = useState<BlockedUser[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(true);

  const loadBlocked = useCallback(async () => {
    setLoadingBlocked(true);
    setBlocked(await ModerationService.getBlockedUsers());
    setLoadingBlocked(false);
  }, []);

  useEffect(() => {
    loadBlocked();
  }, [loadBlocked]);

  const handleUnblock = (user: BlockedUser) => {
    Alert.alert(
      'Desbloquear usuario',
      `Volverás a ver las reseñas de ${user.name}.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desbloquear',
          onPress: async () => {
            const { success, error } = await ModerationService.unblockUser(user.id);
            if (success) {
              setBlocked((prev) => prev.filter((u) => u.id !== user.id));
            } else {
              Alert.alert(
                'No pudimos desbloquear',
                error?.message ?? 'Inténtalo de nuevo.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={palette.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('privacy.title')}</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={palette.ink} />
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>{t('privacy.interactions')}</Text>

            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{t('privacy.showActivity')}</Text>
                <Text style={styles.rowDesc}>{t('privacy.showActivityDescription')}</Text>
              </View>
              <Switch
                value={settings?.show_activity ?? true}
                onValueChange={(value) => {
                  updateSetting('show_activity', value);
                }}
                trackColor={{ false: palette.border, true: palette.ink }}
                thumbColor={palette.white}
              />
            </View>

            <Text style={styles.hint}>
              Al desactivarlo, tus favoritos, reseñas y visitas dejan de mostrarse
              en tu perfil.
            </Text>

            <Text style={styles.sectionTitle}>Usuarios bloqueados</Text>

            {loadingBlocked ? (
              <View style={styles.center}>
                <ActivityIndicator color={palette.ink} />
              </View>
            ) : blocked.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="people-outline" size={32} color={palette.faint} />
                <Text style={styles.emptyText}>No has bloqueado a nadie</Text>
                <Text style={styles.emptyHint}>
                  Puedes bloquear a alguien desde el menú de opciones de cualquier
                  reseña.
                </Text>
              </View>
            ) : (
              blocked.map((user, i) => (
                <View
                  key={user.id}
                  style={[styles.row, i < blocked.length - 1 && styles.divider]}
                >
                  {user.avatarUrl ? (
                    <Image
                      source={{ uri: user.avatarUrl }}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarFallback]}>
                      <Text style={styles.initial}>
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.blockedName} numberOfLines={1}>
                    {user.name}
                  </Text>

                  <Pressable
                    onPress={() => handleUnblock(user)}
                    style={({ pressed }) => [styles.unblock, pressed && styles.pressed]}
                  >
                    <Text style={styles.unblockText}>Desbloquear</Text>
                  </Pressable>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: hairline,
    borderBottomColor: palette.border,
  },
  back: { width: 32 },
  headerTitle: { ...type.subheading },

  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  center: { paddingVertical: spacing.xxl, alignItems: 'center' },

  sectionTitle: {
    ...type.captionStrong,
    color: palette.muted,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  divider: { borderBottomWidth: hairline, borderBottomColor: palette.borderSoft },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { ...type.body },
  rowDesc: { ...type.caption },
  hint: { ...type.caption, marginTop: spacing.xs },

  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.skeleton },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ink,
  },
  initial: { ...type.smallStrong, color: palette.white },
  blockedName: { ...type.body, flex: 1 },
  unblock: {
    paddingHorizontal: spacing.lg,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: hairline,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: palette.surface },
  unblockText: { ...type.captionStrong },

  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  emptyText: { ...type.smallStrong },
  emptyHint: { ...type.caption, textAlign: 'center' },
});