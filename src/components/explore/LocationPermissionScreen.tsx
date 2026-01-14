// screens/LocationPermissionScreen.tsx
import { useUserLocation } from '@/contexts/LocationContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface LocationPermissionScreenProps {
  onClose?: () => void;
}

export default function LocationPermissionScreen({ onClose }: LocationPermissionScreenProps) {
  const router = useRouter();
  const { requestPermission, hasPermission } = useUserLocation();

  const handleEnableLocation = async () => {
    await requestPermission();
    if (hasPermission) {
      if (onClose) {
        onClose();
      } else {
        router.back();
      }
    }
  };

  const handleSkip = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={80} color="#003D7A" />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Encuentra negocios cerca de ti</Text>
          
          <Text style={styles.description}>
            Activa tu ubicación para que podamos mostrarte:
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="navigate" size={24} color="#2E7D32" />
              <Text style={styles.featureText}>
                Negocios más cercanos ordenados por distancia
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="compass" size={24} color="#2E7D32" />
              <Text style={styles.featureText}>
                Distancias exactas a cada lugar
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="map" size={24} color="#2E7D32" />
              <Text style={styles.featureText}>
                Direcciones precisas para llegar
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="star" size={24} color="#2E7D32" />
              <Text style={styles.featureText}>
                Recomendaciones personalizadas
              </Text>
            </View>
          </View>

          <View style={styles.privacyNote}>
            <Ionicons name="shield-checkmark" size={20} color="#666" />
            <Text style={styles.privacyText}>
              Tu ubicación solo se usa para mejorar tu experiencia. 
              Nunca compartimos tus datos.
            </Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.enableButton}
            onPress={handleEnableLocation}
          >
            <Ionicons name="location" size={20} color="#FFFFFF" />
            <Text style={styles.enableButtonText}>Activar ubicación</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Continuar sin ubicación</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresList: {
    gap: 20,
    paddingVertical: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  buttonsContainer: {
    gap: 12,
    paddingTop: 24,
  },
  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#003D7A',
    paddingVertical: 16,
    borderRadius: 12,
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});