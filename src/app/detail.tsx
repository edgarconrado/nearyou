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
import { NewReview, Review } from '@/types/types';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isSignedIn } = useAuth();

  // Normalizar businessId
  const businessId = useMemo(() => {
    const raw = params.businessId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.businessId]);

  const [business, setBusiness] = useState<BusinessFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'about' | 'reviews'>('about');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');
  const [newReview, setNewReview] = useState<NewReview>({
    rating: 0,
    comment: '',
    images: [],
  });

  // Favoritos
  const {
    isFavorite,
    toggling,
    toggle,
  } = useBusinessFavorite(businessId ?? null);

  // Ubicacion
  const { location: userLocation } = useUserLocation();

  // Horarios
  const {
    hours,
    isOpen,
    closingTimeFormatted,
  } = useBusinessHours(business?.id);

  // Cargar negocio
  useEffect(() => {
    if (!businessId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await BusinessesService.getBusinessFullById(businessId);

        if (error || !data) throw error;

        console.log('[DetailScreen] Business loaded:', data.name);
        setBusiness(data);
        BusinessesService.incrementVisitCount(businessId).catch(() => { });
      } catch (err) {
        console.error('[DetailScreen] Error loading business:', err);
        setError('No se pudo cargar el negocio');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [businessId]);

  const handleCall = () => {
    if (business?.phone) {
      Linking.openURL(`tel:${business.phone}`);
    }
  };

  const handleEmail = () => {
    if (business?.email) {
      Linking.openURL(`mailto:${business.email}`);
    }
  };

  const handleWebsite = () => {
    if (business?.website) {
      const url = business.website.startsWith('http')
        ? business.website
        : `https://${business.website}`;
      Linking.openURL(url);
    }
  };

  const ratingDistribution = [
    { stars: 5, count: 180, percentage: 77 },
    { stars: 4, count: 35, percentage: 15 },
    { stars: 3, count: 12, percentage: 5 },
    { stars: 2, count: 5, percentage: 2 },
    { stars: 1, count: 2, percentage: 1 },
  ];


  const handleDeleteReview = (reviewId: number) => {
    Alert.alert(
      'Eliminar opinión',
      '¿Estás seguro de que deseas eliminar esta opinión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setReviews((prev) => prev.filter((review) => review.id !== reviewId));
            Alert.alert('Opinión eliminada', 'Tu reseña ha sido eliminada');
          },
        },
      ]
    );
  };


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

  const handleDirections = () => {
    if (business?.latitude && business?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`;
      Linking.openURL(url);
    }
  };

  // Datos de ejemplo para reviews (después integrarás con la tabla de reviews)
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      userName: 'María González',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: '15 Dic 2024',
      comment:
        'Excelente comida y atención. El ambiente es muy agradable y la vista espectacular.',
      images: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      ],
      isOwn: false,
    },
  ]);

  const showReviewOptions = (review: Review) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Editar', 'Eliminar'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openReviewModal(review);
          } else if (buttonIndex === 2) {
            handleDeleteReview(review.id);
          }
        }
      );
    } else {
      Alert.alert('Opciones de opinión', 'Selecciona una opción', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Editar', onPress: () => openReviewModal(review) },
        { text: 'Eliminar', style: 'destructive', onPress: () => handleDeleteReview(review.id) },
      ]);
    }
  };

  const openReviewModal = (review?: Review) => {
    if (review) {
      setEditingReviewId(review.id);
      setNewReview({
        rating: review.rating,
        comment: review.comment,
        images: review.images || [],
      });
    } else {
      setEditingReviewId(null);
      setNewReview({
        rating: 0,
        comment: '',
        images: [],
      });
    }
    setShowReviewModal(true);
  };

  const filteredReviews =
    reviewFilter === 'all'
      ? reviews
      : reviews.filter((review) => review.rating === reviewFilter);



  // Galería - CORREGIDO: usar gallery_urls en lugar de gallery_images
  const gallery = useMemo(() => {
    const images: string[] = [];

    // Agregar imagen principal
    if (business?.main_image_url) {
      images.push(business.main_image_url);
    }

    // Agregar galería - IMPORTANTE: el campo es gallery_urls (array), no gallery_images (string)
    if (business?.gallery_urls && Array.isArray(business.gallery_urls)) {
      // Filtrar URLs vacías y duplicadas
      const validUrls = business.gallery_urls.filter(url => url && url.trim() !== '');
      images.push(...validUrls);
    }

    // Si no hay imágenes, usar placeholder
    return images.length > 0
      ? images
      : ['https://via.placeholder.com/800x600?text=Sin+Imagen'];
  }, [business]);



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

  // ✅ CORREGIDO: Datos normalizados con TODOS los campos que BusinessInfo necesita
  const businessData = {
    id: business.id,
    name: business.name ?? '',
    // ✅ Agregar category (viene de category_name en BusinessFull)
    category: business.category_name ?? 'Sin categoría',
    // ✅ Agregar priceRange
    priceRange: business.price_range ?? '$',
    rating: business.average_rating ?? 0,
    reviews: business.total_reviews ?? 0,
    isOpen,
    // ✅ Agregar description
    description: business.description ?? undefined,
    // ✅ Agregar features
    features: business.features ?? [],
    closingTime: closingTimeFormatted,
    // Campos adicionales que BusinessData extiende de Business
    address: business.address ?? '',
    postalCode: business.postal_code ?? '',
    city: business.city ?? '',
    state: business.state ?? '',
    phone: business.phone ?? '',
    email: business.email ?? '',
    website: business.website ?? '',
    latitude: business.latitude ?? 0,
    longitude: business.longitude ?? 0,
    main_image_url: business.main_image_url ?? '',
    gallery_urls: business.gallery_urls ?? [],
    coordinates: {
      latitude: business.latitude || 0,
      longitude: business.longitude || 0,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />

      <DetailHeader
        businessName={businessData.name}
        onBack={() => router.back()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageGallery images={gallery} />

        <BusinessInfo
          business={businessData}
          isFavorite={isFavorite}
          favoriteLoading={toggling}
          onToggleFavorite={handleToggleFavorite}
        />

        <QuickActions
          onCall={() => Linking.openURL(`tel:${businessData.phone}`)}
          onWebsite={() => Linking.openURL(businessData.website)}
          onDirections={() =>
            Linking.openURL(
              `https://maps.google.com/?q=${businessData.coordinates.latitude},${businessData.coordinates.longitude}`
            )
          }
          onShare={async () =>
            Share.share({ message: businessData.name })
          }
        />

        {businessData.coordinates.latitude !== 0 && (
          <LocationSection
            coordinates={businessData.coordinates}
            businessName={businessData.name}
            address={businessData.address}
            city={businessData.city}
            postalCode={businessData.postalCode}
            onDirections={handleDirections}
          />
        )}

        {hours && hours.length > 0 && <HoursSection businessHours={hours} />}

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
            onCall={handleCall}
            onEmail={handleEmail}
            onWebsite={handleWebsite}
          />
        ) : (
          <ReviewsTab
            rating={businessData.rating}
            reviews={reviews}
            filteredReviews={filteredReviews}
            reviewFilter={reviewFilter}
            ratingDistribution={ratingDistribution}
            onWriteReview={() => openReviewModal()}
            onFilterChange={setReviewFilter}
            onReviewOptions={showReviewOptions}
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