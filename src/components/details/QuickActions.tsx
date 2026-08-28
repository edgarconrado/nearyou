import { hairline, palette, spacing, type } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface QuickActionsProps {
  hasPhone?: boolean;
  hasWebsite?: boolean;
  hasCoordinates?: boolean;
  onCall: () => void;
  onWebsite: () => void;
  onDirections: () => void;
  onShare: () => void;
}

/**
 * Acciones rápidas: iconos outline en fila, sin cuadros de color de fondo.
 * Las acciones no disponibles simplemente no se muestran, en lugar de
 * aparecer deshabilitadas en gris — menos ruido visual.
 */
export const QuickActions: React.FC<QuickActionsProps> = ({
  hasPhone = true,
  hasWebsite = true,
  hasCoordinates = true,
  onCall,
  onWebsite,
  onDirections,
  onShare,
}) => {
  const { t } = useLanguage();

  const actions = [
    { key: 'call', show: hasPhone, icon: 'call-outline', label: t('detail.call'), onPress: onCall },
    {
      key: 'directions',
      show: hasCoordinates,
      icon: 'navigate-outline',
      label: t('detail.directions'),
      onPress: onDirections,
    },
    {
      key: 'website',
      show: hasWebsite,
      icon: 'globe-outline',
      label: t('detail.website'),
      onPress: onWebsite,
    },
    { key: 'share', show: true, icon: 'share-outline', label: t('detail.share'), onPress: onShare },
  ].filter((a) => a.show);

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.key}
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Ionicons name={action.icon as any} size={22} color={palette.ink} />
          <Text style={styles.label} numberOfLines={1}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    borderTopWidth: hairline,
    borderBottomWidth: hairline,
    borderColor: palette.border,
  },
  action: { flex: 1, alignItems: 'center', gap: spacing.sm },
  pressed: { opacity: 0.55 },
  label: { ...type.caption, color: palette.ink, fontWeight: '600' },
});