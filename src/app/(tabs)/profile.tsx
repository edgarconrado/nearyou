import { MenuRow } from '@/components/profile/MenuRow';
import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { useAuth, useUser } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/hooks/use-favorites';
import { useProfile } from '@/hooks/use-profile';
import { useUserSettings } from '@/hooks/use-user-settings';
import { useUserStats } from '@/hooks/use-user-stats';
import {
  AccountService,
  GRACE_PERIOD_DAYS,
  type DeletionStatus,
} from '@/services/account.service';
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

/**
 * Perfil para quien todavía no ha iniciado sesión.
 *
 * Existe por la guía 5.1.1(v) de App Store: la app se puede explorar sin
 * cuenta, así que esta pestaña tiene que mostrar algo útil en vez de quedarse
 * cargando para siempre esperando un userId que no existe.
 */
function GuestProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + spacing.xxl, paddingBottom: spacing.xxxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.guestHeader}>
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Ionicons name="person-outline" size={40} color={palette.white} />
        </View>

        <Text style={styles.name}>Explora sin cuenta</Text>
        <Text style={styles.guestBody}>
          Puedes seguir descubriendo lugares libremente. Crea una cuenta si
          quieres guardar favoritos y escribir reseñas.
        </Text>

        <Pressable
          onPress={() => router.push('/(auth)/sign-in')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}
        >
          <Text style={styles.primaryText}>Iniciar sesión</Text>
        </Pressable>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>{t('profile.configuration')}</Text>
        <MenuRow
          icon="language-outline"
          label={t('profile.language')}
          onPress={() => router.push('/language')}
          last
        />
      </View>

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

      <Text style={styles.version}>{t('profile.version')} 1.1.0</Text>
    </ScrollView>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { signOut, userId, isSignedIn } = useAuth();
  const { user } = useUser();

  const { profile, loading: profileLoading, error, refetch } = useProfile(userId ?? null);
  const { stats, loading: statsLoading } = useUserStats(userId ?? null);
  const { favorites } = useFavorites();
  const { settings, loading: settingsLoading } = useUserSettings(userId);

  const [deleting, setDeleting] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState<DeletionStatus | null>(null);

  const refreshDeletionStatus = useCallback(async () => {
    if (!userId) {
      setDeletionStatus(null);
      return;
    }
    setDeletionStatus(await AccountService.getDeletionStatus(userId));
  }, [userId]);

  useEffect(() => {
    refreshDeletionStatus();
  }, [refreshDeletionStatus]);

  // Sin sesión: pantalla de invitado. Va DESPUÉS de los hooks para no
  // romper el orden de llamadas de React entre renders.
  if (!isSignedIn || !userId) {
    return <GuestProfile />;
  }

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

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          await signOut();
          // Al cerrar sesión, isSignedIn pasa a false y esta misma pantalla
          // se vuelve a renderizar como GuestProfile. Limpiamos lo local
          // para que no quede nada del usuario anterior en memoria.
          setDeletionStatus(null);
        },
      },
    ]);
  };

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

  const stat = (value: number, label: string, onPress: () => void) => (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.stat, pressed && styles.statPressed]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  );

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
          <View style={styles.stats}>
            {stat(favorites.length, t('profile.favorites'), () => router.push('/my-favorites'))}
            <View style={styles.statDivider} />
            {stat(stats?.reviews ?? 0, t('profile.reviews'), () => router.push('/my-reviews'))}
            <View style={styles.statDivider} />
            {stat(stats?.visits ?? 0, t('profile.visits'), () => router.push('/my-visits'))}
          </View>
        ) : (
          <View style={styles.hiddenNotice}>
            <Ionicons name="eye-off-outline" size={18} color={palette.muted} />
            <Text style={styles.hiddenText}>
              {t('profile.activityHidden')}{' '}
              <Text style={styles.link} onPress={() => router.push('/privacy-settings')}>
                {t('profile.privacySettings')}
              </Text>
            </Text>
          </View>
        )}

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

        <View style={styles.group}>
          <Text style={styles.groupTitle}>{t('profile.configuration')}</Text>
          {/* Notificaciones ocultas hasta que el envío push funcione:
              una opción que no hace nada es rechazo por la guía 2.1. */}
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

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Cuenta</Text>
          <MenuRow icon="log-out-outline" label={t('profile.logout')} onPress={handleLogout} />
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
  guestHeader: { alignItems: 'center', paddingBottom: spacing.xxl },
  guestBody: {
    ...type.body,
    color: palette.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  avatarWrap: { marginBottom: spacing.lg },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: palette.skeleton },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ink,
    marginBottom: spacing.lg,
  },
  initials: { ...type.heading, color: palette.white },
  name: { ...type.title, textAlign: 'center' },
  meta: { ...type.small, textAlign: 'center', marginTop: 2 },

  primaryButton: {
    marginTop: spacing.xl,
    height: 48,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.sm,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryPressed: { opacity: 0.85 },
  primaryText: { ...type.smallStrong, color: palette.white, fontSize: 15 },

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