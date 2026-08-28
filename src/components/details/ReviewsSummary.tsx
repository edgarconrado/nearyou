import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RatingDistribution } from '../../types/types';

interface ReviewsSummaryProps {
  rating: number;
  reviewsCount: number;
  ratingDistribution: RatingDistribution[];
}

/**
 * Promedio grande a la izquierda y barras de distribución a la derecha.
 * Las barras usan gris oscuro en vez de amarillo: el dato lo da la longitud,
 * no el color.
 */
export const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({
  rating,
  reviewsCount,
  ratingDistribution,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.overview}>
        <Text style={styles.number}>{rating.toFixed(1)}</Text>
        <Ionicons name="star" size={18} color={palette.ink} />
        <Text style={styles.count}>
          {reviewsCount} {reviewsCount === 1 ? t('detail.review') : t('detail.reviews')}
        </Text>
      </View>

      <View style={styles.bars}>
        {ratingDistribution.map((item) => (
          <View key={item.stars} style={styles.barRow}>
            <Text style={styles.starLabel}>{item.stars}</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${item.percentage}%` }]} />
            </View>
            <Text style={styles.countLabel}>{item.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: hairline,
    borderColor: palette.border,
    borderRadius: radius.md,
  },
  overview: { alignItems: 'center', gap: 2, minWidth: 72 },
  number: { ...type.display, fontSize: 34 },
  count: { ...type.caption, textAlign: 'center' },

  bars: { flex: 1, gap: 5 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  starLabel: { ...type.caption, width: 10, textAlign: 'right' },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.borderSoft,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 2, backgroundColor: palette.ink },
  countLabel: { ...type.caption, width: 20 },
});