import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

/** Datos del negocio ya normalizados para la UI. */
export interface BusinessData {
  id: string | null;
  name: string | null;
  category?: string;
  rating?: number;
  reviews?: number;
  isOpen?: boolean;
  description?: string | null;
  priceRange?: string;
  features?: string[];
  closingTime?: string | null;
  average_rating?: number | null;
  total_reviews?: number | null;
  is_open?: boolean | null;
  price_range?: string | null;
}

interface BusinessInfoProps {
  business: BusinessData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteLoading?: boolean;
}

/**
 * Bloque principal del detalle: nombre grande, una línea de metadatos y la
 * descripción. La calificación se muestra como número + estrella única, no
 * como cinco estrellas de colores — es más legible y más sobrio.
 */
export const BusinessInfo: React.FC<BusinessInfoProps> = ({
  business,
  isFavorite,
  onToggleFavorite,
  favoriteLoading = false,
}) => {
  const name = business.name || 'Sin nombre';
  const category = business.category || 'Sin categoría';
  const priceRange = business.priceRange || business.price_range || '';
  const rating = business.rating ?? business.average_rating ?? 0;
  const reviews = business.reviews ?? business.total_reviews ?? 0;
  const isOpen = business.isOpen ?? business.is_open ?? false;
  const features = business.features || [];

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.name}>{name}</Text>

        <Pressable
          onPress={onToggleFavorite}
          disabled={favoriteLoading}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Guardar'}
          style={({ pressed }) => [styles.favorite, pressed && styles.pressed]}
        >
          {favoriteLoading ? (
            <ActivityIndicator size="small" color={palette.accent} />
          ) : (
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={26}
              color={isFavorite ? palette.accent : palette.ink}
            />
          )}
        </Pressable>
      </View>

      <View style={styles.metaRow}>
        {rating > 0 && (
          <>
            <Ionicons name="star" size={13} color={palette.ink} />
            <Text style={styles.ratingText}>
              {rating.toFixed(1)}
              {reviews > 0 && (
                <Text style={styles.meta}>
                  {` (${reviews} ${reviews === 1 ? 'opinión' : 'opiniones'})`}
                </Text>
              )}
            </Text>
            <Text style={styles.dot}>·</Text>
          </>
        )}
        <Text style={styles.meta}>{category}</Text>
        {!!priceRange && (
          <>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.meta}>{priceRange}</Text>
          </>
        )}
      </View>

      <Text style={[styles.status, isOpen ? styles.open : styles.closed]}>
        {isOpen ? 'Abierto ahora' : 'Cerrado'}
        {isOpen && business.closingTime ? ` · Cierra a las ${business.closingTime}` : ''}
      </Text>

      {!!business.description && (
        <Text style={styles.description}>{business.description}</Text>
      )}

      {features.length > 0 && (
        <View style={styles.features}>
          {features.map((feature) => (
            <View key={feature} style={styles.chip}>
              <Text style={styles.chipText}>{feature}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  name: { ...type.title, flex: 1 },
  favorite: { paddingTop: 2 },
  pressed: { opacity: 0.6 },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: spacing.sm,
  },
  ratingText: { ...type.smallStrong },
  meta: { ...type.small },
  dot: { ...type.small, marginHorizontal: 2 },

  status: { ...type.small, fontWeight: '600', marginTop: spacing.xs },
  open: { color: palette.success },
  closed: { color: palette.muted },

  description: { ...type.body, color: palette.ink, marginTop: spacing.lg },

  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: hairline,
    borderColor: palette.border,
  },
  chipText: { ...type.caption, color: palette.ink },
});