// components/explore/NoZoneState.tsx
import { palette, radius, spacing, type } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Explorar necesita una zona para saber qué negocios mostrar. Cuando no hay
 * ninguna elegida, esta pantalla lo explica y lleva a Inicio, en lugar de
 * dejar la pestaña deshabilitada o mostrar una lista vacía sin contexto.
 */
export function NoZoneState() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Ionicons name="map-outline" size={48} color={palette.faint} />

            <Text style={styles.title}>Elige una zona para empezar</Text>
            <Text style={styles.body}>
                Selecciona un Pueblo Mágico o centro histórico en Inicio y aquí verás
                todos sus negocios, ordenados por cercanía.
            </Text>

            <Pressable
                onPress={() => router.push('/(tabs)')}
                accessibilityRole="button"
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            >
                <Text style={styles.buttonText}>Ver zonas disponibles</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
        backgroundColor: palette.white,
    },
    title: { ...type.subheading, textAlign: 'center', marginTop: spacing.md },
    body: { ...type.small, textAlign: 'center' },
    button: {
        marginTop: spacing.xl,
        height: 48,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.sm,
        backgroundColor: palette.ink,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: { opacity: 0.85 },
    buttonText: { ...type.smallStrong, color: palette.white, fontSize: 15 },
});