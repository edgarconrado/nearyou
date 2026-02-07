import { useUserSettings } from '@/hooks/use-user-settings';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { settings, loading, updateSetting, resetToDefaults } = useUserSettings(userId);
  
  // ✨ Estado para mostrar indicador de actualización
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);
  const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);
  
  // Animación para el indicador
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ✨ Detectar cambios en settings (tiempo real)
  useEffect(() => {
    if (settings && !loading) {
      // Mostrar indicador de actualización
      setShowUpdateIndicator(true);
      
      // Animar entrada del indicador
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          delay: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowUpdateIndicator(false);
      });

      // Pulso para llamar atención
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [settings]);

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    if (!settings) return;
    
    // Marcar qué campo se actualizó
    setLastUpdatedField(String(key));
    
    await updateSetting(key as any, value);
    
    // Limpiar después de 3 segundos
    setTimeout(() => setLastUpdatedField(null), 3000);
  };

  const handleResetDefaults = () => {
    Alert.alert(
      'Restaurar valores por defecto',
      '¿Estás seguro de que deseas restaurar la configuración de privacidad a sus valores por defecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: resetToDefaults,
        },
      ]
    );
  };

  if (loading || !settings) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacidad y seguridad</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003D7A" />
          <Text style={styles.loadingText}>Cargando configuración...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidad y seguridad</Text>
        
        {/* ✨ Indicador de actualización en tiempo real */}
        {showUpdateIndicator && (
          <Animated.View 
            style={[
              styles.realtimeIndicator,
              { opacity: fadeAnim, transform: [{ scale: pulseAnim }] }
            ]}
          >
            <View style={styles.pulsingDot} />
            <Text style={styles.realtimeText}>Sincronizado</Text>
          </Animated.View>
        )}
        
        {!showUpdateIndicator && <View style={{ width: 24 }} />}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Visibilidad del perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibilidad del perfil</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="eye" size={22} color="#003D7A" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Perfil público</Text>
                <Text style={styles.settingDescription}>
                  Otros usuarios pueden ver tu perfil
                </Text>
              </View>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={settings.profile_public ?? true}
                onValueChange={(value) => handleToggle('profile_public', value)}
                trackColor={{ false: '#D0D0D0', true: '#003D7A' }}
                thumbColor="#FFFFFF"
              />
              {/* ✨ Indicador de campo actualizado */}
              {lastUpdatedField === 'profile_public' && (
                <View style={styles.fieldUpdateBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                </View>
              )}
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail" size={22} color="#FF9800" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Mostrar email</Text>
                <Text style={styles.settingDescription}>
                  Tu correo será visible en tu perfil
                </Text>
              </View>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={settings.show_email ?? false}
                onValueChange={(value) => handleToggle('show_email', value)}
                trackColor={{ false: '#D0D0D0', true: '#FF9800' }}
                thumbColor="#FFFFFF"
                disabled={!settings.profile_public}
              />
              {lastUpdatedField === 'show_email' && (
                <View style={styles.fieldUpdateBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                </View>
              )}
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="call" size={22} color="#4CAF50" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Mostrar teléfono</Text>
                <Text style={styles.settingDescription}>
                  Tu número será visible en tu perfil
                </Text>
              </View>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={settings.show_phone ?? false}
                onValueChange={(value) => handleToggle('show_phone', value)}
                trackColor={{ false: '#D0D0D0', true: '#4CAF50' }}
                thumbColor="#FFFFFF"
                disabled={!settings.profile_public}
              />
              {lastUpdatedField === 'show_phone' && (
                <View style={styles.fieldUpdateBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Interacciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interacciones</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="chatbubbles" size={22} color="#2196F3" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Permitir mensajes</Text>
                <Text style={styles.settingDescription}>
                  Otros usuarios pueden enviarte mensajes
                </Text>
              </View>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={settings.allow_messages ?? true}
                onValueChange={(value) => handleToggle('allow_messages', value)}
                trackColor={{ false: '#D0D0D0', true: '#2196F3' }}
                thumbColor="#FFFFFF"
              />
              {lastUpdatedField === 'allow_messages' && (
                <View style={styles.fieldUpdateBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                </View>
              )}
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="flame" size={22} color="#9C27B0" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Mostrar actividad</Text>
                <Text style={styles.settingDescription}>
                  Muestra tus reseñas y lugares visitados
                </Text>
              </View>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={settings.show_activity ?? true}
                onValueChange={(value) => handleToggle('show_activity', value)}
                trackColor={{ false: '#D0D0D0', true: '#9C27B0' }}
                thumbColor="#FFFFFF"
                disabled={!settings.profile_public}
              />
              {lastUpdatedField === 'show_activity' && (
                <View style={styles.fieldUpdateBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Ubicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="location" size={22} color="#FF3B30" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Compartir ubicación</Text>
                <Text style={styles.settingDescription}>
                  Permite encontrar lugares cercanos
                </Text>
              </View>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={settings.share_location ?? true}
                onValueChange={(value) => handleToggle('share_location', value)}
                trackColor={{ false: '#D0D0D0', true: '#FF3B30' }}
                thumbColor="#FFFFFF"
              />
              {lastUpdatedField === 'share_location' && (
                <View style={styles.fieldUpdateBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ✨ Información de tiempo real */}
        <View style={styles.realtimeInfoBox}>
          <Ionicons name="sync-circle" size={24} color="#003D7A" />
          <View style={styles.realtimeInfoTextContainer}>
            <Text style={styles.realtimeInfoTitle}>
              Sincronización en tiempo real activa
            </Text>
            <Text style={styles.realtimeInfoText}>
              Los cambios se reflejan instantáneamente en todas tus pantallas y dispositivos.
            </Text>
          </View>
        </View>

        {/* Restaurar valores por defecto */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetDefaults}
          >
            <Ionicons name="refresh-outline" size={22} color="#003D7A" />
            <Text style={styles.resetButtonText}>
              Restaurar valores por defecto
            </Text>
          </TouchableOpacity>
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#003D7A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // ✨ Estilos para indicador de tiempo real
  realtimeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  realtimeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34C759',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
  // ✨ Contenedor para switch + badge
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // ✨ Badge de "guardado" al lado del switch
  fieldUpdateBadge: {
    position: 'absolute',
    right: -24,
  },
  // ✨ Caja de información de tiempo real
  realtimeInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  realtimeInfoTextContainer: {
    flex: 1,
  },
  realtimeInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003D7A',
    marginBottom: 4,
  },
  realtimeInfoText: {
    fontSize: 13,
    color: '#003D7A',
    lineHeight: 18,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#003D7A',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003D7A',
  },
});