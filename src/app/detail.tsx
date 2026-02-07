import { BusinessInfo } from '@/components/details/BusinessInfo';
import { DetailHeader } from '@/components/details/DetailHeader';
import { FloatingReserveButton } from '@/components/details/FloatingReserveButton';
import { HoursSection } from '@/components/details/HoursSection';
import { ImageGallery } from '@/components/details/ImageGallery';
import { QuickActions } from '@/components/details/QuickActions';
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
    name: business.name,
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
    city: business.city ?? '',
    state: business.state ?? '',
    phone: business.phone ?? '',
    email: business.email ?? '',
    website: business.website ?? '',
    latitude: business.latitude ?? 0,
    longitude: business.longitude ?? 0,
    main_image_url: business.main_image_url ?? '',
    gallery_urls: business.gallery_urls ?? [],
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

        {hours && hours.length > 0 && <HoursSection businessHours={hours} />}

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