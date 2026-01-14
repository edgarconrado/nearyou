// components/common/LocationIndicator.tsx
import { useUserLocation } from '@/contexts/LocationContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface LocationIndicatorProps {
  variant?: 'compact' | 'full';
  showRefreshButton?: boolean;
}

export const LocationIndicator: React.FC<LocationIndicatorProps> = ({ 
  variant = 'compact',
  showRefreshButton = true,
}) => {
  const { 
    location, 
    loading, 
    error, 
    hasPermission,
    refreshLocation,
    requestPermission,
  } = useUserLocation();

  const [refreshing, setRefreshing] = React.useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (loading) {
      // Animación de pulso mientras carga
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshLocation();
    setRefreshing(false);
  };

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  // Versión compacta (para header)
  if (variant === 'compact') {
    return (
      <View style={styles.compactContainer}>
        {loading ? (
          <View style={styles.compactContent}>
            <ActivityIndicator size="small" color="#003D7A" />
            <Text style={styles.compactText}>Obteniendo ubicación...</Text>
          </View>
        ) : error || !hasPermission ? (
          <TouchableOpacity 
            style={styles.compactContent}
            onPress={handleRequestPermission}
          >
            <Ionicons name="location-outline" size={16} color="#FF3B30" />
            <Text style={styles.compactTextError}>Sin ubicación</Text>
          </TouchableOpacity>
        ) : location ? (
          <View style={styles.compactContent}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="location" size={16} color="#2E7D32" />
            </Animated.View>
            <Text style={styles.compactTextSuccess}>Ubicación activa</Text>
            {showRefreshButton && (
              <TouchableOpacity 
                onPress={handleRefresh}
                style={styles.refreshButton}
                disabled={refreshing}
              >
                <Ionicons 
                  name="refresh" 
                  size={14} 
                  color="#666" 
                  style={refreshing ? styles.rotating : undefined}
                />
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </View>
    );
  }

  // Versión completa (para pantallas)
  return (
    <View style={styles.fullContainer}>
      {loading ? (
        <View style={styles.fullContent}>
          <ActivityIndicator size="large" color="#003D7A" />
          <Text style={styles.fullTitle}>Obteniendo tu ubicación</Text>
          <Text style={styles.fullSubtitle}>
            Esto nos permite mostrarte negocios cercanos
          </Text>
        </View>
      ) : error || !hasPermission ? (
        <View style={styles.fullContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="location-outline" size={48} color="#FF3B30" />
          </View>
          <Text style={styles.fullTitle}>Ubicación no disponible</Text>
          <Text style={styles.fullSubtitle}>
            {error || 'Necesitamos permisos para mostrarte negocios cercanos'}
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={handleRequestPermission}
          >
            <Ionicons name="location" size={20} color="#FFFFFF" />
            <Text style={styles.permissionButtonText}>Activar ubicación</Text>
          </TouchableOpacity>
        </View>
      ) : location ? (
        <View style={styles.fullContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={48} color="#2E7D32" />
          </View>
          <Text style={styles.fullTitle}>Ubicación activa</Text>
          <Text style={styles.fullSubtitle}>
            Te mostraremos negocios cercanos y distancias precisas
          </Text>
          {showRefreshButton && (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <Ionicons 
                name="refresh" 
                size={20} 
                color="#003D7A" 
              />
              <Text style={styles.secondaryButtonText}>
                {refreshing ? 'Actualizando...' : 'Actualizar ubicación'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos compactos
  compactContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  compactTextError: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
  },
  compactTextSuccess: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  refreshButton: {
    marginLeft: 4,
    padding: 4,
  },
  rotating: {
    transform: [{ rotate: '360deg' }],
  },

  // Estilos completos
  fullContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  fullContent: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  fullTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  fullSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#003D7A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryButtonText: {
    color: '#003D7A',
    fontSize: 14,
    fontWeight: '600',
  },
});