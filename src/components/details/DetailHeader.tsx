import { elevation, palette, spacing, type } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DetailHeaderProps {
  businessName: string;
  onBack: () => void;
  onShare: () => void;
  /** Cuando es true, la cabecera flota sobre la foto (botones circulares). */
  floating?: boolean;
}

/**
 * Cabecera del detalle. Por defecto flota sobre la galería con botones
 * circulares blancos, como Airbnb: la foto ocupa hasta arriba de la pantalla
 * y el título no compite con ella.
 */
export const DetailHeader: React.FC<DetailHeaderProps> = ({
  businessName,
  onBack,
  onShare,
  floating = true,
}) => {
  const insets = useSafeAreaInsets();

  if (!floating) {
    return (
      <View style={[styles.solid, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={onBack} hitSlop={10} style={styles.plainButton}>
          <Ionicons name="chevron-back" size={24} color={palette.ink} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {businessName}
        </Text>
        <Pressable onPress={onShare} hitSlop={10} style={styles.plainButton}>
          <Ionicons name="share-outline" size={22} color={palette.ink} />
        </Pressable>
      </View>
    );
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.floating, { paddingTop: insets.top + spacing.sm }]}
    >
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        style={({ pressed }) => [styles.circle, pressed && styles.pressed]}
      >
        <Ionicons name="chevron-back" size={22} color={palette.ink} />
      </Pressable>

      <Pressable
        onPress={onShare}
        accessibilityRole="button"
        accessibilityLabel="Compartir"
        style={({ pressed }) => [styles.circle, pressed && styles.pressed]}
      >
        <Ionicons name="share-outline" size={20} color={palette.ink} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.float,
  },
  pressed: { opacity: 0.75 },

  solid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: palette.white,
  },
  plainButton: { width: 32, alignItems: 'center' },
  title: { ...type.subheading, flex: 1, textAlign: 'center' },
});