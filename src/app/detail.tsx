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
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isSignedIn } = useAuth();

  /** 🔑 Normalizar businessId UNA sola vez */
  const businessId = useMemo(() => {
    const raw = params.businessId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.businessId]);

  const [business, setBusiness] = useState<BusinessFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** ⭐ Favoritos (solo si hay businessId) */
  const {
    isFavorite,
    toggling,
    toggle,
  } = useBusinessFavorite(businessId ?? null);

  /** 📍 Ubicación */
  const { location: userLocation } = useUserLocation();

  /** ⏰ Horarios */
  const {
    hours,
    isOpen,
    closingTimeFormatted,
  } = useBusinessHours(business?.id);

  /** 📦 Cargar negocio */
  useEffect(() => {
    if (!businessId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } =
          await BusinessesService.getBusinessFullById(businessId);

        if (error || !data) throw error;

        setBusiness(data);
        BusinessesService.incrementVisitCount(businessId).catch(() => { });
      } catch {
        setError('No se pudo cargar el negocio');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [businessId]);

  /** ❤️ Toggle favorito */
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

  /** 🖼 Galería */
  const gallery = useMemo(() => {
    const images: string[] = [];
    if (business?.main_image_url) images.push(business.main_image_url);

    if (business?.gallery_images) {
      try {
        images.push(...JSON.parse(business.gallery_images));
      } catch { }
    }

    return images.length
      ? images
      : ['https://via.placeholder.com/800x600?text=Sin+Imagen'];
  }, [business]);

  /** ⏳ Estados */
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando información…</Text>
      </SafeAreaView>
    );
  }

  if (error || !business) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>{error ?? 'Negocio no encontrado'}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /** 📊 Datos normalizados */
  const businessData = {
    id: business.id,
    name: business.name,
    rating: business.average_rating ?? 0,
    reviews: business.total_reviews ?? 0,
    address: business.address ?? '',
    city: `${business.city ?? ''}, ${business.state ?? ''}`,
    phone: business.phone ?? '',
    email: business.email ?? '',
    website: business.website ?? '',
    image: business.main_image_url ?? '',
    coordinates: {
      latitude: business.latitude ?? 0,
      longitude: business.longitude ?? 0,
    },
    gallery,
    closingTime: closingTimeFormatted,
    isOpen,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <DetailHeader
        businessName={businessData.name}
        onBack={() => router.back()}
      />

      <ScrollView>
        <ImageGallery images={businessData.gallery} />

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

        {hours?.length > 0 && <HoursSection businessHours={hours} />}
      </ScrollView>

      <FloatingReserveButton
        onPress={() => Alert.alert('Reservas', 'En desarrollo')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', marginBottom: 12 },
});
