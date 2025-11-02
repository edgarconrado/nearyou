import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Business {
    id: number | string;
    name: string;
    rating: number;
    reviews?: number;
    category: string;
    distance: string;
    isOpen?: boolean;
    image?: string;
}

interface BusinessListItemProps {
    business: Business;
    onPress?: (business: Business) => void;
    style?: ViewStyle;
}

export default function BusinessListItem({
    business,
    onPress,
    style
}: BusinessListItemProps) {
    const handlePress = () => {
        if (onPress) {
            onPress(business);
        } else {
            router.push({
                pathname: '/detail',
                params: { businessId: business.id.toString() }
            });
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            {/* Thumbnail */}
            {business.image ? (
                <Image source={{ uri: business.image }} style={styles.thumbnail} />
            ) : (
                <View style={styles.thumbnailPlaceholder} />
            )}

            {/* Info */}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {business.name}
                </Text>

                <View style={styles.rating}>
                    <Ionicons name="star" size={14} color={Colors.accent} />
                    <Text style={styles.ratingText}>
                        {business.rating} ({business.reviews || 0})
                    </Text>
                </View>

                <Text style={styles.meta} numberOfLines={1}>
                    {business.category} • {business.distance}
                </Text>

                <View style={styles.badges}>
                    <View style={styles.distanceBadge}>
                        <Ionicons name="location" size={12} color={Colors.textTertiary} />
                        <Text style={styles.badgeText}>{business.distance}</Text>
                    </View>
                    {business.isOpen !== undefined && (
                        <Text style={[
                            styles.statusText,
                            { color: business.isOpen ? Colors.open : Colors.closed }
                        ]}>
                            {business.isOpen ? 'Abierto ahora' : 'Cerrado'}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        flexDirection: 'row',
        overflow: 'hidden',
        ...Colors.shadow,
    },
    thumbnail: {
        width: 112,
        height: 112,
    },
    thumbnailPlaceholder: {
        width: 112,
        height: 112,
        backgroundColor: Colors.primaryLight,
    },
    info: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    ratingText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    meta: {
        fontSize: 12,
        color: Colors.textTertiary,
        marginBottom: 8,
    },
    badges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.grayLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 11,
        color: Colors.textTertiary,
        fontWeight: '600',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
});