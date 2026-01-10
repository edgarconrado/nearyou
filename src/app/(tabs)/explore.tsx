import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BusinessList } from '@/components/explore/BusinessList';
import { EmptyState } from '@/components/explore/EmptyState';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { FiltersSection } from '@/components/explore/FiltersSection';
import { OffersSection } from '@/components/explore/OffersSection';
import { SearchBar } from '@/components/explore/SearchBar';
import { useBusinesses } from '@/hooks/use-businesses';
import type { BusinessFull } from '@/services/businesses.service';

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const { zoneName, zoneLocation, zoneImage, zoneId } = params;

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

  // Filtrar negocios por categoría seleccionada
  const filteredBusinesses = businesses.filter(business => {
    const matchesFilter = selectedFilter === 'Todos' || business.category_name === selectedFilter;
    return matchesFilter;
  });

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedFilter('Todos');
  };

  const handleSeeAllOffers = () => {
    // Navegar a pantalla de todas las ofertas
    router.push({
      //pathname: '/offers',
      pathname: '/detail',
      params: { zoneId, zoneName }
    });
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
        <OffersSection 
          zoneId={zoneId as string}
          onSeeAll={handleSeeAllOffers}
        />

        <FiltersSection
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <Text style={styles.resultsCount}>
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'lugar' : 'lugares'}
          {searchQuery.length > 0 && ` encontrados para "${searchQuery}"`}
        </Text>

        <View style={styles.businessesContainer}>
          {filteredBusinesses.length > 0 ? (
            <BusinessList
              businesses={filteredBusinesses}
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
    padding: 16,
  },
});