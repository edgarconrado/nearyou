import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


interface NotificationSetting {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  category: 'push' | 'email' | 'inApp';
  value: boolean;
  onChange: (value: boolean) => void;
}

interface NotificationCategory {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function NotificationsScreen() {
  // Estados para notificaciones Push
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pushFavorites, setPushFavorites] = useState(true);
  const [pushNewBusinesses, setPushNewBusinesses] = useState(true);
  const [pushPromotions, setPushPromotions] = useState(false);
  const [pushReviews, setPushReviews] = useState(true);
  const [pushReminders, setPushReminders] = useState(true);
  const [pushUpdates, setPushUpdates] = useState(true);

  // Estados para notificaciones Email
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailWeeklyDigest, setEmailWeeklyDigest] = useState(true);
  const [emailPromotions, setEmailPromotions] = useState(false);
  const [emailTips, setEmailTips] = useState(true);
  const [emailSurveys, setEmailSurveys] = useState(false);

  // Estados para notificaciones In-App
  const [inAppSounds, setInAppSounds] = useState(true);
  const [inAppVibration, setInAppVibration] = useState(true);
  const [inAppBanner, setInAppBanner] = useState(true);

  const categories: NotificationCategory[] = [
    {
      title: 'Notificaciones Push',
      description: 'Alertas que aparecen en tu dispositivo',
      icon: 'notifications',
    },
    {
      title: 'Notificaciones por Email',
      description: 'Correos electrónicos a tu bandeja de entrada',
      icon: 'mail',
    },
    {
      title: 'Dentro de la App',
      description: 'Sonidos y vibraciones',
      icon: 'phone-portrait',
    },
  ];

  const pushNotifications: NotificationSetting[] = [
    {
      id: 'push-all',
      icon: 'notifications',
      title: 'Habilitar notificaciones push',
      description: 'Activa o desactiva todas las notificaciones push',
      category: 'push',
      value: pushEnabled,
      onChange: (value) => {
        setPushEnabled(value);
        if (!value) {
          // Si se desactivan todas, desactivar las demás también
          setPushFavorites(false);
          setPushNewBusinesses(false);
          setPushPromotions(false);
          setPushReviews(false);
          setPushReminders(false);
          setPushUpdates(false);
        }
      },
    },
    {
      id: 'push-favorites',
      icon: 'heart',
      title: 'Actualizaciones de favoritos',
      description: 'Cuando un negocio favorito tiene novedades',
      category: 'push',
      value: pushFavorites,
      onChange: setPushFavorites,
    },
    {
      id: 'push-new',
      icon: 'sparkles',
      title: 'Nuevos negocios',
      description: 'Cuando hay nuevos lugares cerca de ti',
      category: 'push',
      value: pushNewBusinesses,
      onChange: setPushNewBusinesses,
    },
    {
      id: 'push-promotions',
      icon: 'pricetag',
      title: 'Promociones y ofertas',
      description: 'Descuentos y ofertas especiales',
      category: 'push',
      value: pushPromotions,
      onChange: setPushPromotions,
    },
    {
      id: 'push-reviews',
      icon: 'chatbubble',
      title: 'Respuestas a reseñas',
      description: 'Cuando alguien responde a tu reseña',
      category: 'push',
      value: pushReviews,
      onChange: setPushReviews,
    },
    {
      id: 'push-reminders',
      icon: 'alarm',
      title: 'Recordatorios',
      description: 'Recordatorios de lugares que quieres visitar',
      category: 'push',
      value: pushReminders,
      onChange: setPushReminders,
    },
    {
      id: 'push-updates',
      icon: 'refresh',
      title: 'Actualizaciones de la app',
      description: 'Nuevas funciones y mejoras',
      category: 'push',
      value: pushUpdates,
      onChange: setPushUpdates,
    },
  ];

  const emailNotifications: NotificationSetting[] = [
    {
      id: 'email-all',
      icon: 'mail',
      title: 'Habilitar emails',
      description: 'Recibe correos de NeerYou',
      category: 'email',
      value: emailEnabled,
      onChange: (value) => {
        setEmailEnabled(value);
        if (!value) {
          setEmailWeeklyDigest(false);
          setEmailPromotions(false);
          setEmailTips(false);
          setEmailSurveys(false);
        }
      },
    },
    {
      id: 'email-digest',
      icon: 'newspaper',
      title: 'Resumen semanal',
      description: 'Un resumen de lo nuevo cada semana',
      category: 'email',
      value: emailWeeklyDigest,
      onChange: setEmailWeeklyDigest,
    },
    {
      id: 'email-promotions',
      icon: 'gift',
      title: 'Promociones por email',
      description: 'Ofertas exclusivas en tu correo',
      category: 'email',
      value: emailPromotions,
      onChange: setEmailPromotions,
    },
    {
      id: 'email-tips',
      icon: 'bulb',
      title: 'Consejos y sugerencias',
      description: 'Tips para aprovechar mejor la app',
      category: 'email',
      value: emailTips,
      onChange: setEmailTips,
    },
    {
      id: 'email-surveys',
      icon: 'clipboard',
      title: 'Encuestas',
      description: 'Ayúdanos a mejorar con tu opinión',
      category: 'email',
      value: emailSurveys,
      onChange: setEmailSurveys,
    },
  ];

  const inAppNotifications: NotificationSetting[] = [
    {
      id: 'inapp-sounds',
      icon: 'volume-high',
      title: 'Sonidos',
      description: 'Reproduce sonidos para notificaciones',
      category: 'inApp',
      value: inAppSounds,
      onChange: setInAppSounds,
    },
    {
      id: 'inapp-vibration',
      icon: 'phone-portrait',
      title: 'Vibración',
      description: 'Vibra cuando recibes notificaciones',
      category: 'inApp',
      value: inAppVibration,
      onChange: setInAppVibration,
    },
    {
      id: 'inapp-banner',
      icon: 'alert-circle',
      title: 'Banner en app',
      description: 'Muestra alertas dentro de la app',
      category: 'inApp',
      value: inAppBanner,
      onChange: setInAppBanner,
    },
  ];

  const handleTestNotification = () => {
    Alert.alert(
      '🔔 Notificación de prueba',
      '¡Así se verán tus notificaciones! Si no recibiste esta alerta, revisa los permisos en la configuración de tu dispositivo.',
      [{ text: 'Entendido' }]
    );
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Restablecer configuración',
      '¿Deseas restablecer todas las preferencias de notificaciones a los valores predeterminados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: () => {
            // Restablecer a valores predeterminados
            setPushEnabled(true);
            setPushFavorites(true);
            setPushNewBusinesses(true);
            setPushPromotions(false);
            setPushReviews(true);
            setPushReminders(true);
            setPushUpdates(true);
            setEmailEnabled(true);
            setEmailWeeklyDigest(true);
            setEmailPromotions(false);
            setEmailTips(true);
            setEmailSurveys(false);
            setInAppSounds(true);
            setInAppVibration(true);
            setInAppBanner(true);
            
            Alert.alert('Listo', 'Configuración restablecida a valores predeterminados');
          },
        },
      ]
    );
  };

  const renderNotificationSetting = (setting: NotificationSetting) => {
    const isDisabled = 
      (setting.category === 'push' && setting.id !== 'push-all' && !pushEnabled) ||
      (setting.category === 'email' && setting.id !== 'email-all' && !emailEnabled);

    return (
      <View
        key={setting.id}
        style={[
          styles.settingRow,
          isDisabled && styles.settingDisabled,
        ]}
      >
        <View style={styles.settingLeft}>
          <View style={[
            styles.settingIcon,
            isDisabled && styles.settingIconDisabled,
          ]}>
            <Ionicons
              name={setting.icon}
              size={20}
              color={isDisabled ? Colors.gray : Colors.primary}
            />
          </View>
          <View style={styles.settingText}>
            <Text style={[
              styles.settingTitle,
              isDisabled && styles.settingTitleDisabled,
            ]}>
              {setting.title}
            </Text>
            <Text style={styles.settingDescription}>{setting.description}</Text>
          </View>
        </View>
        <Switch
          value={setting.value}
          onValueChange={setting.onChange}
          disabled={isDisabled}
          trackColor={{ false: Colors.grayLight, true: Colors.primaryLight }}
          thumbColor={setting.value ? Colors.primary : Colors.gray}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <View style={styles.backButton} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="notifications" size={40} color={Colors.primary} />
            <Text style={styles.infoTitle}>Mantente informado</Text>
            <Text style={styles.infoText}>
              Personaliza cómo y cuándo quieres recibir notificaciones
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleTestNotification}
            >
              <Ionicons name="send" size={20} color={Colors.primary} />
              <Text style={styles.quickActionText}>Probar notificación</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleResetToDefaults}
            >
              <Ionicons name="refresh" size={20} color={Colors.textSecondary} />
              <Text style={styles.quickActionText}>Restablecer</Text>
            </TouchableOpacity>
          </View>

          {/* Push Notifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="notifications" size={24} color={Colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Notificaciones Push</Text>
                <Text style={styles.sectionDescription}>
                  Alertas que aparecen en tu dispositivo
                </Text>
              </View>
            </View>
            <View style={styles.card}>
              {pushNotifications.map(renderNotificationSetting)}
            </View>
          </View>

          {/* Email Notifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="mail" size={24} color={Colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Notificaciones por Email</Text>
                <Text style={styles.sectionDescription}>
                  Correos electrónicos a tu bandeja de entrada
                </Text>
              </View>
            </View>
            <View style={styles.card}>
              {emailNotifications.map(renderNotificationSetting)}
            </View>
          </View>

          {/* In-App Notifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="phone-portrait" size={24} color={Colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Dentro de la App</Text>
                <Text style={styles.sectionDescription}>
                  Sonidos y vibraciones
                </Text>
              </View>
            </View>
            <View style={styles.card}>
              {inAppNotifications.map(renderNotificationSetting)}
            </View>
          </View>

          {/* Help Card */}
          <View style={styles.helpCard}>
            <Ionicons name="information-circle" size={20} color={Colors.textSecondary} />
            <Text style={styles.helpText}>
              Si no recibes notificaciones, verifica los permisos en la configuración 
              de tu dispositivo en Ajustes → NeerYou → Notificaciones
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  content: {
    padding: 24,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...Colors.shadow,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Colors.shadow,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    ...Colors.shadow,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  settingDisabled: {
    opacity: 0.5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingIconDisabled: {
    backgroundColor: Colors.grayLight,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingTitleDisabled: {
    color: Colors.gray,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryVeryLight,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  helpText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});