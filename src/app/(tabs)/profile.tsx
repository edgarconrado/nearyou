import { useProfile } from '@/hooks/use-profile'; // Ajusta la ruta según tu configuración
import { useUserStats } from '@/hooks/use-user-stats'; // Ajusta la ruta según tu configuración
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, userId } = useAuth();

  // Usar hooks personalizados
  const { profile, loading: profileLoading, error, refetch } = useProfile(userId);
  const { stats, loading: statsLoading } = useUserStats(userId);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const loading = profileLoading || statsLoading;

  // Formatear fecha de miembro
  const formatMemberSince = (date: string | null) => {
    if (!date) return 'Miembro desde 2025';
    const memberDate = new Date(date);
    const year = memberDate.getFullYear();
    return `Miembro desde ${year}`;
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

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
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
    Alert.alert(
      'Idioma',
      'Selecciona tu idioma',
      [
        { text: 'Español', onPress: () => console.log('Español seleccionado') },
        { text: 'English', onPress: () => console.log('English selected') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
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
          <Text style={styles.loadingText}>Cargando perfil...</Text>
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

          <Text style={styles.userEmail}>{profile.email}</Text>

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
            <Text style={styles.editProfileText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsSection}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={handleFavorites}
          >
            <Ionicons name="heart" size={28} color="#FF3B30" />
            <Text style={styles.statNumber}>{stats.favorites}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={handleMyReviews}
          >
            <Ionicons name="star" size={28} color="#FFB800" />
            <Text style={styles.statNumber}>{stats.reviews}</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={handleMyVisits}
          >
            <Ionicons name="location" size={28} color="#003D7A" />
            <Text style={styles.statNumber}>{stats.visits}</Text>
            <Text style={styles.statLabel}>Visitas</Text>
          </TouchableOpacity>
        </View>

        {/* Mi actividad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi actividad</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleFavorites}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="heart" size={22} color="#FF3B30" />
              </View>
              <Text style={styles.menuItemText}>Lugares favoritos</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemCount}>{stats.favorites}</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleMyReviews}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF8E1' }]}>
                <Ionicons name="chatbox-ellipses" size={22} color="#FFB800" />
              </View>
              <Text style={styles.menuItemText}>Mis reseñas</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemCount}>{stats.reviews}</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleMyVisits}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="map" size={22} color="#003D7A" />
              </View>
              <Text style={styles.menuItemText}>Lugares visitados</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemCount}>{stats.visits}</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Configuración */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleEditProfile}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="person" size={22} color="#9C27B0" />
              </View>
              <Text style={styles.menuItemText}>Editar perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="notifications" size={22} color="#4CAF50" />
              </View>
              <Text style={styles.menuItemText}>Notificaciones</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D0D0D0', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handlePrivacy}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="shield-checkmark" size={22} color="#FF9800" />
              </View>
              <Text style={styles.menuItemText}>Privacidad y seguridad</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLanguage}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E1F5FE' }]}>
                <Ionicons name="language" size={22} color="#03A9F4" />
              </View>
              <Text style={styles.menuItemText}>Idioma</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.languageText}>Español</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Soporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleHelp}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FCE4EC' }]}>
                <Ionicons name="help-circle" size={22} color="#E91E63" />
              </View>
              <Text style={styles.menuItemText}>Ayuda y soporte</Text>
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
              <Text style={styles.menuItemText}>Acerca de</Text>
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
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Versión de la app */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.6</Text>
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
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
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
  },
});