import { useLanguage } from '@/contexts/LanguageContext';
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
    const { t } = useLanguage();

    const renderStars = (count: number) => {
        const stars = [];
        const fullStars = Math.floor(count);
        const hasHalfStar = count % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Ionicons key={`full-${i}`} name="star" size={20} color="#FFB800" />);
        }

        if (hasHalfStar) {
            stars.push(<Ionicons key="half" name="star-half" size={20} color="#FFB800" />);
        }

        const remainingStars = 5 - Math.ceil(count);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={20} color="#FFB800" />);
        }

        return stars;
    };

    return (
        <View style={styles.summarySection}>
            <View style={styles.ratingOverview}>
                <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
                <View style={styles.starsRow}>{renderStars(rating)}</View>
                <Text style={styles.reviewsCount}>
                    {reviewsCount} {reviewsCount === 1 ? t('detail.review') : t('detail.reviews')}
                </Text>
            </View>

            <View style={styles.distributionBars}>
                {ratingDistribution.map((item) => (
                    <View key={item.stars} style={styles.barRow}>
                        <Text style={styles.starLabel}>{item.stars}</Text>
                        <Ionicons name="star" size={14} color="#FFB800" />
                        <View style={styles.barContainer}>
                            <View
                                style={[
                                    styles.barFill,
                                    { width: `${item.percentage}%` },
                                ]}
                            />
                        </View>
                        <Text style={styles.countLabel}>{item.count}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    summarySection: {
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    ratingOverview: {
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 8,
    },
    reviewsCount: {
        fontSize: 14,
        color: '#999',
    },
    distributionBars: {
        gap: 8,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    starLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        width: 12,
    },
    barContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#FFB800',
        borderRadius: 4,
    },
    countLabel: {
        fontSize: 13,
        color: '#999',
        width: 30,
        textAlign: 'right',
    },
});