import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
  isOwn?: boolean; // Para identificar si es opinión del usuario actual
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all'); // 'all' o 1-5 estrellas
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    images: [] as string[],
  });

  const { businessId, businessName } = params;

  // Datos de ejemplo del negocio
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

  const [reviews, setReviews] = useState<Review[]>([
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
      isOwn: false,
    },
    {
      id: 2,
      userName: 'Carlos Ramírez',
      userAvatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      date: '10 Dic 2024',
      comment: 'Uno de los mejores restaurantes de la zona. Precio justo por la calidad que ofrecen. Totalmente recomendado.',
      isOwn: false,
    },
    {
      id: 3,
      userName: 'Tu nombre',
      userAvatar: 'https://i.pravatar.cc/150?img=33',
      rating: 4,
      date: '5 Dic 2024',
      comment: 'Muy buena experiencia. La comida es deliciosa aunque el servicio puede ser un poco lento cuando está lleno.',
      images: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      ],
      isOwn: true, // Esta es del usuario actual
    },
    {
      id: 4,
      userName: 'Pedro López',
      userAvatar: 'https://i.pravatar.cc/150?img=8',
      rating: 5,
      date: '1 Dic 2024',
      comment: 'Simplemente perfecto. Volveré sin duda. Los mole y las enchiladas son espectaculares.',
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

  // Filtrar opiniones por calificación
  const filteredReviews = reviewFilter === 'all'
    ? reviews
    : reviews.filter(review => review.rating === reviewFilter);

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

  // Sistema de favoritos
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

  // Compartir en redes sociales
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
      Alert.alert('Error', 'No se pudo compartir el contenido');
    }
  };

  // Seleccionar imágenes para la opinión
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
      const newImages = result.assets.map(asset => asset.uri);
      setNewReview(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5), // Máximo 5 imágenes
      }));
    }
  };

  // Tomar foto con la cámara
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
      setNewReview(prev => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri].slice(0, 5),
      }));
    }
  };

  // Eliminar imagen de la opinión
  const removeImage = (index: number) => {
    setNewReview(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Mostrar opciones para agregar foto
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
      Alert.alert(
        'Agregar foto',
        'Elige una opción',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Tomar foto', onPress: takePhoto },
          { text: 'Elegir de galería', onPress: pickImages },
        ]
      );
    }
  };

  // Escribir o editar opinión
  const openReviewModal = (review?: Review) => {
    if (review) {
      // Modo edición
      setEditingReviewId(review.id);
      setNewReview({
        rating: review.rating,
        comment: review.comment,
        images: review.images || [],
      });
    } else {
      // Modo nueva opinión
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
      // Editar opinión existente
      setReviews(prev => prev.map(review =>
        review.id === editingReviewId
          ? {
            ...review,
            rating: newReview.rating,
            comment: newReview.comment,
            images: newReview.images,
            date: 'Editado hoy',
          }
          : review
      ));
      Alert.alert('Opinión actualizada', 'Tu reseña ha sido actualizada correctamente');
    } else {
      // Nueva opinión
      const review: Review = {
        id: reviews.length + 1,
        userName: 'Tu nombre',
        userAvatar: 'https://i.pravatar.cc/150?img=33',
        rating: newReview.rating,
        date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }),
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

  // Eliminar opinión
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
            setReviews(prev => prev.filter(review => review.id !== reviewId));
            Alert.alert('Opinión eliminada', 'Tu reseña ha sido eliminada');
          },
        },
      ]
    );
  };

  // Menú de opciones para opinión propia
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
      Alert.alert(
        'Opciones de opinión',
        'Selecciona una opción',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Editar', onPress: () => openReviewModal(review) },
          { text: 'Eliminar', style: 'destructive', onPress: () => handleDeleteReview(review.id) },
        ]
      );
    }
  };

  const renderRatingSelector = () => {
    return (
      <View style={styles.ratingSelector}>
        <Text style={styles.modalLabel}>Calificación *</Text>
        <View style={styles.starsSelector}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setNewReview({ ...newReview, rating: star })}
            >
              <Ionicons
                name={star <= newReview.rating ? 'star' : 'star-outline'}
                size={40}
                color="#FFB800"
              />
            </TouchableOpacity>
          ))}
        </View>
        {newReview.rating > 0 && (
          <Text style={styles.ratingLabel}>
            {newReview.rating === 1 && 'Malo'}
            {newReview.rating === 2 && 'Regular'}
            {newReview.rating === 3 && 'Bueno'}
            {newReview.rating === 4 && 'Muy bueno'}
            {newReview.rating === 5 && 'Excelente'}
          </Text>
        )}
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />

      {/* Header fijo */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{business.name}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
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
            <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color="#FF3B30"
              />
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
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-social" size={24} color="#003D7A" />
            <Text style={styles.actionText}>Compartir</Text>
          </TouchableOpacity>
        </View>

        {/* Ubicación */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color="#003D7A" />
            <Text style={styles.sectionTitle}>Ubicación</Text>
          </View>

          <View style={styles.mapContainer}>
            <MapView
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
            </MapView>
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
              Opiniones ({reviews.length})
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
            {/* Botón para escribir opinión */}
            <TouchableOpacity
              style={styles.writeReviewButton}
              onPress={() => openReviewModal()}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.writeReviewButtonText}>Escribir una opinión</Text>
            </TouchableOpacity>

            {/* Filtros de calificación */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Filtrar por:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersScroll}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    reviewFilter === 'all' && styles.filterChipActive
                  ]}
                  onPress={() => setReviewFilter('all')}
                >
                  <Text style={[
                    styles.filterChipText,
                    reviewFilter === 'all' && styles.filterChipTextActive
                  ]}>
                    Todas
                  </Text>
                </TouchableOpacity>
                {[5, 4, 3, 2, 1].map((star) => (
                  <TouchableOpacity
                    key={star}
                    style={[
                      styles.filterChip,
                      reviewFilter === star && styles.filterChipActive
                    ]}
                    onPress={() => setReviewFilter(star)}
                  >
                    <Ionicons
                      name="star"
                      size={16}
                      color={reviewFilter === star ? '#FFFFFF' : '#FFB800'}
                    />
                    <Text style={[
                      styles.filterChipText,
                      reviewFilter === star && styles.filterChipTextActive
                    ]}>
                      {star}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Resumen de calificaciones */}
            <View style={styles.ratingSummary}>
              <View style={styles.ratingOverview}>
                <Text style={styles.ratingNumber}>{business.rating}</Text>
                <View style={styles.starsColumn}>
                  <View style={styles.starsRow}>
                    {renderStars(business.rating, 18)}
                  </View>
                  <Text style={styles.totalReviews}>Basado en {reviews.length} opiniones</Text>
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

            {/* Lista de opiniones filtradas */}
            <View style={styles.reviewsList}>
              {filteredReviews.length > 0
                ? (
                  filteredReviews.map((review) => (
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
                        {review.isOwn && (
                          <TouchableOpacity
                            style={styles.moreButton}
                            onPress={() => showReviewOptions(review)}
                          >
                            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                          </TouchableOpacity>
                        )}
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
                  ))
                ) : (
                  <View style={styles.emptyReviews}>
                    <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
                    <Text style={styles.emptyReviewsText}>
                      No hay opiniones con {reviewFilter} estrellas
                    </Text>
                    <TouchableOpacity onPress={() => setReviewFilter('all')}>
                      <Text style={styles.showAllLink}>Ver todas las opiniones</Text>
                    </TouchableOpacity>
                  </View>
                )}

              {filteredReviews.length > 0 && (
                <TouchableOpacity style={styles.viewAllReviewsButton}>
                  <Text style={styles.viewAllReviewsText}>Ver todas las opiniones</Text>
                  <Ionicons name="chevron-forward" size={20} color="#003D7A" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Espaciado inferior */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón de reservar flotante */}
      <View style={styles.floatingButton}>
        <TouchableOpacity style={styles.reserveButton}>
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
          <Text style={styles.reserveButtonText}>Hacer reservación</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para escribir/editar opinión */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingReviewId ? 'Editar opinión' : 'Escribir opinión'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowReviewModal(false);
                setNewReview({ rating: 0, comment: '', images: [] });
                setEditingReviewId(null);
              }}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>{business.name}</Text>

              {renderRatingSelector()}

              <View style={styles.commentSection}>
                <Text style={styles.modalLabel}>Tu opinión *</Text>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Comparte tu experiencia sobre este lugar..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={6}
                  value={newReview.comment}
                  onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
                  textAlignVertical="top"
                  maxLength={500}
                />
                <Text style={styles.charCount}>
                  {newReview.comment.length} / 500 caracteres
                </Text>
              </View>

              {/* Sección de fotos */}
              <View style={styles.photosSection}>
                <Text style={styles.modalLabel}>Agregar fotos (opcional)</Text>
                <Text style={styles.photosHint}>Máximo 5 fotos</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.photosScroll}
                >
                  {newReview.images.map((image, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image source={{ uri: image }} style={styles.photoPreview} />
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close-circle" size={24} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {newReview.images.length < 5 && (
                    <TouchableOpacity
                      style={styles.addPhotoButton}
                      onPress={showImageOptions}
                    >
                      <Ionicons name="camera" size={32} color="#003D7A" />
                      <Text style={styles.addPhotoText}>Agregar foto</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowReviewModal(false);
                    setNewReview({ rating: 0, comment: '', images: [] });
                    setEditingReviewId(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitReview}
                >
                  <Text style={styles.submitButtonText}>
                    {editingReviewId ? 'Actualizar' : 'Publicar opinión'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
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
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#003D7A',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  writeReviewButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filtersScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
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
  moreButton: {
    padding: 4,
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
  emptyReviews: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyReviewsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 12,
  },
  showAllLink: {
    fontSize: 15,
    color: '#003D7A',
    fontWeight: '600',
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
  floatingButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#003D7A',
    paddingVertical: 14,
    borderRadius: 12,
  },
  reserveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ratingSelector: {
    marginBottom: 24,
  },
  starsSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#003D7A',
    fontWeight: '600',
  },
  commentSection: {
    marginBottom: 24,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#333',
    minHeight: 120,
    backgroundColor: '#F9F9F9',
  },
  charCount: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  photosSection: {
    marginBottom: 24,
  },
  photosHint: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  photosScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#003D7A',
    fontWeight: '600',
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#003D7A',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});