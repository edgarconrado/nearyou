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
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Linking,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BusinessHours, NewReview, Review } from '../types/types';

export default function DetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'about' | 'reviews'>('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');
  const [newReview, setNewReview] = useState<NewReview>({
    rating: 0,
    comment: '',
    images: [],
  });

  const { businessId, businessName } = params;

  const business = {
    id: Array.isArray(businessId) ? businessId[0] : businessId || '1',
    name: (Array.isArray(businessName) ? businessName[0] : businessName) || 'Restaurant El Mirador',
    category: 'Restaurante',
    rating: 4.8,
    reviews: 234,
    distance: '2.3 km',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    description:
      'Comida tradicional mexicana con vista panorámica. Especialidad en platillos regionales preparados con recetas ancestrales. Ambiente familiar y acogedor.',
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

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      userName: 'María González',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: '15 Dic 2024',
      comment:
        'Excelente comida y atención. El ambiente es muy agradable y la vista espectacular. Los platillos son auténticos y deliciosos.',
      images: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      ],
      isOwn: false,
    },
    {
      id: 2,
      userName: 'Carlos Ramírez',
      userAvatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      date: '10 Dic 2024',
      comment:
        'Uno de los mejores restaurantes de la zona. Precio justo por la calidad que ofrecen. Totalmente recomendado.',
      isOwn: false,
    },
    {
      id: 3,
      userName: 'Tu nombre',
      userAvatar: 'https://i.pravatar.cc/150?img=33',
      rating: 4,
      date: '5 Dic 2024',
      comment:
        'Muy buena experiencia. La comida es deliciosa aunque el servicio puede ser un poco lento cuando está lleno.',
      images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'],
      isOwn: true,
    },
    {
      id: 4,
      userName: 'Pedro López',
      userAvatar: 'https://i.pravatar.cc/150?img=8',
      rating: 5,
      date: '1 Dic 2024',
      comment:
        'Simplemente perfecto. Volveré sin duda. Los mole y las enchiladas son espectaculares.',
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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      Alert.alert(
        'Agregado a favoritos',
        `${business.name} ha sido agregado a tus favoritos`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Eliminado de favoritos',
        `${business.name} ha sido eliminado de tus favoritos`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `¡Mira este lugar increíble! ${business.name} - ${business.description}\n\nCalificación: ${business.rating} ⭐\nUbicación: ${business.address}, ${business.city}\n\nMás información: ${business.website}`,
        title: business.name,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Compartido con:', result.activityType);
        } else {
          console.log('Compartido exitosamente');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Compartir cancelado');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el contenido  ' + error);
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para subir fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setNewReview((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5),
      }));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara para tomar fotos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewReview((prev) => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri].slice(0, 5),
      }));
    }
  };

  const removeImage = (index: number) => {
    setNewReview((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const showImageOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Tomar foto', 'Elegir de galería'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhoto();
          } else if (buttonIndex === 2) {
            pickImages();
          }
        }
      );
    } else {
      Alert.alert('Agregar foto', 'Elige una opción', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tomar foto', onPress: takePhoto },
        { text: 'Elegir de galería', onPress: pickImages },
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

  const handleSubmitReview = () => {
    if (newReview.rating === 0) {
      Alert.alert('Calificación requerida', 'Por favor selecciona una calificación');
      return;
    }

    if (newReview.comment.trim().length < 10) {
      Alert.alert('Comentario muy corto', 'Por favor escribe al menos 10 caracteres');
      return;
    }

    if (editingReviewId) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === editingReviewId
            ? {
              ...review,
              rating: newReview.rating,
              comment: newReview.comment,
              images: newReview.images,
              date: 'Editado hoy',
            }
            : review
        )
      );
      Alert.alert('Opinión actualizada', 'Tu reseña ha sido actualizada correctamente');
    } else {
      const review: Review = {
        id: reviews.length + 1,
        userName: 'Tu nombre',
        userAvatar: 'https://i.pravatar.cc/150?img=33',
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />

      <DetailHeader
        businessName={business.name}
        onBack={() => router.back()}
        onShare={handleShare}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ImageGallery images={business.gallery} />

        <BusinessInfo
          business={business}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        <QuickActions
          onCall={handleCall}
          onDirections={handleDirections}
          onWebsite={handleWebsite}
          onShare={handleShare}
        />

        <LocationSection
          coordinates={business.coordinates}
          businessName={business.name}
          address={business.address}
          city={business.city}
          postalCode={business.postalCode}
          onDirections={handleDirections}
        />

        <HoursSection businessHours={businessHours} />

        <TabsNavigation
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          reviewsCount={reviews.length}
        />

        {selectedTab === 'about' ? (
          <AboutTab
            phone={business.phone}
            email={business.email}
            website={business.website}
            onCall={handleCall}
            onEmail={handleEmail}
            onWebsite={handleWebsite}
          />
        ) : (
          <ReviewsTab
            rating={business.rating}
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
        businessName={business.name}
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
});