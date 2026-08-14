import { hairline, palette, spacing, type } from '@/constants/design';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TabsNavigationProps {
  selectedTab: 'about' | 'reviews';
  onTabChange: (tab: 'about' | 'reviews') => void;
  reviewsCount: number;
}

/** Pestañas con subrayado en tinta, coherentes con los filtros de Explorar. */
export const TabsNavigation: React.FC<TabsNavigationProps> = ({
  selectedTab,
  onTabChange,
  reviewsCount,
}) => {
  const tabs = [
    { key: 'about' as const, label: 'Acerca de' },
    { key: 'reviews' as const, label: `Opiniones (${reviewsCount})` },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = selectedTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
            <View style={[styles.underline, active && styles.underlineActive]} />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: hairline,
    borderBottomColor: palette.border,
  },
  tab: { flex: 1, alignItems: 'center' },
  pressed: { opacity: 0.6 },
  label: { ...type.smallStrong, color: palette.muted, paddingVertical: spacing.lg },
  labelActive: { color: palette.ink },
  underline: { height: 2, width: '100%', backgroundColor: 'transparent' },
  underlineActive: { backgroundColor: palette.ink },
});