// components/profile/MenuRow.tsx
import { hairline, palette, spacing, type } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    /** Texto gris a la derecha: un conteo, un estado, el idioma actual. */
    value?: string | number;
    onPress: () => void;
    /** Rojo, para acciones destructivas. */
    destructive?: boolean;
    /** Última fila de un grupo: sin línea inferior. */
    last?: boolean;
};

/**
 * Fila de menú al estilo Airbnb: icono fino a la izquierda, etiqueta,
 * chevron, y una hairline como separador. Sin cuadritos de color de fondo.
 */
export function MenuRow({
    icon,
    label,
    value,
    onPress,
    destructive = false,
    last = false,
}: Props) {
    const tint = destructive ? palette.danger : palette.ink;

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            style={({ pressed }) => [
                styles.row,
                !last && styles.divider,
                pressed && styles.pressed,
            ]}
        >
            <Ionicons name={icon} size={22} color={tint} style={styles.icon} />

            <Text style={[styles.label, destructive && styles.destructive]} numberOfLines={1}>
                {label}
            </Text>

            {value !== undefined && value !== '' && (
                <Text style={styles.value} numberOfLines={1}>
                    {value}
                </Text>
            )}

            <Ionicons name="chevron-forward" size={18} color={palette.faint} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
        paddingVertical: spacing.lg,
    },
    divider: {
        borderBottomWidth: hairline,
        borderBottomColor: palette.borderSoft,
    },
    pressed: {
        opacity: 0.55,
    },
    icon: {
        width: 24,
    },
    label: {
        ...type.body,
        flex: 1,
    },
    destructive: {
        color: palette.danger,
    },
    value: {
        ...type.small,
    },
});