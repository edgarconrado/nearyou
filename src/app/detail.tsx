import { AboutTab } from '@/components/details/AboutTab';
import { BusinessInfo } from '@/components/details/BusinessInfo';
import { DetailHeader } from '@/components/details/DetailHeader';
import { FloatingReserveButton } from '@/components/details/FloatingReserveButton';
import { HoursSection } from '@/components/details/HoursSection';
import { ImageGallery } from '@/components/details/ImageGallery';
import { LocationSection } from '@/components/details/LocationSection';
import { QuickActions } from '@/components/details/QuickActions';
import { ReviewsTab } from '@/components/details/ReviewsTab';
import { TabsNavigation } from '@/components/details/TabsNavigation';
import { useUserLocation } from '@/contexts/LocationContext';
import { useBusinessHours } from '@/hooks/use-business-hours';
import { useBusinessFavorite } from '@/hooks/use-favorites';
import { BusinessesService, type BusinessFull } from '@/services/businesses.service';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ========================================
// UTILIDADES PARA FORMATEO DE HORARIOS
// ========================================

function formatTimeTo12Hour(time24: string): string {
  if (!time24 || typeof time24 !== 'string') return '';

  try {
    const [hours, minutes] = time24.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) return time24;

    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch {
    return time24;
  }
}

function getCurrentDayOfWeek(): string {
  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ];

  const now = new Date();
  return days[now.getDay()];
}

function checkIfBusinessIsOpen(hours: any[]): boolean {
  if (!hours || hours.length === 0) return false;

  const currentDay = getCurrentDayOfWeek();
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const todayHours = hours.find(h => h.day === currentDay);

  if (!todayHours || todayHours.isClosed) return false;

  const opensAt = todayHours.opensAt;
  const closesAt = todayHours.closesAt;

  if (!opensAt || !closesAt) return false;

  try {
    const [openHour, openMin] = opensAt.split(':').map(Number);
    const [closeHour, closeMin] = closesAt.split(':').map(Number);

    if (isNaN(openHour) || isNaN(openMin) || isNaN(closeHour) || isNaN(closeMin)) {
      return false;
    }

    const openTimeInMinutes = openHour * 60 + openMin;
    const closeTimeInMinutes = closeHour * 60 + closeMin;

    return currentTimeInMinutes >= openTimeInMinutes &&
      currentTimeInMinutes <= closeTimeInMinutes;
  } catch {
    return false;
  }
}

function getClosingTimeText(hours: any[]): string | null {
  if (!hours || hours.length === 0) return null;

  const currentDay = getCurrentDayOfWeek();
  const todayHours = hours.find(h => h.day === currentDay);

  if (!todayHours || todayHours.isClosed) return null;
  if (!todayHours.closesAt) return null;

  const formattedTime = formatTimeTo12Hour(todayHours.closesAt);
  return `Cierra a las ${formattedTime}`;
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isSignedIn } = useAuth();

  const businessId = useMemo(() => {
    const raw = params.businessId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.businessId]);

  const [business, setBusiness] = useState<BusinessFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'about' | 'reviews'>('about');

  const {
    isFavorite,
    toggling,
    toggle,
  } = useBusinessFavorite(businessId ?? null);

  const { location: userLocation } = useUserLocation();

  const {
    hours: rawHours,
    isOpen: hookIsOpen,
    closingTimeFormatted: hookClosingTime,
  } = useBusinessHours(business?.id ?? undefined);

  // Cargar negocio
  useEffect(() => {
    if (!businessId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await BusinessesService.getBusinessFullById(businessId);

        if (error || !data) throw error;

        setBusiness(data);
        BusinessesService.incrementVisitCount(businessId).catch(() => { });
      } catch (err) {
        setError('No se pudo cargar el negocio');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [businessId]);

  // Toggle favorito
  const handleToggleFavorite = async () => {
    if (!isSignedIn) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para agregar favoritos',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar sesión', onPress: () => router.push('/(auth)/sign-in') },
        ]
      );
      return;
    }

    const ok = await toggle();
    if (!ok) {
      Alert.alert('Error', 'No se pudo actualizar el favorito');
    }
  };

  // Galería
  const gallery = useMemo(() => {
    const images: string[] = [];

    if (business?.main_image_url) {
      images.push(business.main_image_url);
    }

    if (business?.gallery_urls && Array.isArray(business.gallery_urls)) {
      const validUrls = business.gallery_urls.filter(url => url && url.trim() !== '');
      images.push(...validUrls);
    }

    return images.length > 0
      ? images
      : ['https://via.placeholder.com/800x600?text=Sin+Imagen'];
  }, [business]);

  // Calcular si está abierto
  const isActuallyOpen = useMemo(() => {
    if (!rawHours || rawHours.length === 0) {
      return business?.is_open ?? false;
    }
    return checkIfBusinessIsOpen(rawHours);
  }, [rawHours, business?.is_open]);

  // Obtener texto de cierre
  const closingTimeText = useMemo(() => {
    if (!rawHours || rawHours.length === 0) return null;
    return getClosingTimeText(rawHours);
  }, [rawHours]);

  // Formatear horarios
  const businessHours = useMemo(() => {
    if (!rawHours || rawHours.length === 0) return [];

    const currentDay = getCurrentDayOfWeek();

    return rawHours.map(hour => ({
      day: hour.day,
      hours: hour.isClosed
        ? 'Cerrado'
        : `${formatTimeTo12Hour(hour.opensAt || '')} - ${formatTimeTo12Hour(hour.closesAt || '')}`,
      isToday: hour.day === currentDay,
    }));
  }, [rawHours]);

  // Función para compartir
  const handleShare = async () => {
    try {
      const message = [
        business?.name || '',
        business?.description || '',
        business?.address ? `📍 ${business.address}` : '',
        business?.phone ? `📞 ${business.phone}` : '',
        business?.website || '',
      ].filter(Boolean).join('\n\n');

      const result = await Share.share({
        message: message,
        title: business?.name || 'Negocio',
      });

    } catch (err) {
      Alert.alert('Error', 'No se pudo compartir la información');
    }
  };

  // Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003D7A" />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error
  if (error || !business) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.error}>{error ?? 'Negocio no encontrado'}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Datos normalizados - INCLUIR CATEGORY
  const businessData = {
    id: business.id,
    name: business.name,
    category: business.category_name || 'Sin categoría', // ✅ AGREGADO
    rating: business.average_rating ?? 0,
    reviews: business.total_reviews ?? 0,
    address: business.address ?? '',
    city: `${business.city ?? ''}, ${business.state ?? ''}`,
    phone: business.phone ?? '',
    email: business.email ?? '',
    website: business.website ?? '',
    description: business.description ?? '',
    image: business.main_image_url ?? '',
    coordinates: {
      latitude: business.latitude ?? 0,
      longitude: business.longitude ?? 0,
    },
    gallery,
    closingTime: closingTimeText,
    isOpen: isActuallyOpen,
    priceRange: business.price_range ?? '',
    features: Array.isArray(business.features) ? business.features : [],
    postalCode: business.postal_code ?? '',
  };

  // Reviews de ejemplo
  const reviews = [
    {
      id: 1,
      userName: 'Usuario Demo',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: 'Hace 1 semana',
      comment: 'Excelente lugar, muy recomendado.',
      images: [],
      isOwn: false,
    },
  ];

  const ratingDistribution = [
    { stars: 5, count: 10, percentage: 80 },
    { stars: 4, count: 2, percentage: 15 },
    { stars: 3, count: 1, percentage: 5 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />

      <DetailHeader
        businessName={businessData.name ?? ''}
        onBack={() => router.back()}
        onShare={handleShare}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageGallery images={businessData.gallery} />

        <BusinessInfo
          business={businessData}
          isFavorite={isFavorite}
          favoriteLoading={toggling}
          onToggleFavorite={handleToggleFavorite}
        />

        <QuickActions
          hasPhone={!!businessData.phone}
          hasWebsite={!!businessData.website}
          hasCoordinates={!!(businessData.coordinates.latitude && businessData.coordinates.longitude)}
          onCall={() => {
            if (businessData.phone) {
              Linking.openURL(`tel:${businessData.phone}`);
            }
          }}
          onWebsite={() => {
            if (businessData.website) {
              Linking.openURL(businessData.website);
            }
          }}
          onDirections={() => {
            if (businessData.coordinates.latitude && businessData.coordinates.longitude) {
              Linking.openURL(
                `https://maps.google.com/?q=${businessData.coordinates.latitude},${businessData.coordinates.longitude}`
              );
            }
          }}
          onShare={handleShare}
        />

        {businessData.coordinates.latitude !== 0 && businessData.coordinates.longitude !== 0 && (
          <LocationSection
            coordinates={businessData.coordinates}
            businessName={businessData.name ?? ''}
            address={businessData.address}
            city={businessData.city}
            postalCode={businessData.postalCode}
            onDirections={() => {
              Linking.openURL(
                `https://maps.google.com/?q=${businessData.coordinates.latitude},${businessData.coordinates.longitude}`
              );
            }}
          />
        )}

        {businessHours.length > 0 && <HoursSection businessHours={businessHours} />}

        <TabsNavigation
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          reviewsCount={reviews.length}
        />

        {selectedTab === 'about' ? (
          <AboutTab
            phone={businessData.phone}
            email={businessData.email}
            website={businessData.website}
            onCall={() => {
              if (businessData.phone) {
                Linking.openURL(`tel:${businessData.phone}`);
              }
            }}
            onEmail={() => {
              if (businessData.email) {
                Linking.openURL(`mailto:${businessData.email}`);
              }
            }}
            onWebsite={() => {
              if (businessData.website) {
                Linking.openURL(businessData.website);
              }
            }}
          />
        ) : (
          <ReviewsTab
            rating={businessData.rating}
            reviews={reviews}
            filteredReviews={reviews}
            reviewFilter="all"
            ratingDistribution={ratingDistribution}
            onWriteReview={() => {
              if (!isSignedIn) {
                Alert.alert(
                  'Inicia sesión',
                  'Debes iniciar sesión para escribir una reseña',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Iniciar sesión', onPress: () => router.push('/(auth)/sign-in') },
                  ]
                );
              } else {
                Alert.alert('Escribir reseña', 'Función en desarrollo');
              }
            }}
            onFilterChange={() => { }}
            onReviewOptions={() => { }}
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FloatingReserveButton
        onPress={() => Alert.alert('Reservas', 'Función en desarrollo')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  error: {
    color: '#D32F2F',
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#003D7A',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});