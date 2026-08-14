// components/auth/SocialButton.tsx
import { palette, radius, type } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

/**
 * Botón de proveedor: borde de 1px, icono anclado a la izquierda y
 * etiqueta centrada — el patrón exacto de la pantalla de acceso de Airbnb.
 */
export function SocialButton({
  label,
  icon,
  iconColor = palette.ink,
  onPress,
  loading = false,
  disabled = false,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      <View style={styles.iconSlot}>
        {loading ? (
          <ActivityIndicator size="small" color={palette.ink} />
        ) : (
          <Ionicons name={icon} size={20} color={iconColor} />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.ink,
    backgroundColor: palette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: palette.surface,
  },
  disabled: {
    opacity: 0.5,
  },
  iconSlot: {
    position: 'absolute',
    left: 16,
    width: 24,
    alignItems: 'center',
  },
  label: {
    ...type.smallStrong,
    fontSize: 15,
  },
});
