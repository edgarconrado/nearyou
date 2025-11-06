import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


interface PrivacySetting {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

interface DataItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  action: () => void;
}

export default function PrivacyScreen() {
  // Estados de privacidad
  const [profilePublic, setProfilePublic] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);
  const [shareActivity, setShareActivity] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  const privacySettings: PrivacySetting[] = [
    {
      id: 'profile-public',
      icon: 'eye',
      title: 'Perfil público',
      description: 'Permite que otros usuarios vean tu perfil',
      value: profilePublic,
      onChange: setProfilePublic,
    },
    {
      id: 'show-email',
      icon: 'mail',
      title: 'Mostrar correo electrónico',
      description: 'Otros usuarios pueden ver tu email',
      value: showEmail,
      onChange: setShowEmail,
    },
    {
      id: 'show-phone',
      icon: 'call',
      title: 'Mostrar teléfono',
      description: 'Otros usuarios pueden ver tu número',
      value: showPhone,
      onChange: setShowPhone,
    },
    {
      id: 'share-location',
      icon: 'location',
      title: 'Compartir ubicación',
      description: 'Permite que la app acceda a tu ubicación',
      value: shareLocation,
      onChange: setShareLocation,
    },
    {
      id: 'share-activity',
      icon: 'time',
      title: 'Compartir actividad',
      description: 'Muestra tu historial de visitas y reseñas',
      value: shareActivity,
      onChange: setShareActivity,
    },
    {
      id: 'allow-tagging',
      icon: 'pricetag',
      title: 'Permitir etiquetas',
      description: 'Otros pueden etiquetarte en reseñas',
      value: allowTagging,
      onChange: setAllowTagging,
    },
    {
      id: 'online-status',
      icon: 'radio-button-on',
      title: 'Estado en línea',
      description: 'Muestra cuando estás activo',
      value: showOnlineStatus,
      onChange: setShowOnlineStatus,
    },
  ];

  const dataOptions: DataItem[] = [
    {
      icon: 'download',
      title: 'Descargar mis datos',
      description: 'Obtén una copia de tu información personal',
      action: () => handleDownloadData(),
    },
    {
      icon: 'eye-off',
      title: 'Ver datos recopilados',
      description: 'Revisa qué información tenemos sobre ti',
      action: () => handleViewCollectedData(),
    },
    {
      icon: 'trash',
      title: 'Eliminar mi cuenta',
      description: 'Esta acción es permanente y no se puede deshacer',
      action: () => handleDeleteAccount(),
    },
  ];

  const handleDownloadData = () => {
    Alert.alert(
      'Descargar datos',
      'Recibirás un correo electrónico con un archivo de tus datos personales en las próximas 48 horas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Solicitar',
          onPress: () => {
            console.log('Descarga de datos solicitada');
            Alert.alert('Solicitud enviada', 'Te enviaremos un email cuando tus datos estén listos.');
          },
        },
      ]
    );
  };

  const handleViewCollectedData = () => {
   // router.push('/collected-data');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '⚠️ Esta acción es PERMANENTE y eliminará:\n\n• Tu perfil y configuración\n• Todas tus reseñas\n• Tu historial de favoritos\n• Toda tu información personal\n\n¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // Segundo nivel de confirmación
            Alert.alert(
              'Última confirmación',
              'Escribe tu contraseña para confirmar la eliminación',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Confirmar eliminación',
                  style: 'destructive',
                  onPress: () => {
                    console.log('Cuenta eliminada');
                    router.replace('/login');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const handleManageBlockedUsers = () => {
   // router.push('/blocked-users');
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
          <Text style={styles.headerTitle}>Privacidad</Text>
          <View style={styles.backButton} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={40} color={Colors.primary} />
            <Text style={styles.infoTitle}>Tu privacidad es importante</Text>
            <Text style={styles.infoText}>
              Controla quién puede ver tu información y cómo usamos tus datos.
            </Text>
          </View>

          {/* Privacy Settings */}
          <Text style={styles.sectionTitle}>Configuración de Privacidad</Text>
          <View style={styles.card}>
            {privacySettings.map((setting, index) => (
              <View
                key={setting.id}
                style={[
                  styles.settingRow,
                  index !== privacySettings.length - 1 && styles.settingBorder,
                ]}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <Ionicons name={setting.icon} size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingDescription}>{setting.description}</Text>
                  </View>
                </View>
                <Switch
                  value={setting.value}
                  onValueChange={setting.onChange}
                  trackColor={{ false: Colors.grayLight, true: Colors.primaryLight }}
                  thumbColor={setting.value ? Colors.primary : Colors.gray}
                />
              </View>
            ))}
          </View>

          {/* Security */}
          <Text style={styles.sectionTitle}>Seguridad</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleChangePassword}
            >
              <View style={styles.actionLeft}>
                <Ionicons name="key" size={20} color={Colors.primary} />
                <Text style={styles.actionText}>Cambiar contraseña</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* <TouchableOpacity
              style={styles.actionRow}
              onPress={handleManageBlockedUsers}
            >
              <View style={styles.actionLeft}>
                <Ionicons name="ban" size={20} color={Colors.primary} />
                <Text style={styles.actionText}>Usuarios bloqueados</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity> */}
          </View>

          {/* Data Management */}
          <Text style={styles.sectionTitle}>Gestión de Datos</Text>
          {dataOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dataCard,
                option.title.includes('Eliminar') && styles.dangerCard,
              ]}
              onPress={option.action}
            >
              <View style={styles.dataLeft}>
                <View
                  style={[
                    styles.dataIcon,
                    option.title.includes('Eliminar') && styles.dangerIcon,
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={option.title.includes('Eliminar') ? Colors.error : Colors.primary}
                  />
                </View>
                <View style={styles.dataText}>
                  <Text
                    style={[
                      styles.dataTitle,
                      option.title.includes('Eliminar') && styles.dangerText,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={styles.dataDescription}>{option.description}</Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={option.title.includes('Eliminar') ? Colors.error : Colors.gray}
              />
            </TouchableOpacity>
          ))}

          {/* Legal Links */}
          <View style={styles.legalCard}>
            <Text style={styles.legalTitle}>Información Legal</Text>
            <TouchableOpacity
              style={styles.legalLink}
              onPress={() => Linking.openURL('https://neeryou.com/privacy')}
            >
              <Ionicons name="document-text" size={18} color={Colors.primary} />
              <Text style={styles.legalLinkText}>Política de Privacidad</Text>
              <Ionicons name="open" size={16} color={Colors.gray} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.legalLink}
              onPress={() => Linking.openURL('https://neeryou.com/terms')}
            >
              <Ionicons name="document-text" size={18} color={Colors.primary} />
              <Text style={styles.legalLinkText}>Términos de Servicio</Text>
              <Ionicons name="open" size={16} color={Colors.gray} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.legalLink}
              onPress={() => Linking.openURL('https://neeryou.com/cookies')}
            >
              <Ionicons name="document-text" size={18} color={Colors.primary} />
              <Text style={styles.legalLinkText}>Política de Cookies</Text>
              <Ionicons name="open" size={16} color={Colors.gray} />
            </TouchableOpacity>
          </View>

          {/* GDPR Notice */}
          <View style={styles.gdprNotice}>
            <Ionicons name="information-circle" size={20} color={Colors.textSecondary} />
            <Text style={styles.gdprText}>
              Cumplimos con leyes de protección de datos. 
              Tus datos están seguros con nosotros.
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    ...Colors.shadow,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
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
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
    marginVertical: 8,
  },
  dataCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    ...Colors.shadow,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  dataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  dataIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: '#FEE2E2',
  },
  dataText: {
    flex: 1,
  },
  dataTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dangerText: {
    color: Colors.error,
  },
  dataDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  legalCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Colors.shadow,
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  legalLinkText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  gdprNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayLight,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  gdprText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});