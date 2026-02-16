import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface LocationSectionProps {
    coordinates: {
        latitude: number;
        longitude: number;
    };
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

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Ionicons name="location" size={24} color="#003D7A" />
                <Text style={styles.sectionTitle}>{t('detail.location')}</Text>
            </View>

            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    <Marker
                        coordinate={coordinates}
                        title={businessName}
                        description={address}
                    />
                </MapView>
            </View>

            <View style={styles.addressContainer}>
                <Text style={styles.addressText}>{address}</Text>
                <Text style={styles.addressText}>{city}</Text>
                <Text style={styles.addressText}>C.P. {postalCode}</Text>
                <TouchableOpacity style={styles.directionsButton} onPress={onDirections}>
                    <Ionicons name="navigate" size={20} color="#FFFFFF" />
                    <Text style={styles.directionsButtonText}>{t('detail.getDirections')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    mapContainer: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    addressContainer: {
        gap: 6,
    },
    addressText: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
    directionsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#003D7A',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 12,
    },
    directionsButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});