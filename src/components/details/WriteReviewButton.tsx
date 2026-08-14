import { palette, radius, spacing, type } from '@/constants/design';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface WriteReviewButtonProps {
    onPress: () => void;
}

/** Acción primaria del bloque de reseñas: botón sólido en tinta. */
export const WriteReviewButton: React.FC<WriteReviewButtonProps> = ({ onPress }) => (
    <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
        <Text style={styles.text}>Escribir una opinión</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: radius.sm,
        backgroundColor: palette.ink,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    pressed: { opacity: 0.85 },
    text: { ...type.smallStrong, color: palette.white, fontSize: 15 },
});