// components/explore/FloatingLocationBadge.tsx
import { useUserLocation } from '@/contexts/LocationContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

interface FloatingLocationBadgeProps {
  businessCount?: number;
}

export const FloatingLocationBadge: React.FC<FloatingLocationBadgeProps> = ({ 
  businessCount = 0 
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
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animación de entrada
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  // Animación de pulso cuando está cargando
  useEffect(() => {
    if (loading || refreshing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading, refreshing]);

  const handlePress = async () => {
    if (!hasPermission) {
      await requestPermission();
    } else {
      setRefreshing(true);
      await refreshLocation();
      setRefreshing(false);
    }
  };

  const getStatusIcon = () => {
    if (loading || refreshing) {
      return <Ionicons name="location" size={16} color="#003D7A" />;
    }
    if (error || !hasPermission) {
      return <Ionicons name="location-outline" size={16} color="#FF3B30" />;
    }
    if (location) {
      return <Ionicons name="location" size={16} color="#2E7D32" />;
    }
    return <Ionicons name="location-outline" size={16} color="#999" />;
  };

  const getStatusText = () => {
    if (loading) return 'Obteniendo ubicación...';
    if (refreshing) return 'Actualizando...';
    if (error) return 'Sin ubicación';
    if (!hasPermission) return 'Activar ubicación';
    if (location && businessCount > 0) return `${businessCount} cerca de ti`;
    if (location) return 'Ubicación activa';
    return 'Ubicación desactivada';
  };

  const getBackgroundColor = () => {
    if (error || !hasPermission) return '#FFEBEE';
    if (location) return '#E8F5E9';
    return '#F5F5F5';
  };

  const getTextColor = () => {
    if (error || !hasPermission) return '#C62828';
    if (location) return '#2E7D32';
    return '#666';
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          transform: [{ translateY: slideAnim }],
          backgroundColor: getBackgroundColor(),
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          {getStatusIcon()}
        </Animated.View>
        
        <Text style={[styles.text, { color: getTextColor() }]}>
          {getStatusText()}
        </Text>

        {!loading && !refreshing && (
          <Ionicons 
            name={hasPermission ? "refresh" : "chevron-forward"} 
            size={14} 
            color={getTextColor()} 
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
});