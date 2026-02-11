import { Header } from '@/components/home/Header';
import { ZoneGrid } from '@/components/home/ZoneGrid';
import { useLanguage } from '@/contexts/LanguageContext';
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
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
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
      
      {/* Header moderno */}
      <Header />

      {/* Sección de exploración */}
      <View style={styles.exploreBanner}>
        <Text style={styles.exploreEmoji}>🗺️</Text>
        <Text style={styles.exploreTitle}>{t('home.exploreByZone')}</Text>
        <Text style={styles.exploreSubtitle}>{t('home.discoverExperiences')}</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#003D7A" />
            <Text style={styles.loadingText}>{t('home.loadingZones')}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>😕</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryText}>🔄 {t('home.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : zones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🏝️</Text>
            <Text style={styles.emptyText}>{t('home.noZones')}</Text>
            <Text style={styles.emptySubtext}>{t('home.noZonesDescription')}</Text>
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
    backgroundColor: '#F8F9FA',
  },
  exploreBanner: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  exploreEmoji: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  exploreTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003D7A',
    textAlign: 'center',
    marginBottom: 4,
  },
  exploreSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 15,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#003D7A',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#003D7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});