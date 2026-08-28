// components/explore/FiltersSection.tsx
import { hairline, palette, spacing, type } from '@/constants/design';
import { useCategories } from '@/hooks/use-categories';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface FiltersSectionProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

type ChipProps = {
  label: string;
  icon?: string;
  active: boolean;
  onPress: () => void;
};

/**
 * Categorías al estilo Airbnb: icono + etiqueta en columna, sin fondo,
 * y la selección se marca con un subrayado grueso. Nada de píldoras de color.
 */
function CategoryChip({ label, icon, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
    >
      {!!icon && (
        <Ionicons
          name={icon as any}
          size={22}
          color={active ? palette.ink : palette.muted}
        />
      )}
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]} numberOfLines={1}>
        {label}
      </Text>
      <View style={[styles.underline, active && styles.underlineActive]} />
    </Pressable>
  );
}

export function FiltersSection({ selectedFilter, onFilterChange }: FiltersSectionProps) {
  const { categories, loading, error } = useCategories();

  if (error) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <CategoryChip
          label="Todos"
          icon="apps-outline"
          active={selectedFilter === 'Todos'}
          onPress={() => onFilterChange('Todos')}
        />

        {!loading &&
          categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name}
              icon={category.icon ?? 'pricetag-outline'}
              active={selectedFilter === category.name}
              onPress={() => onFilterChange(category.name)}
            />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    borderBottomWidth: hairline,
    borderBottomColor: palette.border,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  chip: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.md,
    minWidth: 56,
  },
  chipPressed: {
    opacity: 0.6,
  },
  chipLabel: {
    ...type.caption,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: palette.ink,
  },
  underline: {
    height: 2,
    width: '100%',
    marginTop: spacing.sm,
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: palette.ink,
  },
});
