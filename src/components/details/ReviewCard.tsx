import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Review } from '../../types/types';

interface ReviewCardProps {
  review: Review;
  onOptions: () => void;
}

/** Reseña separada por hairline, sin tarjeta ni sombra. */
export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onOptions }) => {
  const initials = (review.userName || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {review.userAvatar ? (
          <Image source={{ uri: review.userAvatar }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        )}

        <View style={styles.headerInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {review.userName}
          </Text>
          <View style={styles.meta}>
            <Ionicons name="star" size={12} color={palette.ink} />
            <Text style={styles.metaText}>
              {review.rating} · {review.date}
            </Text>
          </View>
        </View>

        {/* Visible en todas las reseñas: en las propias da editar/eliminar,
            en las ajenas da reportar/bloquear (guía 1.2 de App Store). */}
        <Pressable
          onPress={onOptions}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={review.isOwn ? 'Opciones de tu reseña' : 'Reportar o bloquear'}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={palette.muted} />
        </Pressable>
      </View>

      <Text style={styles.comment}>{review.comment}</Text>

      {review.images && review.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
          {review.images.map((image, i) => (
            <Image
              key={`${image}-${i}`}
              source={{ uri: image }}
              style={styles.photo}
              contentFit="cover"
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.lg,
    borderBottomWidth: hairline,
    borderBottomColor: palette.borderSoft,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.skeleton },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ink,
  },
  initials: { ...type.captionStrong, color: palette.white },
  headerInfo: { flex: 1 },
  userName: { ...type.smallStrong, fontSize: 15 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  metaText: { ...type.caption },
  comment: { ...type.body, marginTop: spacing.md },
  gallery: { marginTop: spacing.md },
  photo: {
    width: 100,
    height: 100,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    backgroundColor: palette.skeleton,
  },
});
