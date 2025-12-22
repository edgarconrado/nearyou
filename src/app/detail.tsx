import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
}

interface BusinessHours {
  day: string;
  hours: string;
  isToday: boolean;
}

export default function DetailScreen() {

  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'about' | 'reviews'>('about');

  const { businessId, businessName } = params;

  // Datos de ejemplo del negocio (en producción vendrían de una API)
  const business = {
    id: businessId,
    name: businessName || 'Restaurant El Mirador',
    category: 'Restaurante',
    rating: 4.8,
    reviews: 234,
    distance: '2.3 km',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    description: 'Comida tradicional mexicana con vista panorámica. Especialidad en platillos regionales preparados con recetas ancestrales. Ambiente familiar y acogedor.',
    address: 'Av. Lázaro Cárdenas #145, Centro Histórico',
    city: 'Pátzcuaro, Michoacán',
    postalCode: '61600',
    phone: '+52 434 342 1234',
    email: 'contacto@elmirador.com',
    website: 'www.restaurantelmirador.com',
    coordinates: {
      latitude: 19.511697,
      longitude: -101.609015,
    },
    priceRange: '$$',
    features: ['WiFi', 'Estacionamiento', 'Terraza', 'Acepta tarjetas', 'Pet friendly'],
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=600&fit=crop',
    ],
  };

  const businessHours: BusinessHours[] = [
    { day: 'Lunes', hours: '9:00 AM - 10:00 PM', isToday: false },
    { day: 'Martes', hours: '9:00 AM - 10:00 PM', isToday: false },
    { day: 'Miércoles', hours: '9:00 AM - 10:00 PM', isToday: false },
    { day: 'Jueves', hours: '9:00 AM - 10:00 PM', isToday: true },
    { day: 'Viernes', hours: '9:00 AM - 11:00 PM', isToday: false },
    { day: 'Sábado', hours: '9:00 AM - 11:00 PM', isToday: false },
    { day: 'Domingo', hours: '9:00 AM - 9:00 PM', isToday: false },
  ];

  const reviews: Review[] = [
    {
      id: 1,
      userName: 'María González',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: '15 Dic 2024',
      comment: 'Excelente comida y atención. El ambiente es muy agradable y la vista espectacular. Los platillos son auténticos y deliciosos.',
      images: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      ],
    },
    {
      id: 2,
      userName: 'Carlos Ramírez',
      userAvatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      date: '10 Dic 2024',
      comment: 'Uno de los mejores restaurantes de la zona. Precio justo por la calidad que ofrecen. Totalmente recomendado.',
    },
    {
      id: 3,
      userName: 'Ana Martínez',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      rating: 4,
      date: '5 Dic 2024',
      comment: 'Muy buena experiencia. La comida es deliciosa aunque el servicio puede ser un poco lento cuando está lleno.',
    },
    {
      id: 4,
      userName: 'Pedro López',
      userAvatar: 'https://i.pravatar.cc/150?img=8',
      rating: 5,
      date: '1 Dic 2024',
      comment: 'Simplemente perfecto. Volveré sin duda. Los mole y las enchiladas son espectaculares.',
      images: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      ],
    },
  ];

  const ratingDistribution = [
    { stars: 5, count: 180, percentage: 77 },
    { stars: 4, count: 35, percentage: 15 },
    { stars: 3, count: 12, percentage: 5 },
    { stars: 2, count: 5, percentage: 2 },
    { stars: 1, count: 2, percentage: 1 },
  ];

  const renderStars = (rating: number, size: number = 16) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`star-${i}`} name="star" size={size} color="#FFB800" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half-star" name="star-half" size={size} color="#FFB800" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={size} color="#FFB800" />);
    }
    return stars;
  };

  const handleCall = () => {
    Linking.openURL(`tel:${business.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${business.email}`);
  };

  const handleWebsite = () => {
    Linking.openURL(`https://${business.website}`);
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${business.coordinates.latitude},${business.coordinates.longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Header fijo */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{business.name}</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Galería de imágenes */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.gallery}
        >
          {business.gallery.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.galleryImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Información principal */}
        <View style={styles.mainInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.businessName}>{business.name}</Text>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={28} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          <Text style={styles.category}>{business.category} • {business.priceRange}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {renderStars(business.rating, 20)}
            </View>
            <Text style={styles.ratingText}>{business.rating}</Text>
            <Text style={styles.reviewsCount}>({business.reviews} opiniones)</Text>
          </View>

          <View style={styles.statusRow}>
            <View style={[styles.statusDot, business.isOpen && styles.statusDotOpen]} />
            <Text style={[styles.statusText, business.isOpen && styles.statusTextOpen]}>
              {business.isOpen ? 'Abierto ahora' : 'Cerrado'}
            </Text>
            <Text style={styles.statusHours}> • Cierra a las 10:00 PM</Text>
          </View>

          <Text style={styles.description}>{business.description}</Text>

          {/* Características */}
          <View style={styles.featuresContainer}>
            {business.features.map((feature, index) => (
              <View key={index} style={styles.featureChip}>
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botones de acción rápida */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={24} color="#003D7A" />
            <Text style={styles.actionText}>Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
            <Ionicons name="navigate" size={24} color="#003D7A" />
            <Text style={styles.actionText}>Cómo llegar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
            <Ionicons name="globe" size={24} color="#003D7A" />
            <Text style={styles.actionText}>Sitio web</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
            <Ionicons name="mail" size={24} color="#003D7A" />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        </View>

        {/* Ubicación */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color="#003D7A" />
            <Text style={styles.sectionTitle}>Ubicación</Text>
          </View>

          <View style={styles.mapContainer}>
            {/*             <MapView
              style={styles.map}
              initialRegion={{
                latitude: business.coordinates.latitude,
                longitude: business.coordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: business.coordinates.latitude,
                  longitude: business.coordinates.longitude,
                }}
                title={business.name}
                description={business.address}
              />
            </MapView> */}
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{business.address}</Text>
            <Text style={styles.addressText}>{business.city}</Text>
            <Text style={styles.addressText}>C.P. {business.postalCode}</Text>
            <TouchableOpacity
              style={styles.directionsButton}
              onPress={handleDirections}
            >
              <Ionicons name="navigate" size={20} color="#FFFFFF" />
              <Text style={styles.directionsButtonText}>Obtener direcciones</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Horarios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={24} color="#003D7A" />
            <Text style={styles.sectionTitle}>Horarios</Text>
          </View>

          <View style={styles.hoursContainer}>
            {businessHours.map((schedule, index) => (
              <View
                key={index}
                style={[
                  styles.hourRow,
                  schedule.isToday && styles.hourRowToday
                ]}
              >
                <Text style={[
                  styles.dayText,
                  schedule.isToday && styles.dayTextToday
                ]}>
                  {schedule.day}
                </Text>
                <Text style={[
                  styles.hoursText,
                  schedule.isToday && styles.hoursTextToday
                ]}>
                  {schedule.hours}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs: Acerca de / Opiniones */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'about' && styles.tabActive]}
            onPress={() => setSelectedTab('about')}
          >
            <Text style={[styles.tabText, selectedTab === 'about' && styles.tabTextActive]}>
              Acerca de
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'reviews' && styles.tabActive]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'reviews' && styles.tabTextActive]}>
              Opiniones ({business.reviews})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido de tabs */}
        {selectedTab === 'about' ? (
          <View style={styles.section}>
            <View style={styles.contactInfo}>
              <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
                <Ionicons name="call-outline" size={22} color="#666" />
                <Text style={styles.contactText}>{business.phone}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactRow} onPress={handleEmail}>
                <Ionicons name="mail-outline" size={22} color="#666" />
                <Text style={styles.contactText}>{business.email}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactRow} onPress={handleWebsite}>
                <Ionicons name="globe-outline" size={22} color="#666" />
                <Text style={styles.contactText}>{business.website}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            {/* Resumen de calificaciones */}
            <View style={styles.ratingSummary}>
              <View style={styles.ratingOverview}>
                <Text style={styles.ratingNumber}>{business.rating}</Text>
                <View style={styles.starsColumn}>
                  <View style={styles.starsRow}>
                    {renderStars(business.rating, 18)}
                  </View>
                  <Text style={styles.totalReviews}>Basado en {business.reviews} opiniones</Text>
                </View>
              </View>

              <View style={styles.ratingBars}>
                {ratingDistribution.map((item) => (
                  <View key={item.stars} style={styles.ratingBarRow}>
                    <Text style={styles.starsLabel}>{item.stars}</Text>
                    <Ionicons name="star" size={14} color="#FFB800" />
                    <View style={styles.barContainer}>
                      <View style={[styles.barFill, { width: `${item.percentage}%` }]} />
                    </View>
                    <Text style={styles.countLabel}>{item.count}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Lista de opiniones */}
            <View style={styles.reviewsList}>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: review.userAvatar }}
                      style={styles.userAvatar}
                    />
                    <View style={styles.reviewHeaderInfo}>
                      <Text style={styles.userName}>{review.userName}</Text>
                      <View style={styles.reviewMeta}>
                        <View style={styles.starsRow}>
                          {renderStars(review.rating, 14)}
                        </View>
                        <Text style={styles.reviewDate}> • {review.date}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.reviewComment}>{review.comment}</Text>

                  {review.images && review.images.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.reviewImages}
                    >
                      {review.images.map((image, index) => (
                        <Image
                          key={index}
                          source={{ uri: image }}
                          style={styles.reviewImage}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  )}
                </View>
              ))}

              <TouchableOpacity style={styles.viewAllReviewsButton}>
                <Text style={styles.viewAllReviewsText}>Ver todas las opiniones</Text>
                <Ionicons name="chevron-forward" size={20} color="#003D7A" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Espaciado inferior */}
        <View style={{ height: 40 }} />

      </ScrollView>

      {/* Botón de reservar flotante */}
      <View style={styles.floatingButton}>
        <TouchableOpacity style={styles.reserveButton}>
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
          <Text style={styles.reserveButtonText}>Hacer reservación</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#003D7A',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  gallery: {
    height: 280,
  },
  galleryImage: {
    width: width,
    height: 280,
  },
  mainInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  businessName: {
    flex: 1,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  favoriteButton: {
    padding: 4,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  reviewsCount: {
    fontSize: 15,
    color: '#666',
    marginLeft: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C62828',
    marginRight: 8,
  },
  statusDotOpen: {
    backgroundColor: '#2E7D32',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C62828',
  },
  statusTextOpen: {
    color: '#2E7D32',
  },
  statusHours: {
    fontSize: 15,
    color: '#666',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
  },
  featureText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#003D7A',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  addressContainer: {
    gap: 6,
  },
  addressText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#003D7A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  directionsButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  hoursContainer: {
    gap: 12,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  hourRowToday: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 15,
    color: '#666',
  },
  dayTextToday: {
    fontWeight: '600',
    color: '#003D7A',
  },
  hoursText: {
    fontSize: 15,
    color: '#666',
  },
  hoursTextToday: {
    fontWeight: '600',
    color: '#003D7A',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#003D7A',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#003D7A',
  },
  contactInfo: {
    gap: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#003D7A',
  },
  ratingSummary: {
    marginBottom: 24,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  starsColumn: {
    gap: 4,
  },
  totalReviews: {
    fontSize: 13,
    color: '#666',
  },
  ratingBars: {
    gap: 8,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starsLabel: {
    fontSize: 13,
    color: '#666',
    width: 12,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#FFB800',
  },
  countLabel: {
    fontSize: 13,
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  reviewHeaderInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 13,
    color: '#999',
  },
  reviewComment: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewImages: {
    marginTop: 8,
  },
  reviewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  viewAllReviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  viewAllReviewsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#003D7A',
  },
});