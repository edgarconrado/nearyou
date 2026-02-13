import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Review } from '../../types/types';
import { ReviewCard } from './ReviewCard';

interface ReviewsListProps {
    filteredReviews: Review[];
    reviewFilter: number | 'all';
    onFilterChange: (filter: 'all') => void;
    onReviewOptions: (review: Review) => void;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
    filteredReviews,
    reviewFilter,
    onFilterChange,
    onReviewOptions,
}) => {
    const { t } = useLanguage();

    if (filteredReviews.length === 0) {
        return (
            <View style={styles.emptyReviews}>
                <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
                <Text style={styles.emptyReviewsText}>
                    {t('detail.noReviewsWithStars')} {reviewFilter} {t('detail.stars')}
                </Text>
                <TouchableOpacity onPress={() => onFilterChange('all')}>
                    <Text style={styles.showAllLink}>{t('reviewsList.viewAllReviews')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.reviewsList}>
            {filteredReviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    onOptions={() => onReviewOptions(review)}
                />
            ))}

            <TouchableOpacity style={styles.viewAllReviewsButton}>
                <Text style={styles.viewAllReviewsText}>{t('reviewsList.viewAllReviews')}</Text>
                <Ionicons name="chevron-forward" size={20} color="#003D7A" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    reviewsList: {
        gap: 16,
    },
    emptyReviews: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyReviewsText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 12,
    },
    showAllLink: {
        fontSize: 15,
        color: '#003D7A',
        fontWeight: '600',
    },
    viewAllReviewsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 4,
    },
    viewAllReviewsText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#003D7A',
    },
});