import { MenuRow } from '@/components/profile/MenuRow';
import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { useAuth, useUser } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/hooks/use-favorites';
import { useProfile } from '@/hooks/use-profile';
import { useUserSettings } from '@/hooks/use-user-settings';
import { useUserStats } from '@/hooks/use-user-stats';
import { AccountService, GRACE_PERIOD_DAYS, type DeletionStatus } from '@/services/account.service';
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
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
};

/** Bloque de estadísticas: tres números separados por hairlines verticales. */
function Stats({
  favorites,
  reviews,
  visits,
  onFavorites,
  onReviews,
  onVisits,
}: {
  favorites: number;
  reviews: number;
  visits: number;
  onFavorites: () => void;
  onReviews: () => void;
  onVisits: () => void;
}) {
  const { t } = useLanguage();

  const items = [
    { value: favorites, label: t('profile.favorites'), onPress: onFavorites },
    { value: reviews, label: t('profile.reviews'), onPress: onReviews },
    { value: visits, label: t('profile.visits'), onPress: onVisits },
  ];

  return (
    <View style={styles.stats}>
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && <View style={styles.statDivider} />}
          <Pressable
            onPress={item.onPress}
            style={({ pressed }) => [styles.stat, pressed && styles.statPressed]}
          >
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </Pressable>
        </React.Fragment>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { signOut, userId } = useAuth();
  const { user } = useUser();

  const safeUserId = userId ?? null;
  const { profile, loading: profileLoading, error, refetch } = useProfile(safeUserId);
  const { stats, loading: statsLoading } = useUserStats(safeUserId);
  const { favorites } = useFavorites();
  const { settings, loading: settingsLoading } = useUserSettings(userId);

  const [deleting, setDeleting] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState<DeletionStatus | null>(null);

  const refreshDeletionStatus = useCallback(async () => {
    if (!userId) return;
    setDeletionStatus(await AccountService.getDeletionStatus(userId));
  }, [userId]);

  useEffect(() => {
    refreshDeletionStatus();
  }, [refreshDeletionStatus]);

  const handleCancelDeletion = async () => {
    const { success, error: cancelError } = await AccountService.cancelDeletion();
    if (success) {
      await refreshDeletionStatus();
      refetch();
      Alert.alert('Cuenta restaurada', 'Tu cuenta ya no se eliminará.');
    } else {
      Alert.alert(
        'No pudimos restaurar la cuenta',
        cancelError?.message ?? 'Inténtalo de nuevo.'
      );
    }
  };

  const loading = profileLoading || statsLoading || settingsLoading;

  const displayName = profile?.full_name || user?.fullName || t('profile.noName');
  const avatarUrl = profile?.avatar_url || user?.imageUrl;
  const email = profile?.email || user?.email || '';

  const location = (() => {
    if (!profile) return '';
    const parts: string[] = [];
    if (profile.city) parts.push(profile.city);
    if (profile.state) parts.push(profile.state);
    if (parts.length === 0 && profile.country) parts.push(profile.country);
    return parts.length > 0 ? parts.join(', ') : profile.location || '';
  })();

  const memberSince = (() => {
    const year = profile?.created_at
      ? new Date(profile.created_at).getFullYear()
      : new Date().getFullYear();
    return `${t('profile.memberSince')} ${year}`;
  })();

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: 'Cancelar', style: 'cancel' },
      { text: t('profile.logout'), style: 'destructive', onPress: () => signOut() },
    ]);
  };

  /**
   * Eliminación de cuenta — requisito de App Store 5.1.1(v).
   * No borra al instante: marca la cuenta y deja 30 días para arrepentirse.
   */
  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      `Tu perfil, reseñas, favoritos e historial se eliminarán definitivamente en ${GRACE_PERIOD_DAYS} días. ` +
      'Si vuelves a entrar antes de esa fecha, podrás cancelar la eliminación.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: async () => {
            if (!userId) return;
            setDeleting(true);
            const { success, error: delError } = await AccountService.requestDeletion();
            setDeleting(false);

            if (!success) {
              Alert.alert(
                'No pudimos eliminar la cuenta',
                delError?.message ??
                'Inténtalo de nuevo o escríbenos desde Ayuda y soporte.'
              );
            }
          },
        },
      ]
    );
  };

  if (loading && !profile) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={palette.ink} />
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View style={[styles.screen, styles.center, { padding: spacing.xl }]}>
        <Text style={styles.errorTitle}>No pudimos cargar tu perfil</Text>
        <Text style={styles.errorBody}>{error.message}</Text>
        <Pressable
          onPress={refetch}
          style={({ pressed }) => [styles.outlineButton, pressed && styles.outlinePressed]}
        >
          <Text style={styles.outlineText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  const showActivity = settings?.show_activity ?? true;

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing.lg, paddingBottom: spacing.xxxl },
        ]}
      >
        {deletionStatus?.pending && (
          <View style={styles.deletionNotice}>
            <Ionicons name="warning-outline" size={20} color={palette.danger} />
            <View style={styles.deletionTextWrap}>
              <Text style={styles.deletionTitle}>Eliminación programada</Text>
              <Text style={styles.deletionBody}>
                Tu cuenta se eliminará en {deletionStatus.daysRemaining}{' '}
                {deletionStatus.daysRemaining === 1 ? 'día' : 'días'}.
              </Text>
              <Pressable onPress={handleCancelDeletion} hitSlop={8}>
                <Text style={styles.deletionLink}>Cancelar eliminación</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Identidad */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.initials}>{initials}</Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{displayName}</Text>
          {!!email && <Text style={styles.meta}>{email}</Text>}
          <Text style={styles.meta}>
            {[location, memberSince].filter(Boolean).join(' · ')}
          </Text>

          <Pressable
            onPress={() => router.push('/edit-profile')}
            style={({ pressed }) => [styles.outlineButton, pressed && styles.outlinePressed]}
          >
            <Text style={styles.outlineText}>{t('profile.editProfile')}</Text>
          </Pressable>
        </View>

        {showActivity ? (
          <Stats
            favorites={favorites.length}
            reviews={stats?.reviews ?? 0}
            visits={stats?.visits ?? 0}
            onFavorites={() => router.push('/my-favorites')}
            onReviews={() => router.push('/my-reviews')}
            onVisits={() => router.push('/my-visits')}
          />
        ) : (
          <View style={styles.hiddenNotice}>
            <Ionicons name="eye-off-outline" size={18} color={palette.muted} />
            <Text style={styles.hiddenText}>
              {t('profile.activityHidden')}{' '}
              <Text
                style={styles.link}
                onPress={() => router.push('/privacy-settings')}
              >
                {t('profile.privacySettings')}
              </Text>
            </Text>
          </View>
        )}

        {/* Actividad */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>{t('profile.myActivity')}</Text>
          <MenuRow
            icon="heart-outline"
            label={t('profile.favoritePlaces')}
            value={favorites.length}
            onPress={() => router.push('/my-favorites')}
          />
          <MenuRow
            icon="star-outline"
            label={t('profile.myReviews')}
            value={stats?.reviews ?? 0}
            onPress={() => router.push('/my-reviews')}
          />
          <MenuRow
            icon="location-outline"
            label={t('profile.placesVisited')}
            value={stats?.visits ?? 0}
            onPress={() => router.push('/my-visits')}
            last
          />
        </View>

        {/* Configuración */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>{t('profile.configuration')}</Text>
          <MenuRow
            icon="notifications-outline"
            label={t('profile.notifications')}
            value={settings?.push_enabled ? t('profile.active') : t('profile.disabled')}
            onPress={() => router.push('/notifications-settings')}
          />
          <MenuRow
            icon="lock-closed-outline"
            label={t('profile.privacy')}
            value={settings?.profile_public ? t('profile.public') : t('profile.private')}
            onPress={() => router.push('/privacy-settings')}
          />
          <MenuRow
            icon="language-outline"
            label={t('profile.language')}
            value={LANGUAGE_NAMES[settings?.language ?? 'es']}
            onPress={() => router.push('/language')}
            last
          />
        </View>

        {/* Soporte */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>{t('profile.support')}</Text>
          <MenuRow
            icon="help-circle-outline"
            label={t('profile.helpSupport')}
            onPress={() => router.push('/help-support')}
          />
          <MenuRow
            icon="information-circle-outline"
            label={t('profile.about')}
            onPress={() => router.push('/about')}
            last
          />
        </View>

        {/* Cuenta */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Cuenta</Text>
          <MenuRow
            icon="log-out-outline"
            label={t('profile.logout')}
            onPress={handleLogout}
          />
          <MenuRow
            icon="trash-outline"
            label={deleting ? 'Eliminando…' : 'Eliminar cuenta'}
            onPress={handleDeleteAccount}
            destructive
            last
          />
        </View>

        <Text style={styles.version}>{t('profile.version')} 1.1.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  center: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  scroll: { paddingHorizontal: spacing.lg },

  header: { alignItems: 'center', paddingBottom: spacing.xl },
  avatarWrap: { marginBottom: spacing.lg },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: palette.skeleton,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ink,
  },
  initials: { ...type.heading, color: palette.white },
  name: { ...type.title, textAlign: 'center' },
  meta: { ...type.small, textAlign: 'center', marginTop: 2 },

  outlineButton: {
    marginTop: spacing.lg,
    height: 44,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinePressed: { backgroundColor: palette.surface },
  outlineText: { ...type.smallStrong, fontSize: 15 },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: hairline,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statPressed: { opacity: 0.55 },
  statDivider: { width: hairline, height: 32, backgroundColor: palette.border },
  statValue: { ...type.heading },
  statLabel: { ...type.caption },

  hiddenNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: hairline,
    borderColor: palette.border,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  hiddenText: { ...type.small, flex: 1 },
  link: { color: palette.ink, fontWeight: '600', textDecorationLine: 'underline' },

  deletionNotice: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: palette.danger,
    borderRadius: radius.md,
  },
  deletionTextWrap: { flex: 1, gap: 2 },
  deletionTitle: { ...type.smallStrong, color: palette.danger },
  deletionBody: { ...type.small },
  deletionLink: {
    ...type.smallStrong,
    color: palette.danger,
    textDecorationLine: 'underline',
    marginTop: spacing.xs,
  },

  group: { marginBottom: spacing.xl },
  groupTitle: { ...type.captionStrong, color: palette.muted, marginBottom: spacing.xs },

  errorTitle: { ...type.subheading, textAlign: 'center' },
  errorBody: { ...type.small, textAlign: 'center' },

  version: { ...type.caption, textAlign: 'center', marginTop: spacing.md },
});