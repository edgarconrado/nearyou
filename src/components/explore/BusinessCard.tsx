// components/explore/BusinessCard.tsx
import { palette, radius, spacing, type } from '@/constants/design';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import type { BusinessFull } from '@services/businesses.service';
import { Image } from 'expo-image';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * La vista `businesses_full` agrega el conteo de ofertas y `sortByDistance`
 * inyecta la distancia en tiempo de ejecución: ninguno está en los tipos
 * generados, así que se declaran aquí.
 */
export type BusinessListItem = BusinessFull & {
  active_offers_count?: number | null;
  distance?: number | null;
};

interface BusinessCardProps {
  business: BusinessListItem;
  onPress: () => void;
}

function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

/**
 * Tarjeta de negocio en una sola columna, como un anuncio de Airbnb:
 * foto grande 4:3, corazón sobre la foto, y debajo tres líneas de texto
 * jerarquizadas solo por peso y color. Sin badges de colores ni sombras.
 */
export function BusinessCard({ business, onPress }: BusinessCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const favorite = isFavorite(String(business.id));

  const hasOffers = !!business.active_offers_count && business.active_offers_count > 0;
  const hasDistance = business.distance !== undefined && business.distance !== null;
  const isOpen = business.is_open ?? true;
  const rating = business.average_rating ?? null;
  const reviews = business.total_reviews ?? 0;

  const businessId = String(business.id);

  const onToggleFavorite = useCallback(() => {
    toggleFavorite(businessId);
  }, [businessId, toggleFavorite]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={business.name ?? undefined}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        {business.main_image_url ? (
          <Image
            source={{ uri: business.main_image_url }}
            style={styles.image}
            contentFit="cover"
            transition={180}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={28} color={palette.faint} />
          </View>
        )}

        {hasOffers && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {business.active_offers_count === 1
                ? '1 oferta'
                : `${business.active_offers_count} ofertas`}
            </Text>
          </View>
        )}

        <Pressable
          onPress={onToggleFavorite}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          style={styles.heart}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={22}
            color={favorite ? palette.accent : palette.white}
            style={styles.heartIcon}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {business.name}
          </Text>
          {rating !== null && (
            <View style={styles.rating}>
              <Ionicons name="star" size={11} color={palette.ink} />
              <Text style={styles.ratingText}>
                {Number(rating).toFixed(1)}
                {reviews > 0 ? ` (${reviews})` : ''}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.meta} numberOfLines={1}>
          {[business.category_name, hasDistance && formatDistance(business.distance!)]
            .filter(Boolean)
            .join(' · ')}
        </Text>

        <Text style={[styles.status, isOpen ? styles.open : styles.closed]}>
          {isOpen ? 'Abierto ahora' : 'Cerrado'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    // flex:1 dentro de la fila de dos columnas del FlatList
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  imageWrap: {
    width: '100%',
    // Cuadrada: en media pantalla el 4:3 se veía achatado
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: palette.skeleton,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: palette.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  tagText: {
    ...type.captionStrong,
  },
  heart: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    padding: spacing.xs,
  },
  heartIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  body: {
    paddingTop: spacing.sm,
    gap: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...type.smallStrong,
    fontSize: 15,
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    ...type.captionStrong,
  },
  meta: {
    ...type.caption,
  },
  status: {
    ...type.caption,
    fontWeight: '600',
  },
  open: {
    color: palette.success,
  },
  closed: {
    color: palette.muted,
  },
});