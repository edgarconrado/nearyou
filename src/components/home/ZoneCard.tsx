import { palette, radius, spacing, type } from '@/constants/design';
import type { Zone } from '@/services/zones.service';
import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const GUTTER = spacing.lg;
const GAP = spacing.md;
const CARD_WIDTH = (Dimensions.get('window').width - GUTTER * 2 - GAP) / 2;

type Props = {
  zone: Zone;
  index: number;
  onPress: (zone: Zone) => void;
};

/**
 * Tarjeta de zona: foto cuadrada con esquinas redondeadas y el texto FUERA
 * de la imagen. Sin overlay oscuro, sin sombra — así se lee el color de la foto.
 */
export function ZoneCard({ zone, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(zone)}
      accessibilityRole="button"
      accessibilityLabel={`${zone.name}, ${zone.state}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        {zone.image_url ? (
          <Image
            source={{ uri: zone.image_url }}
            style={styles.image}
            contentFit="cover"
            transition={180}
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {zone.name}
      </Text>
      <Text style={styles.state} numberOfLines={1}>
        {zone.state}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
  },
  pressed: {
    opacity: 0.75,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: palette.skeleton,
    marginBottom: spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: palette.skeleton,
  },
  name: {
    ...type.smallStrong,
    fontSize: 15,
  },
  state: {
    ...type.small,
    fontSize: 14,
  },
});
