import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Business {
    id: number | string;
    name: string;
    rating: number;
    category: string;
    price: string;
    distance: string;
    image?: string;
}

interface BusinessCardProps {
    business: Business;
    onPress?: (business: Business) => void;
    style?: ViewStyle;
}

export default function BusinessCard({
    business,
    onPress,
    style
}: BusinessCardProps) {
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
            {/* Image */}
            {business.image ? (
                <Image source={{ uri: business.image }} style={styles.image} />
            ) : (
                <View style={styles.imagePlaceholder} />
            )}

            {/* Info */}
            <View style={styles.info}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>
                        {business.name}
                    </Text>
                    <View style={styles.rating}>
                        <Ionicons name="star" size={16} color={Colors.accent} />
                        <Text style={styles.ratingText}>{business.rating}</Text>
                    </View>
                </View>

                <Text style={styles.meta} numberOfLines={1}>
                    {business.category} • {business.price}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.distanceBadge}>
                        <Ionicons name="location" size={14} color={Colors.textTertiary} />
                        <Text style={styles.distanceText}>{business.distance}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        ...Colors.shadow,
    },
    image: {
        width: '100%',
        height: 160,
    },
    imagePlaceholder: {
        width: '100%',
        height: 160,
        backgroundColor: Colors.primaryLight,
    },
    info: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    meta: {
        color: Colors.textTertiary,
        fontSize: 14,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    distanceText: {
        color: Colors.textTertiary,
        fontSize: 12,
    },
});