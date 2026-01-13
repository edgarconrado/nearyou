import { useUserLocation } from '@/contexts/LocationContext';
import type { BusinessFull } from '@/services/businesses.service';
import { calculateAndFormatDistance } from '@/utils/distance.utils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BusinessCardProps {
    business: BusinessFull;
    onPress: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, onPress }) => {
    const { location: userLocation } = useUserLocation();

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Ionicons key={`star-${i}`} name="star" size={14} color="#FFB800" />);
        }
        if (hasHalfStar) {
            stars.push(<Ionicons key="half-star" name="star-half" size={14} color="#FFB800" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#FFB800" />);
        }
        return stars;
    };

    // Determinar si está abierto basado en horarios (simplificado)
    // TODO: Implementar lógica real basada en opening_hours
    const isOpen = business.is_active;

    // Calcular distancia real
    const getDistance = (): string => {
        if (!business.latitude || !business.longitude) {
            return 'N/A';
        }

        return calculateAndFormatDistance(
            userLocation,
            { latitude: business.latitude, longitude: business.longitude }
        );
    };

    // Obtener rating y reviews
    const rating = business.average_rating || 0;
    const reviews = business.total_reviews || 0;

    return (
        <TouchableOpacity
            style={styles.businessCard}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Image
                source={{
                    uri: business.main_image_url || 'https://via.placeholder.com/400x180?text=Sin+Imagen'
                }}
                style={styles.businessImage}
                resizeMode="cover"
            />

            <View style={styles.businessInfo}>
                <View style={styles.businessHeader}>
                    <Text style={styles.businessName} numberOfLines={1}>
                        {business.name}
                    </Text>
                    <View style={[
                        styles.statusBadge,
                        isOpen ? styles.statusOpen : styles.statusClosed
                    ]}>
                        <Text style={[
                            styles.statusText,
                            !isOpen && styles.statusTextClosed
                        ]}>
                            {isOpen ? 'Abierto' : 'Cerrado'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.businessCategory}>
                    {business.category_name || 'Sin categoría'}
                </Text>

                <Text style={styles.businessDescription} numberOfLines={2}>
                    {business.description || 'Sin descripción disponible'}
                </Text>

                <View style={styles.businessMeta}>
                    <View style={styles.ratingContainer}>
                        {rating > 0 ? (
                            <>
                                <View style={styles.starsRow}>
                                    {renderStars(rating)}
                                </View>
                                <Text style={styles.ratingText}>
                                    {rating.toFixed(1)} ({reviews})
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.noRatingText}>Sin calificaciones</Text>
                        )}
                    </View>

                    <View style={styles.distanceContainer}>
                        <Ionicons name="navigate-outline" size={14} color="#666" />
                        <Text style={styles.distanceText}>{getDistance()}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    businessCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    businessImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#F0F0F0',
    },
    businessInfo: {
        padding: 16,
    },
    businessHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    businessName: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusOpen: {
        backgroundColor: '#E8F5E9',
    },
    statusClosed: {
        backgroundColor: '#FFEBEE',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2E7D32',
    },
    statusTextClosed: {
        color: '#C62828',
    },
    businessCategory: {
        fontSize: 13,
        color: '#003D7A',
        fontWeight: '600',
        marginBottom: 6,
    },
    businessDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    businessMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
    },
    ratingText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    noRatingText: {
        fontSize: 13,
        color: '#999',
        fontStyle: 'italic',
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    distanceText: {
        fontSize: 13,
        color: '#666',
    },
});