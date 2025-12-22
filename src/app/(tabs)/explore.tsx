import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Business {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  isOpen: boolean;
  image: string;
  description: string;
}

interface Offer {
  id: number;
  businessName: string;
  title: string;
  discount: string;
  image: string;
  validUntil: string;
  category: string;
}
export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const { zoneName, zoneLocation, zoneImage } = params;

  // Ofertas destacadas
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

  // Datos de ejemplo de negocios en la zona
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

  const filters = ['Todos', 'Restaurante', 'Hotel', 'Tienda', 'Atracción', 'Taller', 'Comercio', 'Servicios'];

  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    Todos: 'apps-outline',
    Restaurante: 'restaurant-outline',
    Hotel: 'bed-outline',
    Tienda: 'bag-handle-outline',
    Atracción: 'location-outline',
    Taller: 'hammer-outline',
    Comercio: 'storefront-outline',
    Servicios: 'sparkles-outline',
  };

  // Filtrado por búsqueda y categoría
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'Todos' || business.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`star-${i}`} name="star" size={14} color="#FFB800" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half-star" name="star-half" size={14} color="#FFB800" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#FFB800" />);
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />

      {/* Header con imagen de fondo */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: zoneImage as string }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{zoneName}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#FFFFFF" />
              <Text style={styles.headerLocation}>{zoneLocation}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar negocios, restaurantes, hoteles..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenido con scroll */}
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ofertas destacadas */}
        <View style={styles.offersSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="pricetag" size={24} color="#003D7A" />
              <Text style={styles.sectionTitle}>Ofertas destacadas</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersScrollContent}
          >
            {offers.map((offer) => (
              <TouchableOpacity
                key={offer.id}
                style={styles.offerCard}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: offer.image }}
                  style={styles.offerImage}
                  resizeMode="cover"
                />
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{offer.discount}</Text>
                  <Text style={styles.discountLabel}>OFF</Text>
                </View>
                <View style={styles.offerInfo}>
                  <Text style={styles.offerBusinessName} numberOfLines={1}>
                    {offer.businessName}
                  </Text>
                  <Text style={styles.offerTitle} numberOfLines={2}>
                    {offer.title}
                  </Text>
                  <View style={styles.offerFooter}>
                    <View style={styles.validUntilContainer}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.validUntilText}>Hasta {offer.validUntil}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filtros */}
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Ionicons
                  name={iconMap[filter]}
                  size={18}
                  color={selectedFilter === filter ? '#FFFFFF' : '#003D7A'}
                />
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextActive
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Contador de resultados */}
        <Text style={styles.resultsCount}>
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'lugar' : 'lugares'}
          {searchQuery.length > 0 && ` encontrados para "${searchQuery}"`}
        </Text>

        {/* Lista de negocios */}
        <View style={styles.businessesContainer}>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <TouchableOpacity
                key={business.id}
                style={styles.businessCard}
                activeOpacity={0.7}
                onPress={() => router.push({
                  pathname: '/detail',
                  params: {
                    businessId: business.id,
                    businessName: business.name,
                  }
                })}
              >
                <Image
                  source={{ uri: business.image }}
                  style={styles.businessImage}
                  resizeMode="cover"
                />
                <View style={styles.businessInfo}>
                  <View style={styles.businessHeader}>
                    <Text style={styles.businessName} numberOfLines={1}>
                      {business.name}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      business.isOpen ? styles.statusOpen : styles.statusClosed
                    ]}>
                      <Text style={[
                        styles.statusText,
                        !business.isOpen && styles.statusTextClosed
                      ]}>
                        {business.isOpen ? 'Abierto' : 'Cerrado'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.businessCategory}>{business.category}</Text>
                  <Text style={styles.businessDescription} numberOfLines={2}>
                    {business.description}
                  </Text>

                  <View style={styles.businessMeta}>
                    <View style={styles.ratingContainer}>
                      <View style={styles.starsRow}>
                        {renderStars(business.rating)}
                      </View>
                      <Text style={styles.ratingText}>
                        {business.rating} ({business.reviews})
                      </Text>
                    </View>
                    <View style={styles.distanceContainer}>
                      <Ionicons name="navigate-outline" size={14} color="#666" />
                      <Text style={styles.distanceText}>{business.distance}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#CCC" />
              <Text style={styles.emptyStateTitle}>No se encontraron resultados</Text>
              <Text style={styles.emptyStateMessage}>
                Intenta con otros términos de búsqueda o cambia los filtros
              </Text>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('Todos');
                }}
              >
                <Text style={styles.clearButtonText}>Limpiar búsqueda</Text>
              </TouchableOpacity>
            </View>
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
  headerContainer: {
    height: 220,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerLocation: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 0,
  },
  mainContent: {
    flex: 1,
  },
  offersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#003D7A',
    fontWeight: '600',
  },
  offersScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  offerCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginRight: 12,
  },
  offerImage: {
    width: '100%',
    height: 160,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  discountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  discountLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  offerInfo: {
    padding: 12,
  },
  offerBusinessName: {
    fontSize: 13,
    color: '#003D7A',
    fontWeight: '600',
    marginBottom: 4,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  validUntilContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validUntilText: {
    fontSize: 12,
    color: '#666',
  },
  filtersWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#003D7A',
    borderColor: '#003D7A',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#003D7A',
  },
  filterTextActive: {
    color: '#FFFFFF',
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
  businessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  businessImage: {
    width: '100%',
    height: 180,
  },
  businessInfo: {
    padding: 16,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  businessName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: '#E8F5E9',
  },
  statusClosed: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
  },
  statusTextClosed: {
    color: '#C62828',
  },
  businessCategory: {
    fontSize: 13,
    color: '#003D7A',
    fontWeight: '600',
    marginBottom: 6,
  },
  businessDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  businessMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  clearButton: {
    backgroundColor: '#003D7A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});