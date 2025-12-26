import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RatingDistribution } from '../../types/types';

interface ReviewsSummaryProps {
    rating: number;
    reviewsCount: number;
    ratingDistribution: RatingDistribution[];
}

export const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({
    rating,
    reviewsCount,
    ratingDistribution,
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
            stars.push(
                <Ionicons key={`empty-${i}`} name="star-outline" size={size} color="#FFB800" />
            );
        }
        return stars;
    };

    return (
        <View style={styles.ratingSummary}>
            <View style={styles.ratingOverview}>
                <Text style={styles.ratingNumber}>{rating}</Text>
                <View style={styles.starsColumn}>
                    <View style={styles.starsRow}>{renderStars(rating, 18)}</View>
                    <Text style={styles.totalReviews}>Basado en {reviewsCount} opiniones</Text>
                </View>
            </View>

            <View style={styles.ratingBars}>
                {ratingDistribution.map((item) => (
                    <View key={item.stars} style={styles.ratingBarRow}>
                        <Text style={styles.starsLabel}>{item.stars}</Text>
                        <Ionicons name="star" size={14} color="#FFB800" />
                        <View style={styles.barContainer}>
                            <View style={[styles.barFill, { width: `${item.percentage}%` }]} />
                        </View>
                        <Text style={styles.countLabel}>{item.count}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    ratingSummary: {
        marginBottom: 24,
    },
    ratingOverview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    ratingNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
    },
    starsColumn: {
        gap: 4,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
    },
    totalReviews: {
        fontSize: 13,
        color: '#666',
    },
    ratingBars: {
        gap: 8,
    },
    ratingBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    starsLabel: {
        fontSize: 13,
        color: '#666',
        width: 12,
    },
    barContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#FFB800',
    },
    countLabel: {
        fontSize: 13,
        color: '#666',
        width: 30,
        textAlign: 'right',
    },
});