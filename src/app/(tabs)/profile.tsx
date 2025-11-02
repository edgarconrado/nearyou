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

export default function ProfileScreen() {
  // Datos del usuario (después vendrán de tu BD/Context)
  const [user, setUser] = useState({
    name: 'Edgar',
    email: 'maria@email.com',
    phone: '+52 33 1234 5678',
    profileImage: null, // URL de la imagen cuando la tengas
  });

  const [stats, setStats] = useState({
    reservations: 12,
    reviews: 8,
    favorites: 15,
  });

  const recentReservations = [
    {
      id: 1,
      businessName: 'Restaurant El Mirador',
      date: '15 Nov 2025',
      time: '7:00 PM',
      people: 4,
      status: 'confirmed', // confirmed, pending, cancelled, completed
    },
    {
      id: 2,
      businessName: 'Hotel Vista Hermosa',
      date: '20 Nov 2025',
      time: 'Check-in 3:00 PM',
      people: 2,
      status: 'pending',
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
            // Aquí irá la lógica de logout
            router.replace('/login');
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'cancelled':
        return Colors.error;
      case 'completed':
        return Colors.gray;
      default:
        return Colors.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

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
              <Text style={styles.statValue}>{stats.reservations}</Text>
              <Text style={styles.statLabel}>Reservaciones</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.reviews}</Text>
              <Text style={styles.statLabel}>Reseñas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.favorites}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Recent Reservations */}
          <Text style={styles.sectionTitle}>Mis Reservaciones</Text>
          {recentReservations.map((reservation) => (
            <View key={reservation.id} style={styles.reservationCard}>
              <View style={styles.reservationIcon}>
                <Ionicons name="calendar" size={24} color={Colors.primary} />
              </View>
              <View style={styles.reservationInfo}>
                <Text style={styles.reservationName}>{reservation.businessName}</Text>
                <Text style={styles.reservationDetails}>
                  {reservation.date} • {reservation.time} • {reservation.people} personas
                </Text>
                <Text style={[
                  styles.reservationStatus,
                  { color: getStatusColor(reservation.status) }
                ]}>
                  {getStatusText(reservation.status)}
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Ver todas las reservaciones</Text>
          </TouchableOpacity>

          {/* Settings Section */}
          <Text style={styles.sectionTitle}>Configuración</Text>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="person-outline" size={24} color={Colors.textPrimary} />
              <Text style={styles.settingsText}>Editar perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="heart-outline" size={24} color={Colors.textPrimary} />
              <Text style={styles.settingsText}>Mis favoritos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
              <Text style={styles.settingsText}>Notificaciones</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="lock-closed-outline" size={24} color={Colors.textPrimary} />
              <Text style={styles.settingsText}>Privacidad</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="language-outline" size={24} color={Colors.textPrimary} />
              <Text style={styles.settingsText}>Idioma</Text>
            </View>
            <View style={styles.settingsItemRight}>
              <Text style={styles.settingsValue}>Español</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color={Colors.textPrimary} />
              <Text style={styles.settingsText}>Ayuda y Soporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="information-circle-outline" size={24} color={Colors.textPrimary} />
              <Text style={styles.settingsText}>Acerca de</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.settingsItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <View style={styles.settingsItemLeft}>
              <Ionicons name="log-out-outline" size={24} color={Colors.error} />
              <Text style={[styles.settingsText, styles.logoutText]}>Cerrar sesión</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.error} />
          </TouchableOpacity>

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
  reservationCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    ...Colors.shadow,
  },
  reservationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reservationInfo: {
    flex: 1,
  },
  reservationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  reservationDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  reservationStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewAllButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
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