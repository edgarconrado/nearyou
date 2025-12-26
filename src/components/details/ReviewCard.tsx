import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Review } from '../../types/types';

interface ReviewCardProps {
    review: Review;
    onOptions: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onOptions }) => {
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(<Ionicons key={i} name="star" size={14} color="#FFB800" />);
        }
        for (let i = rating; i < 5; i++) {
            stars.push(<Ionicons key={i} name="star-outline" size={14} color="#FFB800" />);
        }
        return stars;
    };

    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <Image source={{ uri: review.userAvatar }} style={styles.userAvatar} />
                <View style={styles.reviewHeaderInfo}>
                    <Text style={styles.userName}>{review.userName}</Text>
                    <View style={styles.reviewMeta}>
                        <View style={styles.starsRow}>{renderStars(review.rating)}</View>
                        <Text style={styles.reviewDate}> • {review.date}</Text>
                    </View>
                </View>
                {review.isOwn && (
                    <TouchableOpacity style={styles.moreButton} onPress={onOptions}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>

            {review.images && review.images.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.reviewImages}
                >
                    {review.images.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image }}
                            style={styles.reviewImage}
                            resizeMode="cover"
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    reviewCard: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
    },
    userAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    reviewHeaderInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    reviewMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewDate: {
        fontSize: 13,
        color: '#999',
    },
    moreButton: {
        padding: 4,
    },
    reviewComment: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginBottom: 12,
    },
    reviewImages: {
        marginTop: 8,
    },
    reviewImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginRight: 8,
    },
});