import { palette, spacing, type } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
            <View style={styles.empty}>
                <Ionicons name="chatbubble-outline" size={40} color={palette.faint} />
                <Text style={styles.emptyText}>
                    {t('detail.noReviewsWithStars')} {reviewFilter} {t('detail.stars')}
                </Text>
                <Pressable onPress={() => onFilterChange('all')} hitSlop={8}>
                    <Text style={styles.link}>{t('reviewsList.viewAllReviews')}</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View>
            {filteredReviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    onOptions={() => onReviewOptions(review)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    empty: {
        alignItems: 'center',
        paddingVertical: spacing.xxxl,
        gap: spacing.sm,
    },
    emptyText: { ...type.small, textAlign: 'center' },
    link: {
        ...type.smallStrong,
        textDecorationLine: 'underline',
        marginTop: spacing.xs,
    },
});