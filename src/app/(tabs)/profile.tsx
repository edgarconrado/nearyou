import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/hooks/use-favorites';
import { useProfile } from '@/hooks/use-profile';
import { useUserSettings } from '@/hooks/use-user-settings';
import { useUserStats } from '@/hooks/use-user-stats';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✨ Componente separado para estadísticas
function StatsSection({
  favoritesCount,
  stats,
  onFavorites,
  onReviews,
  onVisits,
  visible
}: {
  favoritesCount: number;
  stats: any;
  onFavorites: () => void;
  onReviews: () => void;
  onVisits: () => void;
  visible: boolean;
}) {
  useEffect(() => {
    if (visible) {
    }
  }, [visible]);

  if (!visible) return null;
  const { t } = useLanguage();
  return (
    <View style={styles.statsSection}>
      <TouchableOpacity style={styles.statCard} onPress={onFavorites}>
        <Ionicons name="heart" size={28} color="#FF3B30" />
        <Text style={styles.statNumber}>{favoritesCount}</Text>
        <Text style={styles.statLabel}>{t('profile.favorites')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.statCard} onPress={onReviews}>
        <Ionicons name="star" size={28} color="#FFB800" />
        <Text style={styles.statNumber}>{stats.reviews}</Text>
        <Text style={styles.statLabel}>{t('profile.reviews')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.statCard} onPress={onVisits}>
        <Ionicons name="location" size={28} color="#003D7A" />
        <Text style={styles.statNumber}>{stats.visits}</Text>
        <Text style={styles.statLabel}>{t('profile.visits')}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✨ Componente separado para actividad
function ActivitySection({
  favoritesCount,
  stats,
  onFavorites,
  onReviews,
  onVisits,
  visible
}: {
  favoritesCount: number;
  stats: any;
  onFavorites: () => void;
  onReviews: () => void;
  onVisits: () => void;
  visible: boolean;
}) {
  useEffect(() => {
    if (visible) {
    }
  }, [visible]);
  const { t } = useLanguage();
  if (!visible) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('profile.myActivity')}</Text>

      <TouchableOpacity style={styles.menuItem} onPress={onFavorites}>
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="heart" size={22} color="#FF3B30" />
          </View>
          <Text style={styles.menuItemText}>{t('profile.favoritePlaces')}</Text>
        </View>
        <View style={styles.menuItemRight}>
          <Text style={styles.menuItemCount}>{favoritesCount}</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={onReviews}>
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF8E1' }]}>
            <Ionicons name="chatbox-ellipses" size={22} color="#FFB800" />
          </View>
          <Text style={styles.menuItemText}>{t('profile.myReviews')}</Text>
        </View>
        <View style={styles.menuItemRight}>
          <Text style={styles.menuItemCount}>{stats.reviews}</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={onVisits}>
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="location" size={22} color="#003D7A" />
          </View>
          <Text style={styles.menuItemText}>{t('profile.placesVisited')}</Text>
        </View>
        <View style={styles.menuItemRight}>
          <Text style={styles.menuItemCount}>{stats.visits}</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { signOut, userId } = useAuth();

  // Hooks personalizados
  const safeUserId = userId ?? null;
  const { profile, loading: profileLoading, error, refetch } = useProfile(safeUserId);
  const { stats, loading: statsLoading } = useUserStats(safeUserId);
  const { favorites } = useFavorites();
  const { settings, loading: settingsLoading } = useUserSettings(userId);

  const loading = profileLoading || statsLoading || settingsLoading;
  const favoritesCount = favorites.length;

  // ✨ Refs para tracking de valores previos (evitar ciclos)
  const prevShowActivityRef = useRef<boolean | null>(null);
  const prevShowEmailRef = useRef<boolean | null>(null);
  const prevShowPhoneRef = useRef<boolean | null>(null);

  // ✨ Solo log cuando REALMENTE cambia (evita ciclos)
  useEffect(() => {
    if (settings) {
      const currentShowActivity = settings.show_activity;

      if (prevShowActivityRef.current !== currentShowActivity) {
        prevShowActivityRef.current = currentShowActivity;
      }
    }
  }, [settings?.show_activity]);

  useEffect(() => {
    if (settings) {
      const currentShowEmail = settings.show_email;

      if (prevShowEmailRef.current !== currentShowEmail) {
        prevShowEmailRef.current = currentShowEmail;
      }
    }
  }, [settings?.show_email]);

  useEffect(() => {
    if (settings) {
      const currentShowPhone = settings.show_phone;

      if (prevShowPhoneRef.current !== currentShowPhone) {
        prevShowPhoneRef.current = currentShowPhone;
      }
    }
  }, [settings?.show_phone]);

  // Formatear fecha de miembro
  const formatMemberSince = (date: string | null) => {
    if (!date) return `${t('profile.memberSince')} 2025`;
    const memberDate = new Date(date);
    const year = memberDate.getFullYear();
    return `${t('profile.memberSince')} ${year}`;
  };

  // Formatear ubicación
  const formatLocation = () => {
    if (!profile) return '';

    const parts = [];
    if (profile.city) parts.push(profile.city);
    if (profile.state) parts.push(profile.state);
    if (profile.country && parts.length === 0) parts.push(profile.country);

    return parts.length > 0 ? parts.join(', ') : profile.location || '';
  };

  // Obtener nombre del idioma
  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      es: 'Español',
      en: 'English',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      pt: 'Português',
    };
    return languages[code] || 'Español';
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      t('profile.logoutConfirm'),
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            signOut();
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleFavorites = () => {
    router.push('/my-favorites');
  };

  const handleMyReviews = () => {
    router.push('/my-reviews');
  };

  const handleMyVisits = () => {
    router.push('/my-visits');
  };

  const handleNotifications = () => {
    router.push('/notifications-settings');
  };

  const handlePrivacy = () => {
    router.push('/privacy-settings');
  };

  const handleLanguage = () => {
    router.push('/language');
  };

  const handleHelp = () => {
    router.push('/help-support');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003D7A" />
          <Text style={styles.loadingText}>{t('profile.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar mensaje si no hay perfil
  if (!profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#999" />
          <Text style={styles.errorText}>
            {error ? error.message : 'No se pudo cargar el perfil'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Verificar configuraciones de privacidad (con valores por defecto seguros)
  const showEmail = settings?.show_email ?? false;
  const showPhone = settings?.show_phone ?? false;
  const showActivity = settings?.show_activity ?? true;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleEditProfile}>
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Información del usuario */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleEditProfile}
          >
            <Image
              source={{
                uri: profile.avatar_url || 'https://i.pravatar.cc/200?img=12'
              }}
              style={styles.avatar}
            />
            <View style={styles.editAvatarBadge}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.nameContainer}>
            <Text style={styles.userName}>
              {profile.full_name || 'Usuario'}
            </Text>
            {profile.is_verified && (
              <Ionicons name="checkmark-circle" size={20} color="#003D7A" />
            )}
          </View>

          {/* Email - Solo mostrar si show_email está activado */}
          {showEmail && (
            <View style={styles.contactInfoContainer}>
              <Ionicons name="mail-outline" size={14} color="#666" />
              <Text style={styles.userEmail}>{profile.email}</Text>
            </View>
          )}

          {/* Teléfono - Solo mostrar si show_phone está activado y existe */}
          {showPhone && profile.phone && (
            <View style={styles.contactInfoContainer}>
              <Ionicons name="call-outline" size={14} color="#666" />
              <Text style={styles.userPhone}>{profile.phone}</Text>
            </View>
          )}

          <View style={styles.memberInfo}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.memberText}>
              {formatMemberSince(profile.member_since)}
            </Text>
          </View>

          {formatLocation() && (
            <View style={styles.locationInfo}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.locationText}>{formatLocation()}</Text>
            </View>
          )}

          {profile.bio && (
            <Text style={styles.bioText}>{profile.bio}</Text>
          )}

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={18} color="#003D7A" />
            <Text style={styles.editProfileText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas - Componente que se muestra/oculta */}
        <StatsSection
          visible={showActivity}
          favoritesCount={favoritesCount}
          stats={stats}
          onFavorites={handleFavorites}
          onReviews={handleMyReviews}
          onVisits={handleMyVisits}
        />

        {/* Mi actividad - Componente que se muestra/oculta */}
        <ActivitySection
          visible={showActivity}
          favoritesCount={favoritesCount}
          stats={stats}
          onFavorites={handleFavorites}
          onReviews={handleMyReviews}
          onVisits={handleMyVisits}
        />

        {/* Mensaje informativo si la actividad está oculta */}
        {!showActivity && (
          <View style={styles.privacyInfoBox}>
            <Ionicons name="eye-off-outline" size={24} color="#9C27B0" />
            <View style={styles.privacyInfoTextContainer}>
              <Text style={styles.privacyInfoTitle}>
                {t('profile.activityHidden')}
              </Text>
              <Text style={styles.privacyInfoText}>
                {t('profile.activityHiddenDesc')}{' '}
                <Text
                  style={styles.privacyInfoLink}
                  onPress={handlePrivacy}
                >
                  {t('profile.privacySettings')}
                </Text>
              </Text>
            </View>
          </View>
        )}

        {/* Configuración */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.configuration')}</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNotifications}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="notifications" size={22} color="#4CAF50" />
              </View>
              <Text style={styles.menuItemText}>{t('profile.notifications')}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {settings && (
                <View style={styles.settingStatusBadge}>
                  {settings.push_enabled || settings.email_enabled ? (
                    <>
                      <View style={[styles.statusDot, { backgroundColor: '#34C759' }]} />
                      <Text style={styles.settingStatusText}>{t('profile.active')}</Text>
                    </>
                  ) : (
                    <>
                      <View style={[styles.statusDot, { backgroundColor: '#999' }]} />
                      <Text style={styles.settingStatusText}>{t('profile.disabled')}</Text>
                    </>
                  )}
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handlePrivacy}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="shield-checkmark" size={22} color="#9C27B0" />
              </View>
              <Text style={styles.menuItemText}>{t('profile.privacy')}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {settings && (
                <View style={styles.settingStatusBadge}>
                  {settings.profile_public ? (
                    <>
                      <Ionicons name="eye" size={16} color="#666" />
                      <Text style={styles.settingStatusText}>{t('profile.public')}</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="eye-off" size={16} color="#666" />
                      <Text style={styles.settingStatusText}>{t('profile.private')}</Text>
                    </>
                  )}
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLanguage}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E1F5FE' }]}>
                <Ionicons name="language" size={22} color="#03A9F4" />
              </View>
              <Text style={styles.menuItemText}>{t('profile.language')}</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.languageText}>
                {settings
                  ? getLanguageName(settings.language ?? 'es')
                  : 'es'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Soporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.support')}</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleHelp}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FCE4EC' }]}>
                <Ionicons name="help-circle" size={22} color="#E91E63" />
              </View>
              <Text style={styles.menuItemText}>{t('profile.helpSupport')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleAbout}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F1F8E9' }]}>
                <Ionicons name="information-circle" size={22} color="#8BC34A" />
              </View>
              <Text style={styles.menuItemText}>{t('profile.about')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* Cerrar sesión */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
          </TouchableOpacity>
        </View>

        {/* Versión de la app */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>{t('profile.version')} 1.0.10r1</Text>
          <Text style={styles.versionSubtext}>
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#003D7A',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#003D7A',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    padding: 4,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#003D7A',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#003D7A',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  contactInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  memberText: {
    fontSize: 13,
    color: '#666',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#003D7A',
  },
  editProfileText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#003D7A',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  privacyInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3E5F5',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E1BEE7',
  },
  privacyInfoTextContainer: {
    flex: 1,
  },
  privacyInfoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginBottom: 4,
  },
  privacyInfoText: {
    fontSize: 13,
    color: '#7B1FA2',
    lineHeight: 18,
  },
  privacyInfoLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  settingStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  settingStatusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  languageText: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 11,
    color: '#BBB',
  },
});