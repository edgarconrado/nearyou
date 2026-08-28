// components/explore/ZoneInfoButton.tsx
import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface ZoneInfoButtonProps {
  onPress: () => void;
}

/** Acción secundaria: contorno, no relleno. */
export function ZoneInfoButton({ onPress }: ZoneInfoButtonProps) {
  const { t } = useLanguage();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name="information-circle-outline" size={18} color={palette.ink} />
      <Text style={styles.text}>{t('detail.aboutThisPlace')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 44,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: hairline,
    borderColor: palette.border,
    backgroundColor: palette.white,
  },
  pressed: { backgroundColor: palette.surface },
  text: { ...type.smallStrong },
});