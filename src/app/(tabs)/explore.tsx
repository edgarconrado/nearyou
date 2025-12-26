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
import { Business, Offer } from '../../types/types';

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const { zoneName, zoneLocation, zoneImage } = params;

  const offers: Offer[] = [
    {
      id: 1,
      businessName: 'Restaurant El Mirador',
      title: '2x1 en platillos principales',
      discount: '50%',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      validUntil: '31 Dic',
      category: 'Restaurante',
    },
    {
      id: 2,
      businessName: 'Spa Zen Wellness',
      title: 'Masaje de 60 min + facial',
      discount: '30%',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
      validUntil: '15 Ene',
      category: 'Servicios',
    },
    {
      id: 3,
      businessName: 'Hotel Vista Hermosa',
      title: 'Noche de hotel + desayuno',
      discount: '25%',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop',
      validUntil: '28 Dic',
      category: 'Hotel',
    },
    {
      id: 4,
      businessName: 'Boutique La Moda',
      title: 'Descuento en toda la tienda',
      discount: '40%',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
      validUntil: '10 Ene',
      category: 'Tienda',
    },
    {
      id: 5,
      businessName: 'Café Aroma',
      title: 'Café + postre del día',
      discount: '20%',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
      validUntil: '05 Ene',
      category: 'Restaurante',
    },
  ];

  const businesses: Business[] = [
    {
      id: 1,
      name: 'Restaurant El Mirador',
      category: 'Restaurante',
      rating: 4.8,
      reviews: 234,
      distance: '2.3 km',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      description: 'Comida tradicional mexicana con vista panorámica',
    },
    {
      id: 2,
      name: 'Hotel Vista Hermosa',
      category: 'Hotel',
      rating: 4.6,
      reviews: 189,
      distance: '1.5 km',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      description: 'Hotel boutique con servicios de lujo',
    },
    {
      id: 3,
      name: 'Café Aroma',
      category: 'Restaurante',
      rating: 4.9,
      reviews: 412,
      distance: '0.8 km',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
      description: 'Café de especialidad y postres artesanales',
    },
    {
      id: 4,
      name: 'Boutique La Moda',
      category: 'Tienda',
      rating: 4.5,
      reviews: 156,
      distance: '3.2 km',
      isOpen: false,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      description: 'Ropa y accesorios de diseñadores locales',
    },
    {
      id: 5,
      name: 'Museo Regional',
      category: 'Atracción',
      rating: 4.7,
      reviews: 298,
      distance: '2.8 km',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
      description: 'Historia y cultura de la región',
    },
    {
      id: 6,
      name: 'Taller Artesanías',
      category: 'Taller',
      rating: 4.8,
      reviews: 143,
      distance: '1.2 km',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop',
      description: 'Clases de cerámica y artesanía tradicional',
    },
    {
      id: 7,
      name: 'Centro Comercial Plaza',
      category: 'Comercio',
      rating: 4.3,
      reviews: 567,
      distance: '4.1 km',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&h=300&fit=crop',
      description: 'Variedad de tiendas y entretenimiento',
    },
    {
      id: 8,
      name: 'Pizzería Napolitana',
      category: 'Restaurante',
      rating: 4.7,
      reviews: 321,
      distance: '1.8 km',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      description: 'Auténtica pizza italiana al horno de leña',
    },
    {
      id: 9,
      name: 'Spa Zen Wellness',
      category: 'Servicios',
      rating: 4.9,
      reviews: 187,
      distance: '2.5 km',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
      description: 'Masajes terapéuticos y tratamientos de relajación',
    },
  ];

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'Todos' || business.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedFilter('Todos');
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
        <OffersSection offers={offers} />

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
              onBusinessPress={(business) => router.push({
                pathname: '/detail',
                params: {
                  businessId: business.id,
                  businessName: business.name,
                }
              })}
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