import { Header } from '@/components/home/Header';
import { ZoneGrid } from '@/components/home/ZoneGrid';
import { Logo } from '@/components/shared/logo';
import { useZones } from '@/hooks/use-zones';
import type { Zone } from '@/services/zones.service';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { zones, loading, error, refetch } = useZones();

  const handleZonePress = (zone: Zone) => {
    router.push({
      pathname: '/explore',
      params: {
        zoneId: zone.id,
        zoneName: zone.name,
        zoneLocation: zone.state,
        zoneImage: zone.image_url || '',
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />
      <Header />

      <Logo
        version='Versión 1.0.8'
        slogan='Descubre, explora y comparte experiencias'
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Explora por Zona</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#003D7A" />
            <Text style={styles.loadingText}>Cargando zonas...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.retryText} onPress={refetch}>
              Intentar nuevamente
            </Text>
          </View>
        ) : zones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay zonas disponibles</Text>
          </View>
        ) : (
          <ZoneGrid zones={zones} onZonePress={handleZonePress} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    fontSize: 16,
    color: '#003D7A',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});