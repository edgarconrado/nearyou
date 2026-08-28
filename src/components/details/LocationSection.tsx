import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface LocationSectionProps {
    coordinates: { latitude: number; longitude: number };
    businessName: string;
    address: string;
    city: string;
    postalCode: string;
    onDirections: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
    coordinates,
    businessName,
    address,
    city,
    postalCode,
    onDirections,
}) => {
    const { t } = useLanguage();

    const fullAddress = [address, city, postalCode ? `C.P. ${postalCode}` : '']
        .filter(Boolean)
        .join(', ');

    return (
        <View style={styles.section}>
            <Text style={styles.title}>{t('detail.location')}</Text>

            <View style={styles.mapWrap}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                    pointerEvents="none"
                >
                    <Marker coordinate={coordinates} title={businessName} description={address} />
                </MapView>
            </View>

            <Text style={styles.address}>{fullAddress}</Text>

            <Pressable
                onPress={onDirections}
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            >
                <Ionicons name="navigate-outline" size={18} color={palette.ink} />
                <Text style={styles.buttonText}>{t('detail.getDirections')}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        borderTopWidth: hairline,
        borderTopColor: palette.border,
    },
    title: { ...type.heading, marginBottom: spacing.lg },
    mapWrap: {
        height: 180,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: palette.skeleton,
    },
    map: { width: '100%', height: '100%' },
    address: { ...type.small, marginTop: spacing.md },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        height: 48,
        marginTop: spacing.lg,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: palette.ink,
    },
    pressed: { backgroundColor: palette.surface },
    buttonText: { ...type.smallStrong, fontSize: 15 },
});