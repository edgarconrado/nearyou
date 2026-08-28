import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RatingDistribution, Review } from '../../types/types';
import { ReviewFilters } from './ReviewFilters';
import { ReviewsList } from './ReviewsList';
import { ReviewsSummary } from './ReviewsSummary';
import { WriteReviewButton } from './WriteReviewButton';

interface ReviewsTabProps {
    rating: number;
    reviews: Review[];
    filteredReviews: Review[];
    reviewFilter: number | 'all';
    ratingDistribution: RatingDistribution[];
    onWriteReview: () => void;
    onFilterChange: (filter: number | 'all') => void;
    onReviewOptions: (review: Review) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
    rating,
    reviews,
    filteredReviews,
    reviewFilter,
    ratingDistribution,
    onWriteReview,
    onFilterChange,
    onReviewOptions,
}) => {
    return (
        <View style={styles.section}>
            <WriteReviewButton onPress={onWriteReview} />

            <ReviewFilters
                reviewFilter={reviewFilter}
                onFilterChange={onFilterChange}
            />

            <ReviewsSummary
                rating={rating}
                reviewsCount={reviews.length}
                ratingDistribution={ratingDistribution}
            />

            <ReviewsList
                filteredReviews={filteredReviews}
                reviewFilter={reviewFilter}
                onFilterChange={onFilterChange}
                onReviewOptions={onReviewOptions}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 8,
    },
});