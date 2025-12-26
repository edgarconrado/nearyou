import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Business } from '../../types/types';

interface BusinessCardProps {
    business: Business;
    onPress: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, onPress }) => {
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

    return (
        <TouchableOpacity
            style={styles.businessCard}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Image
                source={{ uri: business.image }}
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
                        business.isOpen ? styles.statusOpen : styles.statusClosed
                    ]}>
                        <Text style={[
                            styles.statusText,
                            !business.isOpen && styles.statusTextClosed
                        ]}>
                            {business.isOpen ? 'Abierto' : 'Cerrado'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.businessCategory}>{business.category}</Text>
                <Text style={styles.businessDescription} numberOfLines={2}>
                    {business.description}
                </Text>

                <View style={styles.businessMeta}>
                    <View style={styles.ratingContainer}>
                        <View style={styles.starsRow}>
                            {renderStars(business.rating)}
                        </View>
                        <Text style={styles.ratingText}>
                            {business.rating} ({business.reviews})
                        </Text>
                    </View>
                    <View style={styles.distanceContainer}>
                        <Ionicons name="navigate-outline" size={14} color="#666" />
                        <Text style={styles.distanceText}>{business.distance}</Text>
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