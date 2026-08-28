import { palette, radius, spacing, type } from '@/constants/design';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  onClear: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onClear,
  title = 'Sin resultados por aquí',
  message = 'Prueba con otro término o quita algunos filtros para ver más lugares.',
  actionLabel = 'Quitar filtros',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        onPress={onClear}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...type.subheading,
    textAlign: 'center',
  },
  message: {
    ...type.small,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.lg,
    height: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: palette.surface,
  },
  buttonText: {
    ...type.smallStrong,
    fontSize: 15,
  },
});
