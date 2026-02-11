import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BusinessList } from '@/components/explore/BusinessList';
import { EmptyState } from '@/components/explore/EmptyState';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { FiltersSection } from '@/components/explore/FiltersSection';
import { FloatingLocationBadge } from '@/components/explore/FloatingLocationBadge';
import LocationPermissionScreen from '@/components/explore/LocationPermissionScreen';
import { OffersSection } from '@/components/explore/OffersSection';
import { SearchBar } from '@/components/explore/SearchBar';
import { ZoneInfoButton } from '@/components/explore/ZoneInfoButton';
import { ZoneInfoModal } from '@/components/explore/ZoneInfoModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserLocation } from '@/contexts/LocationContext';
import { useBusinesses } from '@/hooks/use-businesses';
import { useZoneDetails } from '@/hooks/use-zone-details';
import type { BusinessFull } from '@/services/businesses.service';
import { sortByDistance } from '@/utils/distance.utils';

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState(t('explore.all'));
  const [searchQuery, setSearchQuery] = useState('');
  const [showZoneInfoModal, setShowZoneInfoModal] = useState(false);

  const { hasPermission } = useUserLocation();
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    checkLocationOnFirstVisit();
  }, []);

  const checkLocationOnFirstVisit = async () => {
    const hasVisitedExplore = await AsyncStorage.getItem('visited_explore');

    if (!hasVisitedExplore && !hasPermission) {
      setShowLocationPrompt(true);
      await AsyncStorage.setItem('visited_explore', 'true');
    }
  };

  const handleDismiss = () => {
    setShowLocationPrompt(false);
  };

  const { zoneName, zoneLocation, zoneImage, zoneId } = params;

  // Obtener información detallada de la zona
  const {
    zone,
    loading: loadingZone,
    hasDescription,
    hasGallery
  } = useZoneDetails(zoneId as string);

  // Mostrar el botón solo si hay información disponible
  const showZoneInfoButton = hasDescription || hasGallery;

  // Obtener ubicación del usuario
  const { location: userLocation } = useUserLocation();

  // Obtener negocios desde Supabase con filtros
  const {
    businesses,
    loading: loadingBusinesses,
    error: errorBusinesses,
    refetch: refetchBusinesses
  } = useBusinesses({
    zoneId: zoneId as string,
    searchQuery: searchQuery.trim().length > 0 ? searchQuery : undefined,
    useFull: true,
    autoRefresh: true,
  });

  // Filtrar y ordenar negocios por categoría y distancia
  const filteredAndSortedBusinesses = useMemo(() => {
    // Primero filtrar por categoría
    const filtered = businesses.filter(business => {
      const matchesFilter = selectedFilter === t('explore.all') || business.category_name === selectedFilter;
      return matchesFilter;
    });

    // Luego ordenar por distancia si tenemos la ubicación del usuario
    if (userLocation) {
      return sortByDistance(filtered, userLocation);
    }

    return filtered;
  }, [businesses, selectedFilter, userLocation, t]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedFilter(t('explore.all'));
  };

  const handleSeeAllOffers = () => {
    // Navegar a pantalla de todas las ofertas
    router.push({
      pathname: '/detail',
      params: { zoneId, zoneName }
    });
  };

  const handleOpenZoneInfo = () => {
    setShowZoneInfoModal(true);
  };

  const handleCloseZoneInfo = () => {
    setShowZoneInfoModal(false);
  };

  // Construir el texto de resultados
  const getResultsText = () => {
    const count = filteredAndSortedBusinesses.length;
    const placeWord = count === 1 ? t('explore.place') : t('explore.places');
    
    let text = `${count} ${placeWord}`;
    
    if (searchQuery.length > 0) {
      text += ` ${t('explore.foundFor')} "${searchQuery}"`;
    }
    
    if (selectedFilter !== t('explore.all')) {
      text += ` ${t('explore.in')} ${selectedFilter}`;
    }
    
    if (userLocation && filteredAndSortedBusinesses.length > 0) {
      text += ` • ${t('explore.sortedByDistance')}`;
    }
    
    return text;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />

      <ExploreHeader
        zoneName={zoneName as string}
        zoneLocation={zoneLocation as string}
        zoneImage={zoneImage as string}
        onBack={() => router.back()}
      />

      <SearchBar
        searchQuery={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onClear={() => setSearchQuery('')}
      />

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <FloatingLocationBadge businessCount={filteredAndSortedBusinesses.length} />

        <OffersSection
          zoneId={zoneId as string}
          onSeeAll={handleSeeAllOffers}
        />

        {/* Botón de información de la zona - Después de ofertas */}
        {showZoneInfoButton && (
          <ZoneInfoButton onPress={handleOpenZoneInfo} />
        )}

        {/* Sección de Filtros de Categorías */}
        <FiltersSection
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <Text style={styles.resultsCount}>
          {getResultsText()}
        </Text>

        <View style={styles.businessesContainer}>
          {filteredAndSortedBusinesses.length > 0 ? (
            <BusinessList
              businesses={filteredAndSortedBusinesses}
              loading={loadingBusinesses}
              error={errorBusinesses}
              onBusinessPress={(business: BusinessFull) => router.push({
                pathname: '/detail',
                params: {
                  businessId: business.id,
                  businessName: business.name,
                }
              })}
              onRetry={refetchBusinesses}
            />
          ) : (
            <EmptyState onClear={handleClearSearch} />
          )}
        </View>
      </ScrollView>

      {/* Modal de información de la zona */}
      <ZoneInfoModal
        visible={showZoneInfoModal}
        onClose={handleCloseZoneInfo}
        zoneName={zoneName as string}
        zoneDescription={zone?.description}
        galleryImages={zone?.gallery_urls || []}
        coverImage={zone?.cover_image_url || zone?.image_url}
        loading={loadingZone}
      />

      {/* Modal de permisos de ubicación */}
      <Modal
        visible={showLocationPrompt}
        animationType="slide"
        transparent={false}
        onRequestClose={handleDismiss}
      >
        <LocationPermissionScreen onClose={handleDismiss} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mainContent: {
    flex: 1,
    paddingTop: 60, // Espacio para el badge flotante
  },
  resultsCount: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    backgroundColor: '#F5F5F5',
  },
  businessesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});