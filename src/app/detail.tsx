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
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserLocation } from '@/contexts/LocationContext';
import { useBusinessHours } from '@/hooks/use-business-hours';
import { useBusinessFavorite } from '@/hooks/use-favorites';
import { BusinessesService, type BusinessFull } from '@/services/businesses.service';
import { ReviewsService } from '@/services/reviews.service';
import { useAuth, useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import type { NewReview, RatingDistribution, Review } from '../../types/types';

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

function getCurrentDayOfWeek(t: (key: string) => string): string {
  const days = [
    t('detail.sunday'),
    t('detail.monday'),
    t('detail.tuesday'),
    t('detail.wednesday'),
    t('detail.thursday'),
    t('detail.friday'),
    t('detail.saturday')
  ];

  const now = new Date();
  return days[now.getDay()];
}

function checkIfBusinessIsOpen(hours: any[], t: (key: string) => string): boolean {
  if (!hours || hours.length === 0) return false;

  const currentDay = getCurrentDayOfWeek(t);
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

function getClosingTimeText(hours: any[], t: (key: string) => string): string | null {
  if (!hours || hours.length === 0) return null;

  const currentDay = getCurrentDayOfWeek(t);
  const todayHours = hours.find(h => h.day === currentDay);

  if (!todayHours || todayHours.isClosed) return null;
  if (!todayHours.closesAt) return null;

  const formattedTime = formatTimeTo12Hour(todayHours.closesAt);
  return `${t('detail.closesAt')} ${formattedTime}`;
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { t } = useLanguage();

  const businessId = useMemo(() => {
    const raw = params.businessId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.businessId]);

  const [business, setBusiness] = useState<BusinessFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'about' | 'reviews'>('about');

  // Estados para Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false); // 🆕 Estado para el spinner
  const [newReview, setNewReview] = useState<NewReview>({
    rating: 0,
    comment: '',
    images: [],
  });

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
        setError(t('detail.businessNotFound'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [businessId]);

  // Cargar reseñas
  useEffect(() => {
    if (!businessId) return;

    const loadReviews = async () => {
      try {
        setReviewsLoading(true);

        const { data, error } = await ReviewsService.getReviewsByBusinessWithUser(businessId);

        if (error) throw error;

        // Transformar los datos al formato esperado por los componentes
        const formattedReviews: Review[] = (data || []).map((review) => {
          const reviewDate = review.created_at ? new Date(review.created_at) : new Date();
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let dateText = '';
          if (diffDays === 0) {
            dateText = t('detail.today');
          } else if (diffDays === 1) {
            dateText = t('detail.yesterday');
          } else if (diffDays < 7) {
            dateText = `${t('detail.daysAgo').replace('{days}', diffDays.toString())}`;
          } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            dateText = weeks === 1 
              ? t('detail.weekAgo') 
              : `${t('detail.weeksAgo').replace('{weeks}', weeks.toString())}`;
          } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            dateText = months === 1 
              ? t('detail.monthAgo') 
              : `${t('detail.monthsAgo').replace('{months}', months.toString())}`;
          } else {
            const years = Math.floor(diffDays / 365);
            dateText = years === 1 
              ? t('detail.yearAgo') 
              : `${t('detail.yearsAgo').replace('{years}', years.toString())}`;
          }

          return {
            id: review.id,
            userName: review.user?.full_name || t('detail.anonymousUser'),
            userAvatar: review.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.full_name || 'U')}&background=003D7A&color=fff`,
            rating: review.rating,
            date: dateText,
            comment: review.comment,
            images: review.image_urls || [],
            isOwn: review.user_id === user?.id,
          };
        });

        setReviews(formattedReviews);
      } catch (err) {
        console.error('Error loading reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [businessId, user?.id]);

  // Toggle favorito
  const handleToggleFavorite = async () => {
    if (!isSignedIn) {
      Alert.alert(
        t('detail.signInToFavorite'),
        t('detail.signInToFavoriteDesc'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('detail.signInButton'), onPress: () => router.push('/(auth)/sign-in') },
        ]
      );
      return;
    }

    const ok = await toggle();
    if (!ok) {
      Alert.alert(t('common.error'), t('detail.favoriteError'));
    }
  };

  // ======================================
  // FUNCIONES PARA MANEJAR REVIEWS
  // ======================================

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'all') return reviews;
    return reviews.filter((review) => review.rating === reviewFilter);
  }, [reviews, reviewFilter]);

  const ratingDistribution: RatingDistribution[] = useMemo(() => {
    const distribution = [
      { stars: 5, count: 0, percentage: 0 },
      { stars: 4, count: 0, percentage: 0 },
      { stars: 3, count: 0, percentage: 0 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ];

    reviews.forEach((review) => {
      const index = 5 - review.rating;
      distribution[index].count++;
    });

    const total = reviews.length || 1;
    distribution.forEach((item) => {
      item.percentage = Math.round((item.count / total) * 100);
    });

    return distribution;
  }, [reviews]);

  const handleWriteReview = useCallback(async () => {
    if (!isSignedIn) {
      Alert.alert(
        t('detail.signInToReview'),
        t('detail.signInToReviewDesc'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('detail.signInButton'), onPress: () => router.push('/(auth)/sign-in') },
        ]
      );
      return;
    }

    // Verificar si el usuario ya tiene una reseña
    if (!businessId || !user?.id) return;

    const { hasReviewed, review } = await ReviewsService.hasUserReviewedBusiness(
      user.id,
      businessId
    );

    if (hasReviewed && review) {
      // Si ya tiene reseña, abrir modal en modo edición
      setIsEditingReview(true);
      setEditingReviewId(review.id);
      setNewReview({
        rating: review.rating,
        comment: review.comment,
        images: review.image_urls || [],
      });
      setShowReviewModal(true);
    } else {
      // Si no tiene reseña, abrir modal para crear nueva
      setIsEditingReview(false);
      setEditingReviewId(null);
      setNewReview({
        rating: 0,
        comment: '',
        images: [],
      });
      setShowReviewModal(true);
    }
  }, [isSignedIn, businessId, user?.id, t, router]);

  const handleSubmitReview = useCallback(async () => {
    if (!businessId || !user?.id) return;

    if (newReview.rating === 0) {
      Alert.alert(t('reviewModal.error'), t('reviewModal.ratingRequired'));
      return;
    }

    if (newReview.comment.trim().length === 0) {
      Alert.alert(t('reviewModal.error'), t('reviewModal.commentRequired'));
      return;
    }

    // 🆕 Activar estado de loading
    setIsSubmittingReview(true);

    try {
      if (isEditingReview && editingReviewId) {
        // Actualizar reseña existente
        const { data, error } = await ReviewsService.updateReview(editingReviewId, {
          rating: newReview.rating,
          comment: newReview.comment,
          image_urls: newReview.images.length > 0 ? newReview.images : null,
        });

        if (error) throw error;

        Alert.alert(t('reviewModal.success'), t('reviewModal.reviewUpdated'));
      } else {
        // Crear nueva reseña
        const { data, error } = await ReviewsService.createReview({
          business_id: businessId,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment,
          image_urls: newReview.images.length > 0 ? newReview.images : null,
        });

        if (error) throw error;

        Alert.alert(t('reviewModal.success'), t('reviewModal.reviewPublished'));
      }

      // Cerrar modal y resetear estado
      setShowReviewModal(false);
      setNewReview({ rating: 0, comment: '', images: [] });
      setIsEditingReview(false);
      setEditingReviewId(null);

      // Recargar reseñas
      const { data: updatedReviews } = await ReviewsService.getReviewsByBusinessWithUser(businessId);
      if (updatedReviews) {
        const formattedReviews: Review[] = updatedReviews.map((review) => ({
          id: review.id,
          userName: review.user?.full_name || t('detail.anonymousUser'),
          userAvatar: review.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.full_name || 'U')}&background=003D7A&color=fff`,
          rating: review.rating,
          date: new Date(review.created_at || '').toLocaleDateString(),
          comment: review.comment,
          images: review.image_urls || [],
          isOwn: review.user_id === user?.id,
        }));
        setReviews(formattedReviews);
      }

      // Recargar el negocio para actualizar estadísticas
      const { data: updatedBusiness } = await BusinessesService.getBusinessFullById(businessId);
      if (updatedBusiness) {
        setBusiness(updatedBusiness);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert(t('common.error'), t('reviewModal.errorSubmitting'));
    } finally {
      // 🆕 Desactivar estado de loading siempre (incluso si hay error)
      setIsSubmittingReview(false);
    }
  }, [businessId, user?.id, newReview, isEditingReview, editingReviewId, t]);

  const handleAddPhoto = useCallback(async () => {
    if (newReview.images.length >= 5) {
      Alert.alert(t('reviewModal.maxPhotosReached'), t('reviewModal.maxPhotosReachedDesc'));
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('reviewModal.permissionDenied'), t('reviewModal.permissionDeniedDesc'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewReview((prev) => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri],
      }));
    }
  }, [newReview.images.length, t]);

  const handleRemovePhoto = useCallback((index: number) => {
    setNewReview((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleReviewOptions = useCallback((review: Review) => {
    if (!review.isOwn) return;

    const options = [t('reviewModal.edit'), t('reviewModal.delete'), t('common.cancel')];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            // Editar
            setIsEditingReview(true);
            setEditingReviewId(review.id);
            setNewReview({
              rating: review.rating,
              comment: review.comment,
              images: review.images || [],
            });
            setShowReviewModal(true);
          } else if (buttonIndex === 1) {
            // Eliminar
            Alert.alert(
              t('reviewModal.deleteReview'),
              t('reviewModal.deleteReviewConfirm'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('reviewModal.delete'),
                  style: 'destructive',
                  onPress: async () => {
                    if (!businessId) return;
                    const { success, error } = await ReviewsService.deleteReview(review.id, businessId);
                    if (success) {
                      Alert.alert(t('reviewModal.success'), t('reviewModal.reviewDeleted'));
                      // Recargar reseñas
                      const { data } = await ReviewsService.getReviewsByBusinessWithUser(businessId);
                      if (data) {
                        const formattedReviews: Review[] = data.map((r) => ({
                          id: r.id,
                          userName: r.user?.full_name || t('detail.anonymousUser'),
                          userAvatar: r.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.full_name || 'U')}&background=003D7A&color=fff`,
                          rating: r.rating,
                          date: new Date(r.created_at || '').toLocaleDateString(),
                          comment: r.comment,
                          images: r.image_urls || [],
                          isOwn: r.user_id === user?.id,
                        }));
                        setReviews(formattedReviews);
                      }
                    } else {
                      Alert.alert(t('common.error'), t('reviewModal.errorDeleting'));
                    }
                  },
                },
              ]
            );
          }
        }
      );
    } else {
      Alert.alert(
        t('reviewModal.options'),
        '',
        [
          {
            text: t('reviewModal.edit'),
            onPress: () => {
              setIsEditingReview(true);
              setEditingReviewId(review.id);
              setNewReview({
                rating: review.rating,
                comment: review.comment,
                images: review.images || [],
              });
              setShowReviewModal(true);
            },
          },
          {
            text: t('reviewModal.delete'),
            style: 'destructive',
            onPress: () => {
              Alert.alert(
                t('reviewModal.deleteReview'),
                t('reviewModal.deleteReviewConfirm'),
                [
                  { text: t('common.cancel'), style: 'cancel' },
                  {
                    text: t('reviewModal.delete'),
                    style: 'destructive',
                    onPress: async () => {
                      if (!businessId) return;
                      const { success } = await ReviewsService.deleteReview(review.id, businessId);
                      if (success) {
                        Alert.alert(t('reviewModal.success'), t('reviewModal.reviewDeleted'));
                        const { data } = await ReviewsService.getReviewsByBusinessWithUser(businessId);
                        if (data) {
                          const formattedReviews: Review[] = data.map((r) => ({
                            id: r.id,
                            userName: r.user?.full_name || t('detail.anonymousUser'),
                            userAvatar: r.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.full_name || 'U')}&background=003D7A&color=fff`,
                            rating: r.rating,
                            date: new Date(r.created_at || '').toLocaleDateString(),
                            comment: r.comment,
                            images: r.image_urls || [],
                            isOwn: r.user_id === user?.id,
                          }));
                          setReviews(formattedReviews);
                        }
                      } else {
                        Alert.alert(t('common.error'), t('reviewModal.errorDeleting'));
                      }
                    },
                  },
                ]
              );
            },
          },
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
        ]
      );
    }
  }, [businessId, user?.id, t]);

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
    return checkIfBusinessIsOpen(rawHours, t);
  }, [rawHours, business?.is_open, t]);

  // Obtener texto de cierre
  const closingTimeText = useMemo(() => {
    if (!rawHours || rawHours.length === 0) return null;
    return getClosingTimeText(rawHours, t);
  }, [rawHours, t]);

  // Formatear horarios
  const businessHours = useMemo(() => {
    if (!rawHours || rawHours.length === 0) return [];

    const currentDay = getCurrentDayOfWeek(t);

    return rawHours.map(hour => ({
      day: hour.day,
      hours: hour.isClosed
        ? t('detail.closed')
        : `${formatTimeTo12Hour(hour.opensAt || '')} - ${formatTimeTo12Hour(hour.closesAt || '')}`,
      isToday: hour.day === currentDay,
    }));
  }, [rawHours, t]);

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
      Alert.alert(t('common.error'), t('detail.shareError'));
    }
  };

  // Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003D7A" />
          <Text style={styles.loadingText}>{t('detail.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error
  if (error || !business) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.error}>{error ?? t('detail.businessNotFound')}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>{t('detail.back')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Datos normalizados - INCLUIR CATEGORY
  const businessData = {
    id: business.id,
    name: business.name,
    category: business.category_name || t('detail.noCategory'), // ✅ AGREGADO
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

  // Calcular rating promedio basado en las reseñas reales
  const actualRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : businessData.rating;

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
            rating={actualRating}
            reviews={reviews}
            filteredReviews={filteredReviews}
            reviewFilter={reviewFilter}
            ratingDistribution={ratingDistribution}
            onWriteReview={handleWriteReview}
            onFilterChange={setReviewFilter}
            onReviewOptions={handleReviewOptions}
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FloatingReserveButton
        onPress={() => Alert.alert(t('detail.reservations'), t('detail.featureInDevelopment'))}
      />

      <ReviewModal
        visible={showReviewModal}
        businessName={businessData.name ?? ''}
        review={newReview}
        isEditing={isEditingReview}
        isSubmitting={isSubmittingReview} // 🆕 Agregar prop de loading
        onClose={() => {
          setShowReviewModal(false);
          setNewReview({ rating: 0, comment: '', images: [] });
          setIsEditingReview(false);
          setEditingReviewId(null);
        }}
        onSubmit={handleSubmitReview}
        onRatingChange={(rating) => setNewReview((prev) => ({ ...prev, rating }))}
        onCommentChange={(comment) => setNewReview((prev) => ({ ...prev, comment }))}
        onAddPhoto={handleAddPhoto}
        onRemovePhoto={handleRemovePhoto}
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