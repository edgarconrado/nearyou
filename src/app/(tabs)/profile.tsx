import PrimaryButton from "@/components/PrimaryButton";
import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

interface User {
  name: string;
  email: string;
  phone: string;
  profileImage: string | null;
}

interface Stats {
  favorites: number;
  reviews: number;
  visits: number;
}

interface FavoriteBusiness {
  id: number;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image?: string;
}

interface SettingsItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  isLogout?: boolean;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User>({
    name: 'María González',
    email: 'maria@email.com',
    phone: '+52 33 1234 5678',
    profileImage: null,
  });

  const [stats, setStats] = useState<Stats>({
    favorites: 15,
    reviews: 8,
    visits: 34,
  });

  const favoriteBusinesses: FavoriteBusiness[] = [
    {
      id: 1,
      name: 'Restaurant El Mirador',
      category: 'Restaurante',
      rating: 4.8,
      distance: '2.3 km',
    },
    {
      id: 2,
      name: 'Café Aroma',
      category: 'Café',
      rating: 4.9,
      distance: '0.8 km',
    },
    {
      id: 3,
      name: 'Hotel Vista Hermosa',
      category: 'Hotel',
      rating: 4.6,
      distance: '1.5 km',
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleRemoveFavorite = (businessId: number) => {
    Alert.alert(
      'Eliminar de favoritos',
      '¿Deseas eliminar este negocio de tus favoritos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            console.log('Eliminar favorito:', businessId);
            // Aquí irá la lógica para eliminar
          },
        },
      ]
    );
  };

  const settingsItems: SettingsItem[] = [
    {
      id: 'edit-profile',
      icon: 'person-outline',
      label: 'Editar perfil',
      onPress: () => router.push('/edit-profile'),
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      label: 'Notificaciones',
      onPress: () => router.push('/notifications'),
    },
    {
      id: 'privacy',
      icon: 'lock-closed-outline',
      label: 'Privacidad',
      onPress: () => router.push('/privacy'),
    },
    {
      id: 'language',
      icon: 'language-outline',
      label: 'Idioma',
      value: 'Español',
      onPress: () => router.push('/language'),
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      label: 'Ayuda y Soporte',
      onPress: () => router.push('/help'),
    },
    {
      id: 'about',
      icon: 'information-circle-outline',
      label: 'Acerca de',
      onPress: () => router.push('/about'),
    },
    {
      id: 'logout',
      icon: 'log-out-outline',
      label: 'Cerrar sesión',
      onPress: handleLogout,
      isLogout: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {user.profileImage ? (
                <Image source={{ uri: user.profileImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color={Colors.primary} />
                </View>
              )}
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.favorites}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.reviews}</Text>
              <Text style={styles.statLabel}>Reseñas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.visits}</Text>
              <Text style={styles.statLabel}>Visitas</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Favorite Businesses */}
          <Text style={styles.sectionTitle}>Mis Favoritos</Text>
          {favoriteBusinesses.map((business) => (
            <View key={business.id} style={styles.favoriteCard}>
              <View style={styles.favoriteIcon}>
                <Ionicons name="heart" size={24} color={Colors.primary} />
              </View>
              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteName}>{business.name}</Text>
                <View style={styles.favoriteDetails}>
                  <Ionicons name="star" size={14} color={Colors.accent} />
                  <Text style={styles.favoriteRating}>{business.rating}</Text>
                  <Text style={styles.favoriteMeta}> • {business.category} • {business.distance}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleRemoveFavorite(business.id)}>
                <Ionicons name="heart-dislike" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ))}

          <PrimaryButton
            title="Ver todos los favoritos"
            variant="outline"
            onPress={() => console.log('Ver todos los favoritos')}
            style={styles.viewAllButton}
          />

          {/* Settings Section */}
          <Text style={styles.sectionTitle}>Configuración</Text>

          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.settingsItem,
                item.isLogout && styles.logoutItem
              ]}
              onPress={item.onPress}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={item.isLogout ? Colors.error : Colors.textPrimary}
                />
                <Text style={[
                  styles.settingsText,
                  item.isLogout && styles.logoutText
                ]}>
                  {item.label}
                </Text>
              </View>
              <View style={styles.settingsItemRight}>
                {item.value && (
                  <Text style={styles.settingsValue}>{item.value}</Text>
                )}
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={item.isLogout ? Colors.error : Colors.gray}
                />
              </View>
            </TouchableOpacity>
          ))}

          {/* App Version */}
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.darkBg,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.darkBg,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  favoriteCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    ...Colors.shadow,
  },
  favoriteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  favoriteDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteRating: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 4,
  },
  favoriteMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  viewAllButton: {
    marginBottom: 24,
  },
  settingsItem: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    ...Colors.shadow,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  settingsValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutItem: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: Colors.white,
  },
  logoutText: {
    color: Colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.gray,
    marginTop: 24,
    marginBottom: 16,
  },
});