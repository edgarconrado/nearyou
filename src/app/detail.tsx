import { AboutTab } from '@/components/details/AboutTab';
import { BusinessInfo } from '@/components/details/BusinessInfo';
import { DetailHeader } from '@/components/details/DetailHeader';
import { FloatingReserveButton } from '@/components/details/FloatingReserveButton';
import { HoursSection } from '@/components/details/HoursSection';
import { ImageGallery } from '@/components/details/ImageGallery';
import { LocationSection } from '@/components/details/LocationSection';
import { QuickActions } from '@/components/details/QuickActions';
import { ReviewModal } from '@/components/details/ReviewModal';
import { ReviewsTab } from '@/components/details/ReviewsTab';
import { TabsNavigation } from '@/components/details/TabsNavigation';
import { useUserLocation } from '@/contexts/LocationContext';
import { useBusinessHours } from '@/hooks/use-business-hours';
import { useBusinessFavorite } from '@/hooks/use-favorites'; // Tu hook actualizado con Clerk
import type { BusinessFull } from '@/services/businesses.service';
import { BusinessesService } from '@/services/businesses.service';
import { useAuth } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BusinessHours, NewReview, Review } from '../types/types';

export default function DetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'about' | 'reviews'>('about');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');
  const [newReview, setNewReview] = useState<NewReview>({
    rating: 0,
    comment: '',
    images: [],
  });

  // Estado para el negocio desde Supabase
  const [business, setBusiness] = useState<BusinessFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { businessId, businessName } = params;
  const id = Array.isArray(businessId) ? businessId[0] : businessId;

  // Autenticación con Clerk
  const { isSignedIn, userId: clerkUserId } = useAuth();



  // Hook de favoritos (ahora usa Clerk)
  const { isFavorite, toggling, toggle, userId } = useBusinessFavorite(id || '');

  // Log del estado de autenticación
  useEffect(() => {
    console.log('[DetailScreen] Clerk auth status:', {
      isSignedIn,
      userId: clerkUserId,
    });
  }, [isSignedIn, clerkUserId]);

  // Obtener ubicación del usuario
  const { location: userLocation } = useUserLocation();

  // Obtener horarios del negocio
  const {
    hours: businessHoursFormatted,
    isOpen: isBusinessCurrentlyOpen,
    closingTimeFormatted,
    loading: loadingHours
  } = useBusinessHours(business?.id);

  // Cargar datos del negocio
  useEffect(() => {
    loadBusiness();
  }, [businessId]);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        setError('ID de negocio no válido');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await BusinessesService.getBusinessFullById(id);

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Negocio no encontrado');
        setLoading(false);
        return;
      }

      setBusiness(data);

      // Incrementar contador de visitas
      BusinessesService.incrementVisitCount(id).catch(err => {
        console.log('No se pudo incrementar contador de visitas:', err);
      });
    } catch (err) {
      console.error('Error loading business:', err);
      setError('Error al cargar el negocio');
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorito con Clerk
  const toggleFavorite = async () => {
    console.log('[DetailScreen] Toggle favorite clicked');
    console.log('[DetailScreen] Clerk auth:', { isSignedIn, userId: clerkUserId });

    // Verificar autenticación con Clerk
    if (!isSignedIn || !clerkUserId) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para agregar favoritos',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Iniciar sesión',
            onPress: () => {
              // Navega a tu pantalla de login de Clerk
              router.push('/(auth)/sign-in'); // Ajusta la ruta según tu app
            }
          }
        ]
      );
      return;
    }

    // Verificar que hay un negocio
    if (!id || !business) {
      Alert.alert('Error', 'No se pudo identificar el negocio');
      return;
    }

    // Intentar toggle
    const success = await toggle();
    
    if (!success) {
      Alert.alert(
        'Error',
        'No se pudo actualizar tus favoritos. Por favor, intenta de nuevo.',
        [{ text: 'OK' }]
      );
      return;
    }

    // El estado se actualiza automáticamente
    console.log('[DetailScreen] Toggle successful');
  };

  // Procesar horarios de apertura
  const getBusinessHours = (): BusinessHours[] => {
    if (!businessHoursFormatted || businessHoursFormatted.length === 0) {
      return [];
    }

    return businessHoursFormatted.map(hour => ({
      day: hour.day,
      hours: hour.isClosed
        ? 'Cerrado'
        : `${hour.opensAt || ''} - ${hour.closesAt || ''}`,
      isToday: hour.isToday,
    }));
  };

  // Obtener galería de imágenes
  const getGallery = (): string[] => {
    const images: string[] = [];

    if (business?.main_image_url) {
      images.push(business.main_image_url);
    }

    if (business?.gallery_images) {
      try {
        const galleryImages = JSON.parse(business.gallery_images);
        images.push(...galleryImages);
      } catch {
        // Si no se puede parsear, ignorar
      }
    }

    return images.length > 0 ? images : ['https://via.placeholder.com/800x600?text=Sin+Imagen'];
  };

  // Obtener características/amenidades
  const getFeatures = (): string[] => {
    const featuresField = (business as any)?.features ||
      (business as any)?.amenities ||
      business?.amenities;

    if (!featuresField) return [];

    try {
      if (Array.isArray(featuresField)) {
        return featuresField;
      }
      return JSON.parse(featuresField);
    } catch {
      return [];
    }
  };

  // Datos de ejemplo para reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      userName: 'María González',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: '15 Dic 2024',
      comment: 'Excelente comida y atención. El ambiente es muy agradable y la vista espectacular.',
      images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop'],
      isOwn: false,
    },
  ]);

  const ratingDistribution = [
    { stars: 5, count: 180, percentage: 77 },
    { stars: 4, count: 35, percentage: 15 },
    { stars: 3, count: 12, percentage: 5 },
    { stars: 2, count: 5, percentage: 2 },
    { stars: 1, count: 2, percentage: 1 },
  ];

  const filteredReviews =
    reviewFilter === 'all'
      ? reviews
      : reviews.filter((review) => review.rating === reviewFilter);

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

  const handleDirections = () => {
    if (business?.latitude && business?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleShare = async () => {
    if (!business) return;

    try {
      const result = await Share.share({
        message: `¡Mira este lugar increíble! ${business.name} - ${business.description || ''}\n\nCalificación: ${business.average_rating || 0} ⭐\nUbicación: ${business.address}, ${business.city}\n\n${business.website ? `Más información: ${business.website}` : ''}`,
        title: business.name,
      });

      if (result.action === Share.sharedAction) {
        console.log('Compartido exitosamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el contenido');
    }
  };

  const openReviewModal = (review?: Review) => {
    // Verificar autenticación con Clerk
    if (!isSignedIn) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para escribir una reseña',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Iniciar sesión',
            onPress: () => router.push('/(auth)/sign-in')
          }
        ]
      );
      return;
    }

    if (review) {
      setEditingReviewId(review.id);
      setNewReview({
        rating: review.rating,
        comment: review.comment,
        images: review.images || [],
      });
    }
    setShowReviewModal(true);
  };

  const showImageOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Tomar foto', 'Elegir de galería'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await takePhoto();
          } else if (buttonIndex === 2) {
            await pickImage();
          }
        }
      );
    } else {
      Alert.alert('Agregar foto', 'Selecciona una opción', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tomar foto', onPress: takePhoto },
        { text: 'Elegir de galería', onPress: pickImage },
      ]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewReview({
        ...newReview,
        images: [...newReview.images, result.assets[0].uri],
      });
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewReview({
        ...newReview,
        images: [...newReview.images, result.assets[0].uri],
      });
    }
  };

  const removeImage = (index: number) => {
    setNewReview({
      ...newReview,
      images: newReview.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmitReview = () => {
    if (newReview.rating === 0) {
      Alert.alert('Calificación requerida', 'Por favor selecciona una calificación');
      return;
    }

    if (editingReviewId) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === editingReviewId
            ? { ...review, ...newReview }
            : review
        )
      );
      Alert.alert('Opinión actualizada', 'Tu reseña ha sido actualizada correctamente');
    } else {
      const review: Review = {
        id: Date.now(),
        userName: 'Tú',
        userAvatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
        rating: newReview.rating,
        date: new Date().toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        comment: newReview.comment,
        images: newReview.images,
        isOwn: true,
      };
      setReviews([review, ...reviews]);
      Alert.alert('¡Gracias por tu opinión!', 'Tu reseña ha sido publicada correctamente');
    }

    setShowReviewModal(false);
    setNewReview({ rating: 0, comment: '', images: [] });
    setEditingReviewId(null);
  };

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

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setNewReview({ rating: 0, comment: '', images: [] });
    setEditingReviewId(null);
  };

  // Estados de carga y error
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#003D7A" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#003D7A" />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !business) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#003D7A" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Negocio no encontrado'}</Text>
          <TouchableOpacity onPress={loadBusiness} style={styles.retryButton}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Preparar datos para componentes
  const businessData = {
    id: business.id,
    name: business.name,
    category: business.category_name || 'Sin categoría',
    rating: business.average_rating || 0,
    reviews: business.total_reviews || 0,
    distance: '2.5 km',
    isOpen: isBusinessCurrentlyOpen,
    image: business.main_image_url || '',
    description: business.description || '',
    address: business.address || '',
    city: `${business.city || ''}, ${business.state || ''}`,
    postalCode: business.postal_code || '',
    phone: business.phone || '',
    email: business.email || '',
    website: business.website || '',
    coordinates: {
      latitude: business.latitude || 0,
      longitude: business.longitude || 0,
    },
    priceRange: business.price_range || '$',
    features: getFeatures(),
    gallery: getGallery(),
    closingTime: closingTimeFormatted,
  };

  const businessHours = getBusinessHours();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />

      <DetailHeader
        businessName={businessData.name}
        onBack={() => router.back()}
        onShare={handleShare}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ImageGallery images={businessData.gallery} />

        <BusinessInfo
          business={businessData}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          favoriteLoading={toggling}
        />

        <QuickActions
          onCall={handleCall}
          onDirections={handleDirections}
          onWebsite={handleWebsite}
          onShare={handleShare}
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

      <FloatingReserveButton onPress={() => Alert.alert('Reservación', 'Función en desarrollo')} />

      <ReviewModal
        visible={showReviewModal}
        businessName={businessData.name}
        review={newReview}
        isEditing={!!editingReviewId}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
        onCommentChange={(comment) => setNewReview({ ...newReview, comment })}
        onAddPhoto={showImageOptions}
        onRemovePhoto={removeImage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  centerContainer: {
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
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#003D7A',
    borderRadius: 8,
    marginBottom: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  backText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});