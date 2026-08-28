// components/explore/ExploreHeader.tsx
import { LocationIndicator } from '@common/LocationIndicator';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExploreHeaderProps {
    zoneName: string;
    zoneLocation: string;
    zoneImage: string;
    onBack: () => void;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({
    zoneName,
    zoneLocation,
    zoneImage,
    onBack,
}) => {
    return (
        <View style={styles.header}>
            <Image
                source={{ uri: zoneImage }}
                style={styles.backgroundImage}
                blurRadius={2}
            />
            <View style={styles.overlay} />
            
            <View style={styles.headerContent}>
                <View style={styles.topRow}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <LocationIndicator 
                        variant="compact" 
                        showRefreshButton={true}
                    />
                </View>

                <View style={styles.headerInfo}>
                    <Text style={styles.zoneName}>{zoneName}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={16} color="#FFFFFF" />
                        <Text style={styles.zoneLocation}>{zoneLocation}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 180,
        position: 'relative',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 61, 122, 0.7)',
    },
    headerContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfo: {
        gap: 4,
    },
    zoneName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    zoneLocation: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
    },
});