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
        <View style={styles.headerContainer}>
            <Image
                source={{ uri: zoneImage }}
                style={styles.headerImage}
                resizeMode="cover"
            />
            <View style={styles.headerOverlay}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.favoriteButton}>
                        <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{zoneName}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={16} color="#FFFFFF" />
                        <Text style={styles.headerLocation}>{zoneLocation}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 220,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'space-between',
        padding: 16,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        gap: 4,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    headerLocation: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.95,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
});