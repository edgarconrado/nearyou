import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  onSearchPress?: () => void;
}

/**
 * Barra de búsqueda tipo "píldora" de Airbnb: es lo primero que se ve
 * y sustituye a la cabecera de marca en azul.
 */
export function Header({
  showBackButton = false,
  onBackPress,
  onSearchPress,
}: HeaderProps = {}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.row}>
        {showBackButton && (
          <Pressable
            onPress={onBackPress}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={22} color={palette.ink} />
          </Pressable>
        )}

        <Pressable
          onPress={onSearchPress}
          accessibilityRole="search"
          style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
        >
          <Ionicons name="search" size={18} color={palette.ink} />
          <View style={styles.pillText}>
            <Text style={styles.pillTitle}>¿A dónde vas?</Text>
            <Text style={styles.pillSubtitle}>Zona · Categoría · Cerca de ti</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: palette.white,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: hairline,
    borderBottomColor: palette.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  back: {
    width: 32,
    alignItems: 'flex-start',
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: hairline,
    borderColor: palette.border,
    backgroundColor: palette.white,
  },
  pillPressed: {
    backgroundColor: palette.surface,
  },
  pillText: {
    flex: 1,
  },
  pillTitle: {
    ...type.smallStrong,
  },
  pillSubtitle: {
    ...type.caption,
    fontSize: 11,
  },
});
