import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BusinessData {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviews: number;
    isOpen: boolean;
    description: string;
    priceRange: string;
    features: string[];
    closingTime?: string | null;
}

interface BusinessInfoProps {
    business: BusinessData;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

export const BusinessInfo: React.FC<BusinessInfoProps> = ({
    business,
    isFavorite,
    onToggleFavorite,
}) => {
    const renderStars = (rating: number, size: number = 16) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Ionicons key={`star-${i}`} name="star" size={size} color="#FFB800" />);
        }
        if (hasHalfStar) {
            stars.push(<Ionicons key="half-star" name="star-half" size={size} color="#FFB800" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={size} color="#FFB800" />);
        }
        return stars;
    };

    return (
        <View style={styles.mainInfo}>
            <View style={styles.nameRow}>
                <Text style={styles.businessName}>{business.name}</Text>
                <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={28}
                        color="#FF3B30"
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.category}>
                {business.category} • {business.priceRange}
            </Text>

            <View style={styles.ratingRow}>
                {business.rating > 0 ? (
                    <>
                        <View style={styles.starsRow}>{renderStars(business.rating, 20)}</View>
                        <Text style={styles.ratingText}>{business.rating.toFixed(1)}</Text>
                        <Text style={styles.reviewsCount}>
                            ({business.reviews} {business.reviews === 1 ? 'opinión' : 'opiniones'})
                        </Text>
                    </>
                ) : (
                    <Text style={styles.noRatingText}>Sin calificaciones aún</Text>
                )}
            </View>

            <View style={styles.statusRow}>
                <View style={[styles.statusDot, business.isOpen && styles.statusDotOpen]} />
                <Text style={[styles.statusText, business.isOpen && styles.statusTextOpen]}>
                    {business.isOpen ? 'Abierto ahora' : 'Cerrado'}
                </Text>
                {business.isOpen && <Text style={styles.statusHours}> • Cierra a las 10:00 PM</Text>}
            </View>

            {business.description && (
                <Text style={styles.description}>{business.description}</Text>
            )}

            {business.features.length > 0 && (
                <View style={styles.featuresContainer}>
                    {business.features.map((feature, index) => (
                        <View key={index} style={styles.featureChip}>
                            <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainInfo: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    businessName: {
        flex: 1,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 12,
    },
    favoriteButton: {
        padding: 4,
    },
    category: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        minHeight: 24,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
    },
    ratingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    reviewsCount: {
        fontSize: 15,
        color: '#666',
        marginLeft: 4,
    },
    noRatingText: {
        fontSize: 15,
        color: '#999',
        fontStyle: 'italic',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#C62828',
        marginRight: 8,
    },
    statusDotOpen: {
        backgroundColor: '#2E7D32',
    },
    statusText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#C62828',
    },
    statusTextOpen: {
        color: '#2E7D32',
    },
    statusHours: {
        fontSize: 15,
        color: '#666',
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginBottom: 16,
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    featureChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#E8F5E9',
        borderRadius: 16,
    },
    featureText: {
        fontSize: 13,
        color: '#2E7D32',
        fontWeight: '500',
    },
});